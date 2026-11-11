"""Upload the ./space folder to the Hugging Face Space (used by GitHub Actions)."""
import os
from huggingface_hub import HfApi

token = os.environ["HF_TOKEN"]
repo = os.environ["HF_SPACE"]  # e.g. username/ai-video-studio-backend
api = HfApi(token=token)
api.create_repo(repo_id=repo, repo_type="space", space_sdk="gradio", exist_ok=True)
api.upload_folder(folder_path="space", repo_id=repo, repo_type="space",
                  commit_message="Sync from GitHub")
print("Synced to https://huggingface.co/spaces/" + repo)
