"""تحليل نتائج البحث وتحويلها إلى وصف سينمائي احترافي (Prompt)."""
import os
import httpx

SYSTEM = (
    "You are an expert prompt engineer for text-to-image and text-to-video models. "
    "Using the user's idea and the web research notes, write ONE detailed English prompt: "
    "subject, setting, lighting, camera movement, style, mood. Max 120 words. Output only the prompt."
)


def enhance_prompt(idea: str, research: list[dict]) -> str:
    notes = "\n".join(f"- {r['title']}: {r['snippet']}" for r in research[:6])
    base = os.getenv("LLM_BASE_URL")
    if not base:  # بدون نموذج لغوي: دمج بسيط
        return f"{idea}, cinematic lighting, highly detailed, 4k, smooth camera motion"
    r = httpx.post(
        f"{base.rstrip('/')}/chat/completions",
        headers={"Authorization": f"Bearer {os.getenv('LLM_API_KEY', '')}"},
        json={
            "model": os.getenv("LLM_MODEL", "llama3.1"),
            "messages": [
                {"role": "system", "content": SYSTEM},
                {"role": "user", "content": f"Idea: {idea}\n\nResearch:\n{notes}"},
            ],
        },
        timeout=120,
    )
    r.raise_for_status()
    return r.json()["choices"][0]["message"]["content"].strip()
