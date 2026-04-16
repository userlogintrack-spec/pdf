import io
import fitz
from PIL import Image


def convert_images_to_pdf(image_paths):
    """
    Convert one or more images to a PDF document.
    Each image becomes one page.
    """
    doc = fitz.open()

    for img_path in image_paths:
        # Open with Pillow to get dimensions
        pil_img = Image.open(img_path)
        width, height = pil_img.size

        # Convert to PDF page dimensions (fit to A4 or use image dimensions)
        # Use image dimensions in points (1 pixel = 0.75 points at 96 DPI)
        page_width = width * 72 / 96
        page_height = height * 72 / 96

        # Cap at reasonable size
        max_dim = 842  # A4 height in points
        if page_width > max_dim or page_height > max_dim:
            scale = min(max_dim / page_width, max_dim / page_height)
            page_width *= scale
            page_height *= scale

        page = doc.new_page(width=page_width, height=page_height)
        rect = fitz.Rect(0, 0, page_width, page_height)
        page.insert_image(rect, filename=img_path)

    output = io.BytesIO()
    doc.save(output)
    doc.close()
    return output.getvalue()


def convert_image_bytes_to_pdf(image_bytes_list):
    """
    Convert image bytes to PDF. Each entry is (filename, bytes).
    """
    doc = fitz.open()

    for filename, img_bytes in image_bytes_list:
        pil_img = Image.open(io.BytesIO(img_bytes))
        width, height = pil_img.size

        page_width = width * 72 / 96
        page_height = height * 72 / 96

        max_dim = 842
        if page_width > max_dim or page_height > max_dim:
            scale = min(max_dim / page_width, max_dim / page_height)
            page_width *= scale
            page_height *= scale

        page = doc.new_page(width=page_width, height=page_height)
        rect = fitz.Rect(0, 0, page_width, page_height)
        page.insert_image(rect, stream=img_bytes)

    output = io.BytesIO()
    doc.save(output)
    doc.close()
    return output.getvalue()
