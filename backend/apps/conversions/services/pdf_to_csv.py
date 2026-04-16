import io
import csv
import re
import fitz


def convert_pdf_to_csv(file_path):
    """
    Extract tabular data from PDF and convert to CSV format.
    """
    doc = fitz.open(file_path)
    output = io.StringIO()
    writer = csv.writer(output)

    for page_num in range(doc.page_count):
        page = doc[page_num]

        # Try to detect tabular structure
        tables = _extract_tables(page)

        if tables:
            if page_num > 0:
                writer.writerow([])  # Blank line between pages
            for table in tables:
                for row in table:
                    writer.writerow(row)
        else:
            # Fallback: line by line
            text = page.get_text("text")
            lines = text.strip().split("\n")
            if page_num > 0 and lines:
                writer.writerow([])
            for line in lines:
                cells = _split_line(line)
                writer.writerow([c.strip() for c in cells])

    doc.close()
    return output.getvalue().encode("utf-8")


def _extract_tables(page):
    """Extract tabular data from a PDF page using positional text analysis."""
    text_dict = page.get_text("dict")
    blocks = text_dict.get("blocks", [])

    spans = []
    for block in blocks:
        if block["type"] != 0:
            continue
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                bbox = span.get("bbox", [0, 0, 0, 0])
                spans.append({
                    "text": span.get("text", "").strip(),
                    "x0": bbox[0],
                    "y0": bbox[1],
                })

    if not spans:
        return []

    spans.sort(key=lambda s: (round(s["y0"] / 5) * 5, s["x0"]))

    rows = []
    current_row = [spans[0]]
    current_y = spans[0]["y0"]

    for span in spans[1:]:
        if abs(span["y0"] - current_y) < 5:
            current_row.append(span)
        else:
            rows.append(sorted(current_row, key=lambda s: s["x0"]))
            current_row = [span]
            current_y = span["y0"]

    if current_row:
        rows.append(sorted(current_row, key=lambda s: s["x0"]))

    if len(rows) < 2:
        return []

    col_counts = [len(row) for row in rows]
    most_common = max(set(col_counts), key=col_counts.count)

    if most_common < 2:
        return []

    table = [[span["text"] for span in row] for row in rows]
    return [table]


def _split_line(line):
    """Split a line by tabs, multiple spaces, or common delimiters."""
    if "\t" in line:
        return line.split("\t")
    parts = re.split(r"\s{3,}", line)
    if len(parts) > 1:
        return parts
    if "|" in line:
        return [p for p in line.split("|") if p.strip()]
    if "," in line:
        return line.split(",")
    return [line]
