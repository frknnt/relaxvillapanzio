from pathlib import Path
from math import ceil

from PIL import Image, ImageDraw
from pypdf import PdfReader


ROOT = Path(r"C:\Users\furka\Documents\ChatGPT\Relax Villa Panzio")
SOURCE = ROOT / "tmp" / "pdfs" / "rendered"
OUTPUT = ROOT / "tmp" / "pdfs" / "contact-sheets"
OUTPUT.mkdir(parents=True, exist_ok=True)

pdf_path = ROOT / "output" / "pdf" / "Relax-Villa-Site-Kullanim-Rehberi.pdf"
page_count = len(PdfReader(pdf_path).pages)
page_paths = sorted(SOURCE.glob("page-*.png"))[:page_count]
if len(page_paths) != page_count:
    raise SystemExit(f"Expected {page_count} rendered pages, found {len(page_paths)}")

thumb_width = 420
gap = 24
label_height = 34
background = (224, 224, 224)

for sheet_index in range(ceil(page_count / 4)):
    selected = page_paths[sheet_index * 4 : sheet_index * 4 + 4]
    thumbs = []
    for path in selected:
        with Image.open(path) as image:
            image = image.convert("RGB")
            height = round(image.height * thumb_width / image.width)
            thumbs.append(image.resize((thumb_width, height), Image.Resampling.LANCZOS))

    cell_height = max(image.height for image in thumbs) + label_height
    canvas = Image.new(
        "RGB",
        (gap * 3 + thumb_width * 2, gap * 3 + cell_height * 2),
        background,
    )
    draw = ImageDraw.Draw(canvas)

    for local_index, image in enumerate(thumbs):
        row, col = divmod(local_index, 2)
        x = gap + col * (thumb_width + gap)
        y = gap + row * (cell_height + gap)
        page_number = sheet_index * 4 + local_index + 1
        draw.text((x, y), f"Page {page_number}", fill=(20, 20, 20))
        canvas.paste(image, (x, y + label_height))

    canvas.save(OUTPUT / f"contact-{sheet_index + 1}.jpg", quality=88, optimize=True)

print(f"Created {ceil(page_count / 4)} contact sheets in {OUTPUT}")
