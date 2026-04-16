import io
import fitz


def merge_pdfs(file_paths):
    """Merge multiple PDF files into one."""
    result = fitz.open()
    for path in file_paths:
        src = fitz.open(path)
        result.insert_pdf(src)
        src.close()

    output = io.BytesIO()
    result.save(output)
    result.close()
    return output.getvalue()
