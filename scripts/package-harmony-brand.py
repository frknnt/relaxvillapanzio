from pathlib import Path
import shutil

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
PACKAGE = ROOT / "output" / "harmony-balaton-villa"
FAVICON_DIR = PACKAGE / "favicon"
WEB_DIR = PACKAGE / "web-ready"
SVG_DIR = PACKAGE / "vectors" / "SVG"
PNG_TRANSPARENT_DIR = PACKAGE / "png" / "transparent"
PNG_APPLICATION_DIR = PACKAGE / "png" / "applications"


def ensure_dirs() -> None:
    FAVICON_DIR.mkdir(parents=True, exist_ok=True)
    WEB_DIR.mkdir(parents=True, exist_ok=True)


def resize_square(source: Image.Image, size: int, destination: Path) -> None:
    image = source.resize((size, size), Image.Resampling.LANCZOS)
    image.save(destination, format="PNG", optimize=True)


def main() -> None:
    ensure_dirs()

    favicon_source = FAVICON_DIR / "Harmony_Balaton_Villa_Favicon.png"
    with Image.open(favicon_source) as opened:
        favicon = opened.convert("RGBA")
        for size in (16, 32, 48, 64, 180, 192, 512):
            resize_square(favicon, size, FAVICON_DIR / f"favicon-{size}.png")

        favicon.save(
            FAVICON_DIR / "favicon.ico",
            format="ICO",
            sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
        )

    shutil.copy2(
        SVG_DIR / "Harmony_Balaton_Villa_Favicon.svg",
        FAVICON_DIR / "favicon.svg",
    )

    web_assets = {
        FAVICON_DIR / "favicon.svg": WEB_DIR / "favicon.svg",
        FAVICON_DIR / "favicon.ico": WEB_DIR / "favicon.ico",
        FAVICON_DIR / "favicon-180.png": WEB_DIR / "apple-touch-icon.png",
        FAVICON_DIR / "favicon-192.png": WEB_DIR / "icon-192.png",
        FAVICON_DIR / "favicon-512.png": WEB_DIR / "icon-512.png",
        SVG_DIR / "Harmony_Balaton_Villa_Primary_Horizontal.svg": WEB_DIR / "logo-primary.svg",
        PNG_TRANSPARENT_DIR / "Harmony_Balaton_Villa_Primary_Horizontal.png": WEB_DIR / "logo-primary.png",
        SVG_DIR / "Harmony_Balaton_Villa_Monogram.svg": WEB_DIR / "logo-mark.svg",
        PNG_TRANSPARENT_DIR / "Harmony_Balaton_Villa_Monogram.png": WEB_DIR / "logo-mark.png",
        SVG_DIR / "Harmony_Balaton_Villa_Social_Profile.svg": WEB_DIR / "social-profile.svg",
        PNG_APPLICATION_DIR / "Harmony_Balaton_Villa_Social_Profile.png": WEB_DIR / "social-profile.png",
    }
    for source, destination in web_assets.items():
        shutil.copy2(source, destination)

    print(f"Prepared favicon and web-ready exports in {PACKAGE}")


if __name__ == "__main__":
    main()
