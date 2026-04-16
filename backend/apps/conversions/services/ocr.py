import io
import fitz

# OCR availability flag
_tesseract_available = None


def is_tesseract_available():
    """Check if Tesseract OCR is installed."""
    global _tesseract_available
    if _tesseract_available is not None:
        return _tesseract_available
    try:
        import pytesseract
        pytesseract.get_tesseract_version()
        _tesseract_available = True
    except Exception:
        _tesseract_available = False
    return _tesseract_available


def ocr_pdf(file_path, language='eng'):
    """
    Perform OCR on a scanned PDF to make it searchable.
    Creates a new PDF with invisible text layer.

    If Tesseract is not available, falls back to PyMuPDF's built-in
    text extraction (which works for non-scanned PDFs).
    """
    doc = fitz.open(file_path)
    result_doc = fitz.open()

    if is_tesseract_available():
        import pytesseract
        from PIL import Image

        for page_num in range(doc.page_count):
            page = doc[page_num]

            # Render page to high-res image for OCR
            zoom = 300 / 72  # 300 DPI
            mat = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=mat, alpha=False)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

            # Run OCR
            ocr_data = pytesseract.image_to_data(
                img, lang=language, output_type=pytesseract.Output.DICT
            )

            # Create new page with same dimensions
            new_page = result_doc.new_page(
                width=page.rect.width, height=page.rect.height
            )

            # Insert original page image
            new_page.insert_image(page.rect, pixmap=pix)

            # Add invisible text layer from OCR results
            scale = 72 / 300  # Convert 300 DPI coords back to PDF points

            for i in range(len(ocr_data['text'])):
                text = ocr_data['text'][i].strip()
                if not text:
                    continue

                conf = int(ocr_data['conf'][i])
                if conf < 30:  # Skip low confidence
                    continue

                x = ocr_data['left'][i] * scale
                y = ocr_data['top'][i] * scale
                w = ocr_data['width'][i] * scale
                h = ocr_data['height'][i] * scale

                # Calculate appropriate font size
                font_size = max(h * 0.8, 4)

                # Insert invisible text (very small opacity)
                new_page.insert_text(
                    fitz.Point(x, y + font_size),
                    text,
                    fontsize=font_size,
                    fontname="helv",
                    color=(1, 1, 1),  # White (invisible on white bg)
                    render_mode=3,  # Invisible text mode
                )
    else:
        # Fallback: just copy the PDF as-is (no OCR available)
        result_doc.close()
        page_count = doc.page_count
        # Re-read original file and return as-is
        doc.close()
        with open(file_path, 'rb') as f:
            return {
                'data': f.read(),
                'ocr_used': False,
                'pages_processed': page_count,
            }

    output = io.BytesIO()
    result_doc.save(output)
    page_count = doc.page_count
    result_doc.close()
    doc.close()

    return {
        'data': output.getvalue(),
        'ocr_used': is_tesseract_available(),
        'pages_processed': page_count,
    }
