import io
import re
import fitz
from html.parser import HTMLParser


class _TextExtractor(HTMLParser):
    """Simple HTML parser that extracts text with basic structure."""

    def __init__(self):
        super().__init__()
        self.elements = []
        self._current_tag = None
        self._skip_tags = {"script", "style", "head"}
        self._skip_depth = 0

    def handle_starttag(self, tag, attrs):
        if tag in self._skip_tags:
            self._skip_depth += 1
            return
        self._current_tag = tag

    def handle_endtag(self, tag):
        if self._skip_depth > 0:
            if tag in self._skip_tags:
                self._skip_depth -= 1
            return
        self._current_tag = None

    def handle_data(self, data):
        if self._skip_depth > 0:
            return
        text = data.strip()
        if text:
            self.elements.append((self._current_tag, text))


def convert_html_to_pdf(file_path):
    """
    Convert HTML file to PDF with basic formatting.
    """
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        html_content = f.read()

    return convert_html_string_to_pdf(html_content)


def convert_html_string_to_pdf(html_content):
    """
    Convert HTML string to PDF.
    """
    parser = _TextExtractor()
    parser.feed(html_content)

    pdf_doc = fitz.open()
    page_width = 595
    page_height = 842
    margin = 72

    page = pdf_doc.new_page(width=page_width, height=page_height)
    y_pos = margin
    usable_width = page_width - 2 * margin

    for tag, text in parser.elements:
        # Determine formatting based on tag
        if tag in ("h1",):
            font_size = 24
            font_name = "helvB"
        elif tag in ("h2",):
            font_size = 18
            font_name = "helvB"
        elif tag in ("h3",):
            font_size = 14
            font_name = "helvB"
        elif tag in ("h4", "h5", "h6"):
            font_size = 12
            font_name = "helvB"
        elif tag in ("strong", "b"):
            font_size = 12
            font_name = "helvB"
        elif tag in ("em", "i"):
            font_size = 12
            font_name = "helvI"
        else:
            font_size = 12
            font_name = "helv"

        line_height = font_size * 1.4

        # Word wrap
        words = text.split()
        lines = []
        current_line = ""

        for word in words:
            test_line = f"{current_line} {word}".strip()
            approx_width = len(test_line) * font_size * 0.5
            if approx_width > usable_width and current_line:
                lines.append(current_line)
                current_line = word
            else:
                current_line = test_line
        if current_line:
            lines.append(current_line)

        for line_text in lines:
            if y_pos + line_height > page_height - margin:
                page = pdf_doc.new_page(width=page_width, height=page_height)
                y_pos = margin

            page.insert_text(
                fitz.Point(margin, y_pos + font_size),
                line_text,
                fontsize=font_size,
                fontname=font_name,
            )
            y_pos += line_height

        y_pos += line_height * 0.3

    output = io.BytesIO()
    pdf_doc.save(output)
    pdf_doc.close()
    return output.getvalue()
