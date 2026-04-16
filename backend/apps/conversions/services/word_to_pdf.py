import io
import fitz
from docx import Document


def convert_word_to_pdf(file_path):
    """
    Convert Word document to PDF using python-docx for reading
    and PyMuPDF/reportlab for PDF generation.
    This is a basic converter - complex formatting may not be preserved.
    """
    word_doc = Document(file_path)
    pdf_doc = fitz.open()

    page_width = 595  # A4 width in points
    page_height = 842  # A4 height in points
    margin = 72  # 1 inch margin
    usable_width = page_width - 2 * margin
    line_height = 14  # Default line height

    page = pdf_doc.new_page(width=page_width, height=page_height)
    y_pos = margin

    for para in word_doc.paragraphs:
        text = para.text.strip()
        if not text:
            y_pos += line_height * 0.5
            if y_pos > page_height - margin:
                page = pdf_doc.new_page(width=page_width, height=page_height)
                y_pos = margin
            continue

        # Determine font properties from paragraph style
        font_size = 12
        font_name = "helv"
        is_bold = False

        if para.style and para.style.name:
            style_name = para.style.name.lower()
            if 'heading 1' in style_name:
                font_size = 24
                is_bold = True
            elif 'heading 2' in style_name:
                font_size = 18
                is_bold = True
            elif 'heading 3' in style_name:
                font_size = 14
                is_bold = True
            elif 'title' in style_name:
                font_size = 28
                is_bold = True

        if is_bold:
            font_name = "helvB"

        # Check if runs have specific formatting
        if para.runs:
            run = para.runs[0]
            if run.bold:
                font_name = "helvB"
            if run.font.size:
                font_size = run.font.size.pt

        current_line_height = font_size * 1.4

        # Word wrap
        words = text.split()
        lines = []
        current_line = ""

        for word in words:
            test_line = f"{current_line} {word}".strip()
            # Approximate text width (0.5 * font_size per character)
            approx_width = len(test_line) * font_size * 0.5
            if approx_width > usable_width and current_line:
                lines.append(current_line)
                current_line = word
            else:
                current_line = test_line

        if current_line:
            lines.append(current_line)

        for line_text in lines:
            if y_pos + current_line_height > page_height - margin:
                page = pdf_doc.new_page(width=page_width, height=page_height)
                y_pos = margin

            page.insert_text(
                fitz.Point(margin, y_pos + font_size),
                line_text,
                fontsize=font_size,
                fontname=font_name,
            )
            y_pos += current_line_height

        y_pos += current_line_height * 0.3  # Paragraph spacing

    output = io.BytesIO()
    pdf_doc.save(output)
    pdf_doc.close()
    return output.getvalue()
