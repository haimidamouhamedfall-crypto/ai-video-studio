"""البحث في الإنترنت لجمع أفضل المعلومات قبل التوليد."""
try:
    from ddgs import DDGS
except ImportError:
    from duckduckgo_search import DDGS


def web_research(query: str, max_results: int = 6) -> list[dict]:
    with DDGS() as d:
        rows = d.text(query, max_results=max_results) or []
    return [
        {"title": r.get("title", ""), "url": r.get("href", ""), "snippet": r.get("body", "")}
        for r in rows
    ]
