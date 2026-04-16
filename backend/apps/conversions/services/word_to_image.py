import io
import zipfile
import fitz
from .word_to_pdf import convert_word_to_pdf


def convert_word_to_images(file_path, fmt='png', dpi=200):
    """
    Convert Word document to images.
    First converts to PDF, then renders each page as an image.
    """
    # Step 1: Word -> PDF bytes
    pdf_bytes = convert_word_to_pdf(file_path)

    # Step 2: PDF -> Images
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    zoom = dpi / 72.0
    mat = fitz.Matrix(zoom, zoom)

    images = []
    for page_num in range(doc.page_count):
        page = doc[page_num]
        pix = page.get_pixmap(matrix=mat, alpha=False)

        if fmt == 'jpeg':
            img_bytes = pix.tobytes("jpeg")
            ext = 'jpg'
        else:
            img_bytes = pix.tobytes("png")
            ext = 'png'

        images.append((f"page_{page_num + 1}.{ext}", img_bytes))

    doc.close()

    if len(images) == 1:
        return {
            'data': images[0][1],
            'content_type': f'image/{fmt}',
            'filename': images[0][0],
        }

    # Multiple pages -> zip
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
        for name, data in images:
            zf.writestr(name, data)

    zip_buffer.seek(0)
    return {
        'data': zip_buffer.getvalue(),
        'content_type': 'application/zip',
        'filename': 'word_images.zip',
    }
