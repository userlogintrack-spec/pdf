import io
import fitz  # PyMuPDF
from django.core.cache import cache
from PIL import Image


def get_pdf_info(file_path):
    """Extract PDF metadata, page count, and dimensions."""
    doc = fitz.open(file_path)
    page = doc[0] if doc.page_count > 0 else None
    info = {
        'page_count': doc.page_count,
        'width': page.rect.width if page else 0,
        'height': page.rect.height if page else 0,
        'is_encrypted': doc.is_encrypted,
        'has_forms': any(page.widgets() for page in doc if page.widgets()),
        'metadata': doc.metadata or {},
    }
    doc.close()
    return info


def render_page_image(file_path, page_num, dpi=150, width=None):
    """Render a PDF page to PNG bytes."""
    doc = fitz.open(file_path)
    if page_num < 0 or page_num >= doc.page_count:
        doc.close()
        return None

    page = doc[page_num]

    if width:
        zoom = width / page.rect.width
    else:
        zoom = dpi / 72.0

    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    img_bytes = pix.tobytes("png")

    doc.close()
    return img_bytes


def render_thumbnail(file_path, page_num, width=200):
    """Render a small thumbnail of a PDF page."""
    return render_page_image(file_path, page_num, width=width)


def extract_page_text(file_path, page_num):
    """Extract text with positions from a PDF page."""
    doc = fitz.open(file_path)
    if page_num < 0 or page_num >= doc.page_count:
        doc.close()
        return None

    page = doc[page_num]
    text_dict = page.get_text("dict")
    doc.close()
    return text_dict
