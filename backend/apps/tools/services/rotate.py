import io
import fitz


def rotate_pages(file_path, rotations):
    """
    Rotate specific pages in a PDF.
    rotations: dict like {0: 90, 2: 180} (page_index: degrees)
    """
    doc = fitz.open(file_path)

    for page_num, degrees in rotations.items():
        page = doc[int(page_num)]
        page.set_rotation(degrees)

    output = io.BytesIO()
    doc.save(output)
    doc.close()
    return output.getvalue()
