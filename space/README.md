---
title: AI Video Studio Backend
emoji: 🎬
colorFrom: indigo
colorTo: purple
sdk: gradio
sdk_version: 5.29.0
python_version: "3.10"
app_file: app.py
pinned: false
license: apache-2.0
---

Backend for **AI Video Studio**: text-to-video with LTX-Video (diffusers) and optional FLUX.1-schnell images.
Set the Space hardware to **ZeroGPU** (HF PRO) or any GPU. Optional variables: `ENABLE_IMAGE=1`, `VIDEO_MODEL`, `GPU_SECONDS`.
