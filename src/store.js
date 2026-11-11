// Settings (localStorage) and library (IndexedDB). Nothing leaves the device except API calls you trigger.
export const DEFAULTS = {
  token: '',
  provider: 'auto',
  imageModel: 'black-forest-labs/FLUX.1-schnell',
  videoModel: 'Wan-AI/Wan2.1-T2V-14B',
  i2vModel: 'Wan-AI/Wan2.1-I2V-14B-720P',
  chatModel: 'Qwen/Qwen2.5-72B-Instruct'
};
export const PROVIDERS = ['auto', 'fal-ai', 'replicate', 'together', 'novita', 'wavespeed', 'nscale', 'hf-inference'];

export function getSettings() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('avs_settings') || '{}') }; } catch { return { ...DEFAULTS }; }
}
export function saveSettings(s) { localStorage.setItem('avs_settings', JSON.stringify({ ...getSettings(), ...s })); }

function db() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('avs', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('items', { keyPath: 'id' });
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
function tx(mode, fn) {
  return db().then((d) => new Promise((res, rej) => {
    const t = d.transaction('items', mode), s = t.objectStore('items'), r = fn(s);
    t.oncomplete = () => res(r && 'result' in r ? r.result : undefined);
    t.onerror = () => rej(t.error);
  }));
}
export async function saveItem(it) {
  const item = { id: it.id || `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`, created: it.created || Date.now(), ...it };
  item.id = item.id || `${Date.now()}`;
  await tx('readwrite', (s) => s.put(item));
  return item;
}
export async function listItems() {
  const all = (await tx('readonly', (s) => s.getAll())) || [];
  return all.sort((a, b) => b.created - a.created);
}
export function deleteItem(id) { return tx('readwrite', (s) => s.delete(id)); }
export async function clearAll() {
  try { localStorage.removeItem('avs_settings'); } catch { /* ignore */ }
  await tx('readwrite', (s) => s.clear());
}
