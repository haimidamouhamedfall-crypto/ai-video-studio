"""توليد الصور والفيديو: remote (Hugging Face) أو local (diffusers + GPU)."""
import os

_pipes: dict = {}


def _mode() -> str:
    return os.getenv("MODE", "remote")


def generate_image(prompt: str, path: str) -> None:
    if _mode() == "remote":
        from huggingface_hub import InferenceClient
        client = InferenceClient(token=os.getenv("HF_TOKEN"))
        img = client.text_to_image(prompt, model=os.getenv("IMAGE_MODEL", "black-forest-labs/FLUX.1-schnell"))
        img.save(path)
        return
    import torch
    from diffusers import AutoPipelineForText2Image
    if "img" not in _pipes:
        p = AutoPipelineForText2Image.from_pretrained("stabilityai/sdxl-turbo", torch_dtype=torch.float16, variant="fp16")
        p.enable_model_cpu_offload()
        _pipes["img"] = p
    _pipes["img"](prompt, num_inference_steps=4, guidance_scale=0.0).images[0].save(path)


def generate_video(prompt: str, path: str) -> None:
    if _mode() == "remote":
        from huggingface_hub import InferenceClient
        client = InferenceClient(token=os.getenv("HF_TOKEN"))
        data = client.text_to_video(prompt, model=os.getenv("VIDEO_MODEL", "Lightricks/LTX-Video"))
        with open(path, "wb") as f:
            f.write(data)
        return
    import torch
    from diffusers import CogVideoXPipeline
    from diffusers.utils import export_to_video
    if "vid" not in _pipes:
        p = CogVideoXPipeline.from_pretrained("THUDM/CogVideoX-2b", torch_dtype=torch.float16)
        p.enable_model_cpu_offload()
        p.vae.enable_tiling()
        _pipes["vid"] = p
    frames = _pipes["vid"](prompt=prompt, num_frames=49, num_inference_steps=50).frames[0]
    export_to_video(frames, path, fps=8)
