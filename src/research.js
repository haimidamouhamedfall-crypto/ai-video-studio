// Web research using public, CORS-enabled APIs (no server needed): GitHub, Hugging Face Hub, Wikipedia, Hacker News.
const strip = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#039;/g, "'");

async function getJSON(url, opt = {}) {
  const r = await fetch(url, { signal: typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? AbortSignal.timeout(12000) : undefined, ...opt });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

export async function searchGitHub(q) {
  const d = await getJSON(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=8`, { headers: { Accept: 'application/vnd.github+json' } });
  return (d.items || []).map((r) => ({ title: r.full_name, url: r.html_url, text: r.description || '', meta: `★ ${r.stargazers_count} · ${r.language || '-'} · ${r.license?.spdx_id || '-'}` }));
}
export async function searchModels(q, tag) {
  const u = `https://huggingface.co/api/models?search=${encodeURIComponent(q)}&sort=likes&direction=-1&limit=8${tag ? `&pipeline_tag=${tag}` : ''}`;
  const d = await getJSON(u);
  return (Array.isArray(d) ? d : []).map((m) => ({ title: m.id, url: `https://huggingface.co/${m.id}`, text: m.pipeline_tag || '', meta: `♥ ${m.likes ?? 0} · ⬇ ${m.downloads ?? 0}`, model: m.id, tag: m.pipeline_tag || '' }));
}
export async function searchWikipedia(q, lang = 'en') {
  const l = ['ar', 'fr', 'en'].includes(lang) ? lang : 'en';
  const d = await getJSON(`https://${l}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srlimit=6&format=json&origin=*`);
  return (d.query?.search || []).map((r) => ({ title: r.title, url: `https://${l}.wikipedia.org/wiki/${encodeURIComponent(r.title.replace(/ /g, '_'))}`, text: strip(r.snippet), meta: '' }));
}
export async function searchNews(q) {
  const d = await getJSON(`https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=6`);
  return (d.hits || []).filter((h) => h.title).map((h) => ({ title: h.title, url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`, text: '', meta: `▲ ${h.points ?? 0} · 💬 ${h.num_comments ?? 0}` }));
}
export async function researchAll(q, lang = 'en') {
  const jobs = { github: searchGitHub(q), models: searchModels(q), wiki: searchWikipedia(q, lang), news: searchNews(q) };
  const out = {};
  await Promise.all(Object.entries(jobs).map(async ([k, p]) => {
    try { out[k] = { items: await p }; } catch (e) { out[k] = { items: [], error: String(e.message || e) }; }
  }));
  return out;
}
// Flatten results into plain text that fits an LLM prompt.
export function toContext(res, max = 6000) {
  const lines = [];
  for (const [k, v] of Object.entries(res || {})) for (const it of v.items || []) lines.push(`[${k}] ${it.title} — ${it.text} ${it.meta} (${it.url})`.replace(/\s+/g, ' ').trim());
  return lines.join('\n').slice(0, max);
}
