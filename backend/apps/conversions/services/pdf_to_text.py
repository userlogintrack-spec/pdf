import fitz


def convert_pdf_to_text(file_path):
    """
    Extract all text from a PDF file.
    Returns UTF-8 encoded text bytes.
    """
    doc = fitz.open(file_path)
    text_parts = []

    for page_num in range(doc.page_count):
        page = doc[page_num]
        text = page.get_text("text")

        if text.strip():
            text_parts.append(f"--- Page {page_num + 1} ---\n")
            text_parts.append(text)
            text_parts.append("\n")

    doc.close()
    return "\n".join(text_parts).encode("utf-8")
