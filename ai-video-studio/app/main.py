import os, uuid, traceback
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from .search import web_research
from .llm import enhance_prompt
from .generators import generate_image, generate_video

OUT = Path(os.getenv("OUTPUT_DIR", "outputs"))
OUT.mkdir(exist_ok=True)
app = FastAPI(title="AI Video Studio")
JOBS: dict[str, dict] = {}


class Idea(BaseModel):
    idea: str


class GenReq(BaseModel):
    prompt: str
    kind: str = "video"  # image | video


@app.post("/api/analyze")
def analyze(req: Idea):
    """بحث في الإنترنت ثم تحليل وكتابة وصف احترافي."""
    try:
        research = web_research(req.idea)
    except Exception:
        research = []
    return {"research": research, "prompt": enhance_prompt(req.idea, research)}


def _run(job_id: str, req: GenReq):
    ext = "png" if req.kind == "image" else "mp4"
    path = OUT / f"{job_id}.{ext}"
    try:
        (generate_image if req.kind == "image" else generate_video)(req.prompt, str(path))
        JOBS[job_id] = {"status": "done", "url": f"/outputs/{path.name}"}
    except Exception as e:
        traceback.print_exc()
        JOBS[job_id] = {"status": "error", "error": str(e)}


@app.post("/api/generate")
def generate(req: GenReq, bg: BackgroundTasks):
    if req.kind not in ("image", "video"):
        raise HTTPException(400, "kind must be image or video")
    job_id = uuid.uuid4().hex[:12]
    JOBS[job_id] = {"status": "running"}
    bg.add_task(_run, job_id, req)
    return {"job_id": job_id}


@app.get("/api/jobs/{job_id}")
def job(job_id: str):
    if job_id not in JOBS:
        raise HTTPException(404, "not found")
    return JOBS[job_id]


app.mount("/outputs", StaticFiles(directory=OUT), name="outputs")


@app.get("/")
def index():
    return FileResponse("static/index.html")
