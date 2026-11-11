// Thin wrapper over the open-source Hugging Face inference client (github.com/huggingface/huggingface.js).
import { InferenceClient } from '@huggingface/inference';
import { getSettings } from './store.js';
import { t } from './i18n.js';

function ctx() {
  const s = getSettings();
  if (!s.token) { const e = new Error('NO_TOKEN'); e.code = 'NO_TOKEN'; throw e; }
  return { s, c: new InferenceClient(s.token), provider: s.provider || 'auto' };
}

// `api` is an object so tests (and future backends) can replace individual methods.
export const api = {
  async image(prompt, { model, width, height } = {}) {
    const { s, c, provider } = ctx();
    const parameters = {};
    if (width && height) { parameters.width = width; parameters.height = height; }
    return c.textToImage({ provider, model: model || s.imageModel, inputs: prompt, parameters }, { outputType: 'blob' });
  },
  async video(prompt, { model } = {}) {
    const { s, c, provider } = ctx();
    return c.textToVideo({ provider, model: model || s.videoModel, inputs: prompt });
  },
  async imageToVideo(blob, prompt, { model } = {}) {
    const { s, c, provider } = ctx();
    return c.imageToVideo({ provider, model: model || s.i2vModel, inputs: blob, parameters: { prompt } });
  },
  async chat(messages, { model, maxTokens = 1800, temperature = 0.4 } = {}) {
    const { s, c, provider } = ctx();
    const r = await c.chatCompletion({ provider, model: model || s.chatModel, messages, max_tokens: maxTokens, temperature });
    return r?.choices?.[0]?.message?.content || '';
  },
  async whoami() {
    const s = getSettings();
    if (!s.token) { const e = new Error('NO_TOKEN'); e.code = 'NO_TOKEN'; throw e; }
    const r = await fetch('https://huggingface.co/api/whoami-v2', { headers: { Authorization: `Bearer ${s.token}` } });
    if (!r.ok) { const e = new Error(`HTTP ${r.status}`); e.status = r.status; throw e; }
    return r.json();
  }
};

// Turn any error into a short message in the UI language.
export function explain(e) {
  const status = e?.status || e?.httpResponse?.status;
  const msg = String(e?.message || e || '');
  if (e?.code === 'NO_TOKEN' || msg === 'NO_TOKEN') return t('err_token');
  if (status === 401 || status === 403 || /unauthor|invalid (user )?token|forbidden/i.test(msg)) return t('err_auth');
  if (status === 402 || status === 429 || /credit|payment|quota|exceeded|rate limit/i.test(msg)) return t('err_credits');
  if (status === 404 || /not found|not supported|no provider|isn't available|unavailable/i.test(msg)) return t('err_model');
  return `${t('err_generic')}: ${msg.slice(0, 160)}`;
}
