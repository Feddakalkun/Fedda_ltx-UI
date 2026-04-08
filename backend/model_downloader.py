import requests
import threading
import time
from pathlib import Path
from typing import Optional, Dict, List, Tuple

class ModelDownloader:
    def __init__(self, root_dir: Path):
        self.root_dir = root_dir
        self.comfy_models_dir = root_dir / "ComfyUI" / "models"
        self.progress: Dict[str, dict] = {}
        self.lock = threading.Lock()
        self._ltx_packs: Dict[str, List[Tuple[str, str, Optional[str]]]] = {
            # (url, destination model subdir, optional rename)
            "ltx23_core": [
                (
                    "https://huggingface.co/Kijai/LTX2.3_comfy/resolve/main/diffusion_models/ltx-2.3-22b-dev_transformer_only_fp8_scaled.safetensors",
                    "diffusion_models",
                    None,
                ),
                (
                    "https://huggingface.co/Kijai/LTX2.3_comfy/resolve/main/text_encoders/ltx-2.3_text_projection_bf16.safetensors",
                    "text_encoders",
                    None,
                ),
                (
                    "https://huggingface.co/Comfy-Org/ltx-2/resolve/main/split_files/text_encoders/gemma_3_12B_it.safetensors",
                    "text_encoders",
                    None,
                ),
                (
                    "https://huggingface.co/Kijai/LTX2.3_comfy/resolve/main/vae/LTX23_video_vae_bf16.safetensors",
                    "vae",
                    None,
                ),
                (
                    "https://huggingface.co/Kijai/LTX2.3_comfy/resolve/main/vae/LTX23_audio_vae_bf16.safetensors",
                    "vae",
                    None,
                ),
                (
                    "https://huggingface.co/Lightricks/LTX-2.3/resolve/main/ltx-2.3-22b-distilled-lora-384.safetensors",
                    "loras",
                    None,
                ),
                (
                    "https://huggingface.co/valiantcat/LTX-2.3-Transition-LORA/resolve/main/ltx2.3-transition.safetensors",
                    "loras",
                    None,
                ),
            ],
            "ltx23": [
                (
                    "https://huggingface.co/Lightricks/LTX-2.3/resolve/main/ltx-2.3-22b-distilled-lora-384.safetensors",
                    "loras",
                    None,
                ),
                (
                    "https://huggingface.co/Lightricks/LTX-2.3-22b-IC-LoRA-Union-Control/resolve/main/ltx-2.3-22b-ic-lora-union-control-ref0.5.safetensors",
                    "loras",
                    None,
                ),
                (
                    "https://huggingface.co/jingheya/lotus-depth-g-v2-0-disparity/resolve/main/unet/diffusion_pytorch_model.safetensors",
                    "unet",
                    "lotus-depth-g-v2-0-disparity.safetensors",
                ),
                (
                    "https://huggingface.co/stabilityai/sd-vae-ft-mse-original/resolve/main/vae-ft-mse-840000-ema-pruned.safetensors",
                    "vae",
                    None,
                ),
            ],
            # Keep compatibility with the current settings labels.
            "ltx2": [
                (
                    "https://huggingface.co/Comfy-Org/ltx-2/resolve/main/split_files/text_encoders/gemma_3_12B_it.safetensors",
                    "text_encoders",
                    None,
                ),
                (
                    "https://huggingface.co/Comfy-Org/ltx-2/resolve/main/split_files/text_encoders/qwen_0.6b_ace15.safetensors",
                    "text_encoders",
                    None,
                ),
            ],
        }

    def get_progress(self, filename: str) -> dict:
        with self.lock:
            return self.progress.get(filename, {"status": "idle", "progress": 0})

    def _update_progress(self, filename: str, status: str, progress: int = 0, error: str = None):
        with self.lock:
            self.progress[filename] = {
                "status": status,
                "progress": progress,
                "error": error,
                "timestamp": time.time()
            }

    def download_direct(self, url: str, dest_path: Path, filename: str, headers: Optional[dict] = None):
        """Standard HTTP download with progress tracking."""
        try:
            self._update_progress(filename, "downloading", 0)
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            
            response = requests.get(url, stream=True, timeout=30, headers=headers or {})
            response.raise_for_status()

            total_size = int(response.headers.get('content-length', 0))
            downloaded_size = 0

            with open(dest_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=65536):
                    if chunk:
                        f.write(chunk)
                        downloaded_size += len(chunk)
                        if total_size > 0:
                            prog = int((downloaded_size / total_size) * 100)
                            if prog % 5 == 0: # Reduce lock contention
                                self._update_progress(filename, "downloading", prog)

            self._update_progress(filename, "completed", 100)
            return True
        except Exception as e:
            self._update_progress(filename, "error", 0, str(e))
            if dest_path.exists():
                dest_path.unlink()
            return False

    def _download_pack_items(self, items: List[Tuple[str, str, Optional[str]]]):
        """Download a fixed manifest of files to specific ComfyUI model folders."""
        def _task():
            for url, model_subdir, rename_to in items:
                filename = rename_to or Path(url).name
                local_path = self.comfy_models_dir / model_subdir / filename
                if local_path.exists() and local_path.stat().st_size > 10000:
                    self._update_progress(filename, "completed", 100)
                    continue
                self.download_direct(url, local_path, filename)

        threading.Thread(target=_task, daemon=True).start()
        return {"success": True, "total_files": len(items), "mode": "manifest"}

    def _fetch_hf_tree(self, repo_id: str) -> List[dict]:
        """Fetch full HF file tree using pagination (cursor)."""
        all_items: List[dict] = []
        cursor = None
        while True:
            url = f"https://huggingface.co/api/models/{repo_id}/tree/main"
            if cursor:
                url = f"{url}?cursor={cursor}"
            resp = requests.get(url, timeout=20)
            resp.raise_for_status()
            batch = resp.json()
            if not isinstance(batch, list) or not batch:
                break
            all_items.extend(batch)
            # HuggingFace sends next cursor in Link header for some endpoints.
            link = resp.headers.get("Link", "")
            next_cursor = None
            if 'rel="next"' in link and "cursor=" in link:
                try:
                    next_cursor = link.split("cursor=", 1)[1].split(">;", 1)[0]
                except Exception:
                    next_cursor = None
            if not next_cursor:
                break
            cursor = next_cursor
        return all_items

    def sync_hf_repo(self, repo_id: str, subfolder: str, limit: Optional[int] = None):
        """
        Syncs HuggingFace files.

        - For known LTX packs, uses an explicit manifest with destination folders.
        - For unknown packs, falls back to old behavior (download safetensors into loras/<subfolder>).
        """
        try:
            # LTX fixed manifests (core issue fix).
            if subfolder in self._ltx_packs:
                return self._download_pack_items(self._ltx_packs[subfolder])

            dest_dir = self.comfy_models_dir / "loras" / subfolder
            dest_dir.mkdir(parents=True, exist_ok=True)

            # 1. Fetch file list from HF API
            items = self._fetch_hf_tree(repo_id)
            files = [item["path"] for item in items if item["path"].lower().endswith(".safetensors")]
            
            if limit:
                files = files[:limit]

            # 2. Download loop
            # For brevity, we process sequentially in a thread
            def _task():
                for f in files:
                    filename = Path(f).name
                    local_path = dest_dir / filename
                    if local_path.exists() and local_path.stat().st_size > 10000:
                        continue # Skip existing
                    
                    file_url = f"https://huggingface.co/{repo_id}/resolve/main/{f}"
                    self.download_direct(file_url, local_path, filename)
            
            threading.Thread(target=_task, daemon=True).start()
            return {"success": True, "total_files": len(files)}
        except Exception as e:
            return {"success": False, "error": str(e)}

# Instance for shared use
model_downloader = ModelDownloader(Path(__file__).parent.parent)
