import io
import fitz


def reorder_pages(file_path, new_order):
    """
    Reorder pages in a PDF.
    new_order: list of page indices in desired order, e.g., [2, 0, 1, 3]
    """
    doc = fitz.open(file_path)
    doc.select(new_order)

    output = io.BytesIO()
    doc.save(output)
    doc.close()
    return output.getvalue()
