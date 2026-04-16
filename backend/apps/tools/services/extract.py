import io
import fitz


def extract_pages(file_path, page_numbers):
    """
    Extract specific pages from a PDF.
    page_numbers: list of 0-indexed page numbers, e.g., [0, 2, 4]
    """
    doc = fitz.open(file_path)
    new_doc = fitz.open()

    for page_num in sorted(page_numbers):
        if page_num < doc.page_count:
            new_doc.insert_pdf(doc, from_page=page_num, to_page=page_num)

    output = io.BytesIO()
    new_doc.save(output)
    new_doc.close()
    doc.close()
    return output.getvalue()
