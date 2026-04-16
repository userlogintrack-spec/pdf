import fitz


def convert_pdf_to_html(file_path):
    """
    Convert PDF to HTML preserving basic text structure and formatting.
    """
    doc = fitz.open(file_path)
    html_parts = [
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">',
        '<title>Converted PDF</title>',
        '<style>',
        'body { font-family: Arial, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; }',
        '.page { margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #ccc; }',
        '.page-header { color: #666; font-size: 12px; margin-bottom: 10px; }',
        'img { max-width: 100%; height: auto; }',
        '</style>',
        '</head>',
        '<body>',
    ]

    for page_num in range(doc.page_count):
        page = doc[page_num]
        html_parts.append(f'<div class="page">')
        html_parts.append(f'<div class="page-header">Page {page_num + 1}</div>')

        text_dict = page.get_text("dict")

        for block in text_dict.get("blocks", []):
            if block["type"] == 0:  # Text block
                for line in block.get("lines", []):
                    spans_html = []
                    for span in line.get("spans", []):
                        text = span.get("text", "")
                        if not text.strip():
                            spans_html.append("&nbsp;")
                            continue

                        # Escape HTML
                        text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

                        font_size = span.get("size", 12)
                        flags = span.get("flags", 0)
                        color_int = span.get("color", 0)

                        styles = [f"font-size: {font_size:.1f}px"]

                        if color_int and color_int != 0:
                            r = (color_int >> 16) & 0xFF
                            g = (color_int >> 8) & 0xFF
                            b = color_int & 0xFF
                            styles.append(f"color: rgb({r},{g},{b})")

                        font_name = span.get("font", "")
                        if "bold" in font_name.lower() or (flags & 16):
                            styles.append("font-weight: bold")
                        if "italic" in font_name.lower() or (flags & 2):
                            styles.append("font-style: italic")

                        style_str = "; ".join(styles)
                        spans_html.append(f'<span style="{style_str}">{text}</span>')

                    if spans_html:
                        # Detect headings by font size
                        first_span = line.get("spans", [{}])[0]
                        size = first_span.get("size", 12)
                        line_text = "".join(spans_html)

                        if size >= 24:
                            html_parts.append(f"<h1>{line_text}</h1>")
                        elif size >= 18:
                            html_parts.append(f"<h2>{line_text}</h2>")
                        elif size >= 14:
                            html_parts.append(f"<h3>{line_text}</h3>")
                        else:
                            html_parts.append(f"<p>{line_text}</p>")

            elif block["type"] == 1:  # Image block
                try:
                    import base64
                    img_data = block.get("image")
                    if img_data:
                        ext = block.get("ext", "png")
                        b64 = base64.b64encode(img_data).decode("ascii")
                        html_parts.append(f'<img src="data:image/{ext};base64,{b64}" />')
                except Exception:
                    pass

        html_parts.append('</div>')

    html_parts.append('</body></html>')
    doc.close()

    return "\n".join(html_parts).encode("utf-8")
