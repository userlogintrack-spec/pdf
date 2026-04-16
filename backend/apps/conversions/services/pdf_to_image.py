import io
import zipfile
import fitz


def convert_pdf_to_images(file_path, fmt='png', dpi=200, pages=None):
    """
    Convert PDF pages to images.
    Returns a zip file containing all page images if multiple pages,
    or single image bytes if one page.

    fmt: 'png' or 'jpeg'
    dpi: resolution (72-600)
    pages: list of 0-indexed page numbers, None for all
    """
    doc = fitz.open(file_path)
    target_pages = pages if pages is not None else range(doc.page_count)
    zoom = dpi / 72.0
    mat = fitz.Matrix(zoom, zoom)

    images = []
    for page_num in target_pages:
        if page_num >= doc.page_count:
            continue
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

    # Single page - return just the image
    if len(images) == 1:
        return {
            'data': images[0][1],
            'content_type': f'image/{fmt}',
            'filename': images[0][0],
            'is_zip': False,
        }

    # Multiple pages - return zip
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
        for name, data in images:
            zf.writestr(name, data)

    zip_buffer.seek(0)
    return {
        'data': zip_buffer.getvalue(),
        'content_type': 'application/zip',
        'filename': 'pdf_images.zip',
        'is_zip': True,
    }
