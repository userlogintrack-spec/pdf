import io
import fitz


def crop_pages(file_path, crop_box, pages=None):
    """
    Crop pages in a PDF.
    crop_box: dict with x, y, width, height (in PDF points)
    pages: list of page indices, None for all
    """
    doc = fitz.open(file_path)
    target_pages = pages if pages is not None else range(doc.page_count)

    for page_num in target_pages:
        if page_num >= doc.page_count:
            continue
        page = doc[page_num]
        rect = fitz.Rect(
            crop_box['x'],
            crop_box['y'],
            crop_box['x'] + crop_box['width'],
            crop_box['y'] + crop_box['height'],
        )
        page.set_cropbox(rect)

    output = io.BytesIO()
    doc.save(output)
    doc.close()
    return output.getvalue()
