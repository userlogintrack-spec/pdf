import io
import fitz


def split_pdf(file_path, ranges):
    """
    Split a PDF into multiple files based on page ranges.
    ranges: list of tuples like [(0, 2), (3, 5)] (0-indexed)
    Returns list of PDF bytes.
    """
    doc = fitz.open(file_path)
    results = []

    for start, end in ranges:
        new_doc = fitz.open()
        new_doc.insert_pdf(doc, from_page=start, to_page=end)
        output = io.BytesIO()
        new_doc.save(output)
        results.append(output.getvalue())
        new_doc.close()

    doc.close()
    return results
