"""
Existing Text Editor - Extract text blocks from PDF and allow modification.
Uses PyMuPDF's redaction + re-insertion approach to modify existing text.
"""
import io
import fitz
from common.pdf_utils import get_file_path


def extract_text_blocks(document, page_num):
    """
    Extract all text blocks from a PDF page with their exact positions,
    font info, and content. Returns a list of editable text blocks.
    """
    file_path = get_file_path(document)
    doc = fitz.open(file_path)

    if page_num < 0 or page_num >= doc.page_count:
        doc.close()
        return []

    page = doc[page_num]
    page_width = page.rect.width
    page_height = page.rect.height

    # Get text with detailed formatting
    text_dict = page.get_text("dict")
    blocks = []
    block_id = 0

    for block in text_dict.get("blocks", []):
        if block["type"] != 0:  # Skip image blocks
            continue

        for line in block.get("lines", []):
            line_text = ""
            line_bbox = list(line.get("bbox", [0, 0, 0, 0]))
            font_size = 12
            font_name = ""
            font_color = "#000000"
            is_bold = False
            is_italic = False

            origin_y = None  # baseline y from span origin
            for span in line.get("spans", []):
                span_text = span.get("text", "")
                if not span_text.strip():
                    continue

                line_text += span_text
                font_size = span.get("size", 12)
                font_name = span.get("font", "")
                # Store the origin (baseline) point
                if span.get("origin") and origin_y is None:
                    origin_y = span["origin"][1]

                # Parse color
                color_int = span.get("color", 0)
                if color_int:
                    r = (color_int >> 16) & 0xFF
                    g = (color_int >> 8) & 0xFF
                    b = color_int & 0xFF
                    font_color = f"#{r:02x}{g:02x}{b:02x}"

                # Check font flags
                flags = span.get("flags", 0)
                if flags & (1 << 4):  # bold
                    is_bold = True
                if flags & (1 << 1):  # italic
                    is_italic = True
                if "bold" in font_name.lower():
                    is_bold = True
                if "italic" in font_name.lower() or "oblique" in font_name.lower():
                    is_italic = True

            if not line_text.strip():
                continue

            blocks.append({
                "id": f"block_{page_num}_{block_id}",
                "text": line_text,
                "x": line_bbox[0],
                "y": line_bbox[1],
                "x2": line_bbox[2],
                "y2": line_bbox[3],
                "width": line_bbox[2] - line_bbox[0],
                "height": line_bbox[3] - line_bbox[1],
                "origin_y": origin_y,  # exact baseline y
                "font_size": round(font_size, 1),
                "font_name": font_name,
                "font_color": font_color,
                "bold": is_bold,
                "italic": is_italic,
                "page_width": page_width,
                "page_height": page_height,
            })
            block_id += 1

    doc.close()
    return blocks


def modify_text_in_pdf(document, modifications):
    """
    Modify existing text in a PDF using search-based redaction.

    modifications: list of dicts with:
        - page: page number (0-indexed)
        - original_text: text to find and replace
        - new_text: replacement text
        - font_size, font_color, bold, italic: formatting

    Returns modified PDF bytes.
    """
    file_path = get_file_path(document)
    doc = fitz.open(file_path)

    # Group modifications by page
    mods_by_page = {}
    for mod in modifications:
        page_num = mod.get("page", 0)
        if page_num not in mods_by_page:
            mods_by_page[page_num] = []
        mods_by_page[page_num].append(mod)

    for page_num, page_mods in mods_by_page.items():
        if page_num >= doc.page_count:
            continue

        page = doc[page_num]

        # Collect all redaction rects and their new text info
        redactions = []

        for mod in page_mods:
            original = mod.get("original_text", "")
            new_text = mod.get("new_text", "")

            if original == new_text or not original:
                continue

            # Use the coordinates from the clicked text block to find
            # the EXACT occurrence (not just the first match)
            click_x = mod.get("x", 0)
            click_y = mod.get("y", 0)
            click_x2 = mod.get("x2", click_x + 200)
            click_y2 = mod.get("y2", click_y + 20)
            click_rect = fitz.Rect(click_x, click_y, click_x2, click_y2)

            # Search for ALL occurrences of the text
            found_rects = page.search_for(original)

            if found_rects and len(found_rects) > 1:
                # Multiple matches - find the one closest to the clicked position
                best_rect = None
                best_dist = float('inf')
                for fr in found_rects:
                    # Calculate distance between found rect center and click rect center
                    fr_cx = (fr.x0 + fr.x1) / 2
                    fr_cy = (fr.y0 + fr.y1) / 2
                    cl_cx = (click_rect.x0 + click_rect.x1) / 2
                    cl_cy = (click_rect.y0 + click_rect.y1) / 2
                    dist = ((fr_cx - cl_cx) ** 2 + (fr_cy - cl_cy) ** 2) ** 0.5
                    if dist < best_dist:
                        best_dist = dist
                        best_rect = fr
                rect = best_rect or found_rects[0]
            elif found_rects:
                # Single match - use it
                rect = found_rects[0]
            else:
                # No search match - use provided coordinates directly
                rect = click_rect

            # Minimal expansion - just 0.5pt to catch edge pixels
            rect = rect + (-0.5, -0.5, 0.5, 0.5)

            # Add redaction with white fill
            page.add_redact_annot(rect, fill=(1, 1, 1))

            redactions.append({
                'rect': rect,
                'new_text': new_text,
                'font_size': mod.get("font_size", 12),
                'font_color': mod.get("font_color", "#000000"),
                'bold': mod.get("bold", False),
                'italic': mod.get("italic", False),
                'origin_y': mod.get("origin_y"),
            })

        # Apply all redactions at once (removes original text)
        page.apply_redactions()

        # Re-insert new text at the original positions (skip empty = delete mode)
        for red in redactions:
            new_text = red['new_text']
            if not new_text:  # Delete mode - just redact, don't insert
                continue

            rect = red['rect']
            font_size = red['font_size']
            font_color = red['font_color']
            bold = red['bold']
            italic = red['italic']

            color = _hex_to_rgb(font_color)

            fontname = "helv"
            if bold and italic:
                fontname = "hebi"
            elif bold:
                fontname = "hebo"
            elif italic:
                fontname = "heit"

            # Use original baseline (origin_y) if available, else calculate from rect
            origin_y = red.get('origin_y')
            if origin_y:
                baseline_y = origin_y
            else:
                # Baseline is typically at bottom of bbox minus ~20% descent
                baseline_y = rect.y2 - font_size * 0.18

            page.insert_text(
                fitz.Point(rect.x0 + 0.5, baseline_y),
                new_text,
                fontsize=font_size,
                fontname=fontname,
                color=color,
            )

    output = io.BytesIO()
    doc.save(output)
    doc.close()
    return output.getvalue()


def _hex_to_rgb(hex_color):
    """Convert hex color string to RGB tuple (0-1 range)."""
    if not hex_color:
        return (0, 0, 0)
    hex_color = hex_color.lstrip('#')
    if len(hex_color) < 6:
        return (0, 0, 0)
    r = int(hex_color[0:2], 16) / 255.0
    g = int(hex_color[2:4], 16) / 255.0
    b = int(hex_color[4:6], 16) / 255.0
    return (r, g, b)
