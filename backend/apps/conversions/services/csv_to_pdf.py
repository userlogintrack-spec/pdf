import io
import csv
import fitz


def convert_csv_to_pdf(file_path):
    """
    Convert CSV file to a PDF with a formatted table.
    """
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.reader(f)
        rows = list(reader)

    if not rows:
        raise ValueError("CSV file is empty")

    return _render_table_to_pdf(rows)


def convert_csv_bytes_to_pdf(csv_bytes):
    """Convert CSV bytes to PDF."""
    text = csv_bytes.decode("utf-8", errors="ignore")
    reader = csv.reader(io.StringIO(text))
    rows = list(reader)

    if not rows:
        raise ValueError("CSV file is empty")

    return _render_table_to_pdf(rows)


def _render_table_to_pdf(rows):
    pdf_doc = fitz.open()

    page_width = 842  # A4 landscape
    page_height = 595
    margin = 40
    font_size = 9
    header_font_size = 10
    cell_padding = 4
    row_height = font_size * 2

    col_count = max(len(row) for row in rows)
    usable_width = page_width - 2 * margin
    col_width = min(usable_width / max(col_count, 1), 200)

    page = pdf_doc.new_page(width=page_width, height=page_height)
    y_pos = margin

    for r_idx, row in enumerate(rows):
        if y_pos + row_height > page_height - margin:
            page = pdf_doc.new_page(width=page_width, height=page_height)
            y_pos = margin

        x_pos = margin
        is_header = r_idx == 0

        for c_idx in range(col_count):
            value = row[c_idx].strip() if c_idx < len(row) else ""

            # Truncate
            max_chars = int(col_width / (font_size * 0.45))
            if len(value) > max_chars:
                value = value[:max_chars - 2] + ".."

            rect = fitz.Rect(x_pos, y_pos, x_pos + col_width, y_pos + row_height)

            # Draw cell background for header
            shape = page.new_shape()
            if is_header:
                shape.draw_rect(rect)
                shape.finish(color=(0.5, 0.5, 0.5), fill=(0.9, 0.9, 0.95), width=0.5)
            else:
                shape.draw_rect(rect)
                shape.finish(color=(0.7, 0.7, 0.7), width=0.5)
            shape.commit()

            page.insert_text(
                fitz.Point(x_pos + cell_padding, y_pos + row_height - cell_padding),
                value,
                fontsize=header_font_size if is_header else font_size,
                fontname="helvB" if is_header else "helv",
            )

            x_pos += col_width

        y_pos += row_height

    output = io.BytesIO()
    pdf_doc.save(output)
    pdf_doc.close()
    return output.getvalue()
