"""AI Video Studio — backend (Hugging Face Space, Gradio + diffusers).

Open-source building blocks:
  - diffusers (Apache-2.0)           https://github.com/huggingface/diffusers
  - LTX-Video (Lightricks)           https://github.com/Lightricks/LTX-Video
  - FLUX.1-schnell (Apache-2.0)      optional image model (ENABLE_IMAGE=1)

API endpoints used by the web app:  /video  and  /image
"""
import os
import random
import tempfile

import gradio as gr
import torch
from diffusers.utils import export_to_video

try:  # ZeroGPU on Hugging Face (PRO) — harmless elsewhere
    import spaces
    gpu = spaces.GPU(duration=int(os.environ.get("GPU_SECONDS", "120")))
except Exception:  # no `spaces` package → run as is (needs a local GPU)
    def gpu(fn):
        return fn

VIDEO_MODEL = os.environ.get("VIDEO_MODEL", "Lightricks/LTX-Video")
IMAGE_MODEL = os.environ.get("IMAGE_MODEL", "black-forest-labs/FLUX.1-schnell")
ENABLE_IMAGE = os.environ.get("ENABLE_IMAGE", "0") == "1"
DEFAULT_NEG = "worst quality, inconsistent motion, blurry, jittery, distorted, watermark"

from diffusers import LTXPipeline  # noqa: E402

video_pipe = LTXPipeline.from_pretrained(VIDEO_MODEL, torch_dtype=torch.bfloat16)
video_pipe.to("cuda")

image_pipe = None
if ENABLE_IMAGE:
    from diffusers import FluxPipeline
    image_pipe = FluxPipeline.from_pretrained(IMAGE_MODEL, torch_dtype=torch.bfloat16)
    image_pipe.to("cuda")


def _seed(value):
    value = int(value)
    return random.randint(0, 2**31 - 1) if value < 0 else value


@gpu
def video(prompt, negative, width, height, frames, steps, seed):
    width = max(256, (int(width) // 32) * 32)       # LTX needs multiples of 32
    height = max(256, (int(height) // 32) * 32)
    frames = max(9, ((int(frames) - 1) // 8) * 8 + 1)  # and 8k+1 frames
    generator = torch.Generator("cuda").manual_seed(_seed(seed))
    out = video_pipe(
        prompt=prompt,
        negative_prompt=negative or DEFAULT_NEG,
        width=width,
        height=height,
        num_frames=frames,
        num_inference_steps=int(steps),
        generator=generator,
    ).frames[0]
    path = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False).name
    export_to_video(out, path, fps=24)
    return path


@gpu
def image(prompt, width, height, seed):
    if image_pipe is None:
        raise gr.Error("Image model disabled. Set ENABLE_IMAGE=1 in the Space variables.")
    generator = torch.Generator("cuda").manual_seed(_seed(seed))
    return image_pipe(
        prompt=prompt,
        width=(int(width) // 16) * 16,
        height=(int(height) // 16) * 16,
        guidance_scale=0.0,
        num_inference_steps=4,
        max_sequence_length=256,
        generator=generator,
    ).images[0]


with gr.Blocks(title="AI Video Studio backend") as demo:
    gr.Markdown("# 🎬 AI Video Studio — backend\nUsed by the web app through the API (`/video`, `/image`).")
    with gr.Tab("Video"):
        p = gr.Textbox(label="Prompt (English)", lines=3)
        n = gr.Textbox(label="Negative prompt")
        with gr.Row():
            w = gr.Number(704, label="Width")
            h = gr.Number(480, label="Height")
            f = gr.Number(97, label="Frames (8k+1)")
            s = gr.Number(30, label="Steps")
            sd = gr.Number(-1, label="Seed (-1 random)")
        v_out = gr.Video(label="Result")
        gr.Button("Generate video").click(video, [p, n, w, h, f, s, sd], v_out, api_name="video")
    with gr.Tab("Image"):
        ip = gr.Textbox(label="Prompt (English)", lines=3)
        with gr.Row():
            iw = gr.Number(1024, label="Width")
            ih = gr.Number(1024, label="Height")
            isd = gr.Number(-1, label="Seed")
        i_out = gr.Image(label="Result")
        gr.Button("Generate image").click(image, [ip, iw, ih, isd], i_out, api_name="image")

demo.queue(max_size=8).launch()
