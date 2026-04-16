import os
import tempfile


def get_temp_dir():
    """Get or create temporary directory for PDF operations."""
    temp_dir = os.path.join(tempfile.gettempdir(), 'pdfcraft')
    os.makedirs(temp_dir, exist_ok=True)
    return temp_dir


def validate_pdf_file(file_path):
    """Check if a file is a valid PDF."""
    import fitz
    try:
        doc = fitz.open(file_path)
        is_valid = doc.page_count > 0
        doc.close()
        return is_valid
    except Exception:
        return False


def get_file_path(doc):
    """Get the actual filesystem path of a document's file."""
    name = doc.file.name
    if name and os.path.isabs(name) and os.path.exists(name):
        return name
    try:
        path = doc.file.path
        if os.path.exists(path):
            return path
    except Exception:
        pass
    return name
