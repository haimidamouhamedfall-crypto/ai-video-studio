// Local video assembly: Ken-Burns motion + crossfades + captions on a canvas, recorded with MediaRecorder.
export const ASPECTS = { '9:16': [720, 1280], '16:9': [1280, 720], '1:1': [960, 960] };

// Which scene is on screen at time t (seconds), progress inside it, and the cross-fade amount into the next scene.
export function frameState(t, n, sec, fade) {
  const total = n * sec;
  const tt = Math.min(Math.max(t, 0), total - 1e-6);
  const i = Math.min(n - 1, Math.floor(tt / sec));
  const p = (tt - i * sec) / sec;
  let next = 0;
  const left = (i + 1) * sec - tt;
  if (i < n - 1 && fade > 0 && left < fade) next = 1 - left / fade;
  return { i, p, next, total };
}

function drawCover(ctx, img, W, H, scale, panX, panY) {
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const base = Math.max(W / iw, H / ih) * scale;
  const w = iw * base, h = ih * base;
  const x = (W - w) / 2 + panX * (w - W) / 2, y = (H - h) / 2 + panY * (h - H) / 2;
  ctx.drawImage(img, x, y, w, h);
}

const isRTL = (s) => /[\u0590-\u08FF]/.test(s || '');
function wrap(ctx, text, maxW) {
  const words = String(text || '').split(/\s+/).filter(Boolean), lines = [];
  let cur = '';
  for (const w of words) { const n = cur ? `${cur} ${w}` : w; if (ctx.measureText(n).width > maxW && cur) { lines.push(cur); cur = w; } else cur = n; }
  if (cur) lines.push(cur);
  return lines;
}
function drawCaption(ctx, text, W, H) {
  if (!text) return;
  const fs = Math.round(W * 0.045);
  ctx.font = `bold ${fs}px system-ui, "Noto Naskh Arabic", Arial, sans-serif`;
  ctx.direction = isRTL(text) ? 'rtl' : 'ltr';
  ctx.textAlign = 'center'; ctx.textBaseline = 'top';
  const lines = wrap(ctx, text, W * 0.84).slice(0, 5), lh = fs * 1.4, pad = fs * 0.6;
  const bh = lines.length * lh + pad * 2, by = H - bh - H * 0.06;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(W * 0.04, by, W * 0.92, bh);
  ctx.fillStyle = '#fff';
  lines.forEach((l, k) => ctx.fillText(l, W / 2, by + pad + k * lh));
}

// Draw one frame. scenes: [{img, caption}] where img is a loaded Image/ImageBitmap/canvas.
export function drawFrame(ctx, W, H, scenes, st, { captions = true } = {}) {
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const motion = (idx, p) => {
    const zoomIn = idx % 2 === 0;
    const scale = zoomIn ? 1.05 + 0.12 * p : 1.17 - 0.12 * p;
    return [scale, (idx % 3 - 1) * 0.5 * (p - 0.5), (idx % 2 ? 1 : -1) * 0.3 * (p - 0.5)];
  };
  const cur = scenes[st.i];
  if (cur?.img) { const [s, px, py] = motion(st.i, st.p); drawCover(ctx, cur.img, W, H, s, px, py); }
  const nx = scenes[st.i + 1];
  if (st.next > 0 && nx?.img) { ctx.globalAlpha = st.next; const [s, px, py] = motion(st.i + 1, 0); drawCover(ctx, nx.img, W, H, s, px, py); ctx.globalAlpha = 1; }
  if (captions) drawCaption(ctx, (st.next > 0.5 && nx ? nx : cur)?.caption, W, H);
}

export function pickMime() {
  if (typeof MediaRecorder === 'undefined') return '';
  return ['video/mp4;codecs=avc1.42E01E', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find((m) => MediaRecorder.isTypeSupported(m)) || '';
}

const loadImage = (blob) => new Promise((res, rej) => {
  const url = URL.createObjectURL(blob), im = new Image();
  im.onload = () => res(im); im.onerror = () => rej(new Error('image load failed')); im.src = url;
});

// scenes: [{blob, caption}] -> Blob (mp4 when the browser supports it, otherwise webm)
export async function assemble(scenes, { seconds = 4, fade = 0.8, aspect = '9:16', captions = true, music = null, fps = 30, onProgress = () => {} } = {}) {
  const mime = pickMime();
  if (!mime || typeof HTMLCanvasElement === 'undefined' || !HTMLCanvasElement.prototype.captureStream) { const e = new Error('NO_MEDIA'); e.code = 'NO_MEDIA'; throw e; }
  const [W, H] = ASPECTS[aspect] || ASPECTS['9:16'];
  const imgs = await Promise.all(scenes.map(async (s) => ({ img: await loadImage(s.blob), caption: s.caption })));
  const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const stream = canvas.captureStream(fps);
  let audio = null, actx = null;
  if (music) {
    audio = new Audio(URL.createObjectURL(music)); audio.loop = true;
    actx = new (window.AudioContext || window.webkitAudioContext)();
    const dest = actx.createMediaStreamDestination();
    actx.createMediaElementSource(audio).connect(dest);
    dest.stream.getAudioTracks().forEach((tr) => stream.addTrack(tr));
  }
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4_000_000 });
  const chunks = [];
  rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  const done = new Promise((res) => { rec.onstop = () => res(new Blob(chunks, { type: mime.split(';')[0] })); });
  const total = imgs.length * seconds;
  rec.start(500);
  if (audio) { await actx.resume?.(); audio.play().catch(() => {}); }
  const t0 = performance.now();
  await new Promise((res) => {
    const tick = () => {
      const t = (performance.now() - t0) / 1000;
      drawFrame(ctx, W, H, imgs, frameState(t, imgs.length, seconds, fade), { captions });
      onProgress(Math.min(1, t / total));
      if (t >= total) res(); else requestAnimationFrame(tick);
    };
    tick();
  });
  rec.stop();
  if (audio) { audio.pause(); actx.close?.(); }
  return done;
}
