import io
import fitz


def convert_text_to_pdf(file_path):
    """
    Convert a plain text file to PDF.
    """
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        text_content = f.read()

    return convert_text_string_to_pdf(text_content)


def convert_text_string_to_pdf(text_content):
    """
    Convert text string to PDF.
    """
    pdf_doc = fitz.open()
    page_width = 595
    page_height = 842
    margin = 72
    font_size = 11
    font_name = "cour"  # Monospace for plain text
    line_height = font_size * 1.4
    usable_width = page_width - 2 * margin

    page = pdf_doc.new_page(width=page_width, height=page_height)
    y_pos = margin

    lines = text_content.split("\n")

    for line in lines:
        if not line.strip():
            y_pos += line_height * 0.5
            if y_pos > page_height - margin:
                page = pdf_doc.new_page(width=page_width, height=page_height)
                y_pos = margin
            continue

        # Word wrap
        words = line.split()
        wrapped_lines = []
        current_line = ""

        for word in words:
            test_line = f"{current_line} {word}".strip()
            approx_width = len(test_line) * font_size * 0.52
            if approx_width > usable_width and current_line:
                wrapped_lines.append(current_line)
                current_line = word
            else:
                current_line = test_line
        if current_line:
            wrapped_lines.append(current_line)

        for wl in wrapped_lines:
            if y_pos + line_height > page_height - margin:
                page = pdf_doc.new_page(width=page_width, height=page_height)
                y_pos = margin

            page.insert_text(
                fitz.Point(margin, y_pos + font_size),
                wl,
                fontsize=font_size,
                fontname=font_name,
            )
            y_pos += line_height

    output = io.BytesIO()
    pdf_doc.save(output)
    pdf_doc.close()
    return output.getvalue()
