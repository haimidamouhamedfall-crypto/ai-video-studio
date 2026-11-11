// AI analysis: turn research into a summary + storyboard, and improve prompts.
import { api } from './hf.js';

const LANG_NAME = { ar: 'Arabic', fr: 'French', en: 'English' };

// Extract the first balanced {...} JSON object from a model answer (handles ```json fences and chatter).
export function parseJSON(text) {
  const s = String(text || '');
  const start = s.indexOf('{');
  if (start < 0) return null;
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (inStr) { if (esc) esc = false; else if (ch === '\\') esc = true; else if (ch === '"') inStr = false; continue; }
    if (ch === '"') inStr = true;
    else if (ch === '{') depth++;
    else if (ch === '}' && --depth === 0) { try { return JSON.parse(s.slice(start, i + 1)); } catch { return null; } }
  }
  return null;
}

export async function analyze(topic, context, lang = 'en', n = 5) {
  const system = 'You are a research analyst and a video director. Use ONLY the provided sources for facts; do not invent statistics. Answer with a single JSON object and nothing else.';
  const user = `Topic: ${topic}
Write "summary", "key_points", "title" and "narration" in ${LANG_NAME[lang] || 'English'}.
Write "image_prompt" and "video_prompt" in English: concrete visuals, lighting, camera, no text in the image.
Sources:
${context || '(no sources found, use general knowledge carefully)'}

Return exactly this JSON shape with ${n} scenes:
{"summary":"...","key_points":["..."],"scenes":[{"title":"...","narration":"one or two short sentences","image_prompt":"...","video_prompt":"..."}]}`;
  const txt = await api.chat([{ role: 'system', content: system }, { role: 'user', content: user }], { maxTokens: 2200 });
  const j = parseJSON(txt);
  if (!j || !Array.isArray(j.scenes) || !j.scenes.length) { const e = new Error('BAD_JSON'); e.code = 'BAD_JSON'; throw e; }
  return {
    summary: String(j.summary || ''),
    key_points: (j.key_points || []).map(String).slice(0, 8),
    scenes: j.scenes.slice(0, 12).map((s) => ({ title: String(s.title || ''), narration: String(s.narration || ''), image_prompt: String(s.image_prompt || ''), video_prompt: String(s.video_prompt || s.image_prompt || '') }))
  };
}

export async function enhancePrompt(prompt, kind = 'image') {
  const what = kind === 'video' ? 'a text-to-video model (describe subject, motion, camera movement, lighting, style, 1-2 sentences)' : 'a text-to-image model (subject, composition, lighting, style, lens)';
  const out = await api.chat([
    { role: 'system', content: `You rewrite user ideas into one excellent English prompt for ${what}. Output only the prompt, no quotes.` },
    { role: 'user', content: prompt }
  ], { maxTokens: 250, temperature: 0.7 });
  return out.trim().replace(/^["']|["']$/g, '') || prompt;
}
