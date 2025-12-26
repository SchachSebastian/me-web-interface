from pathlib import Path
from PIL import Image
from concurrent.futures import ThreadPoolExecutor, as_completed
import os

TARGET_COLOR = (0x8B, 0x8B, 0x8B)


def process_png(png_path: Path):
    try:
        with Image.open(png_path).convert("RGBA") as img:
            pixels = img.load()
            w, h = img.size

            for y in range(h):
                for x in range(w):
                    r, g, b, a = pixels[x, y]
                    if (r, g, b) == TARGET_COLOR:
                        pixels[x, y] = (r, g, b, 0)

            webp_path = png_path.with_suffix(".webp")
            img.save(webp_path, "WEBP", lossless=True)

        png_path.unlink()
        return f"✔ {png_path} -> {webp_path} (PNG deleted)"

    except Exception as e:
        return f"✖ Failed processing {png_path}: {e}"


def convert_png_to_webp_and_delete(root_dir: Path, workers: int | None = None):
    png_files = list(root_dir.rglob("*.png"))

    if not png_files:
        print("No PNGs found.")
        return

    max_workers = workers or min(32, (os.cpu_count() or 4) * 2)
    print(f"Using {max_workers} workers")

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [executor.submit(process_png, p) for p in png_files]

        for future in as_completed(futures):
            print(future.result())


if __name__ == "__main__":
    convert_png_to_webp_and_delete(
        Path("../server/frontend/public/assets"), workers=None
    )
