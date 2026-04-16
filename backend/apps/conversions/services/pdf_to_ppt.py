import io
import fitz
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN


def convert_pdf_to_ppt(file_path, mode='hybrid', dpi=250, pages=None):
    """
    Convert PDF to PowerPoint presentation.

    Modes:
      - 'image'    : Each page rendered as a high-res image (pixel-perfect, not editable)
      - 'editable' : Extracts text, images, shapes as native PPT elements (fully editable)
      - 'hybrid'   : Image background for pixel-perfect layout + editable text overlay on top

    Args:
        file_path: Path to the PDF file
        mode: Conversion mode ('image', 'editable', 'hybrid')
        dpi: Resolution for image rendering (72-600)
        pages: Optional list of 0-based page numbers to convert, None = all pages
    """
    pdf_doc = fitz.open(file_path)
    prs = Presentation()

    dpi = max(72, min(600, dpi))
    zoom = dpi / 72.0
    mat = fitz.Matrix(zoom, zoom)

    page_indices = _resolve_pages(pdf_doc.page_count, pages)

    for page_num in page_indices:
        page = pdf_doc[page_num]
        pw = page.rect.width
        ph = page.rect.height

        slide_w, slide_h = _calc_slide_dimensions(pw, ph)
        prs.slide_width = slide_w
        prs.slide_height = slide_h

        # Use blank layout (index 6)
        slide = prs.slides.add_slide(prs.slide_layouts[6])

        if mode == 'image':
            _build_image_slide(slide, page, mat, slide_w, slide_h)
        elif mode == 'editable':
            _build_editable_slide(slide, page, pdf_doc, slide_w, slide_h, pw, ph)
        else:
            # hybrid: image background + editable text on top
            _build_hybrid_slide(slide, page, pdf_doc, mat, slide_w, slide_h, pw, ph)

    output = io.BytesIO()
    prs.save(output)
    output.seek(0)
    pdf_doc.close()
    return output.getvalue()


# ─── Page resolution ────────────────────────────────────────────────

def _resolve_pages(total, pages):
    """Return sorted list of valid 0-based page indices."""
    if pages is None:
        return list(range(total))
    valid = [p for p in pages if 0 <= p < total]
    return sorted(set(valid)) if valid else list(range(total))


# ─── Slide dimensions ──────────────────────────────────────────────

def _calc_slide_dimensions(pw, ph):
    """Calculate slide dimensions preserving PDF aspect ratio."""
    ratio = pw / ph
    if ratio > 1.2:
        # Landscape - widescreen
        slide_w = Inches(13.333)
        slide_h = int(slide_w / ratio)
    elif ratio < 0.8:
        # Portrait
        slide_h = Inches(10)
        slide_w = int(slide_h * ratio)
    else:
        # Near-square or standard
        slide_h = Inches(7.5)
        slide_w = int(slide_h * ratio)
    return slide_w, slide_h


# ─── Mode: IMAGE ───────────────────────────────────────────────────

def _build_image_slide(slide, page, mat, slide_w, slide_h):
    """Render the entire page as a single high-res image."""
    pix = page.get_pixmap(matrix=mat, alpha=False)
    img_stream = io.BytesIO(pix.tobytes("png"))
    slide.shapes.add_picture(img_stream, 0, 0, slide_w, slide_h)


# ─── Mode: HYBRID ─────────────────────────────────────────────────

def _build_hybrid_slide(slide, page, pdf_doc, mat, slide_w, slide_h, pw, ph):
    """
    Hybrid mode: pixel-perfect image background + editable text overlay.
    Best of both worlds - looks exactly like the PDF but text is selectable/editable.
    """
    # 1. Full-page image as background (pixel-perfect rendering)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    img_stream = io.BytesIO(pix.tobytes("png"))
    slide.shapes.add_picture(img_stream, 0, 0, slide_w, slide_h)

    # 2. Editable text overlay with transparent background
    scale_x = slide_w / pw
    scale_y = slide_h / ph
    _add_text(slide, page, scale_x, scale_y, transparent=True)


# ─── Mode: EDITABLE ───────────────────────────────────────────────

def _build_editable_slide(slide, page, pdf_doc, slide_w, slide_h, pw, ph):
    """Fully editable slide with native PPT elements."""
    scale_x = slide_w / pw
    scale_y = slide_h / ph

    # 1. White background rectangle
    bg = slide.shapes.add_shape(1, 0, 0, slide_w, slide_h)
    bg.fill.solid()
    bg.fill.fore_color.rgb = RGBColor(255, 255, 255)
    bg.line.fill.background()

    # 2. Colored rectangles and shapes (backgrounds, banners, dividers)
    _add_rects(slide, page, scale_x, scale_y)

    # 3. Lines and paths (borders, separators, decorative lines)
    _add_lines(slide, page, scale_x, scale_y)

    # 4. Images at correct positions
    _add_images(slide, page, pdf_doc, scale_x, scale_y)

    # 5. Editable text (on top of everything)
    _add_text(slide, page, scale_x, scale_y, transparent=True)


# ─── Shape extraction ──────────────────────────────────────────────

def _add_rects(slide, page, scale_x, scale_y):
    """Add colored rectangles and filled shapes from PDF drawings."""
    for path in page.get_drawings():
        fill = path.get("fill")
        rect = path.get("rect")
        if rect is None:
            continue

        # Filled shapes
        if fill is not None:
            # Skip near-white fills (backgrounds)
            if all(c > 0.95 for c in fill[:3]):
                continue
            if rect.width < 3 or rect.height < 3:
                continue

            left = int(rect.x0 * scale_x)
            top = int(rect.y0 * scale_y)
            width = int(rect.width * scale_x)
            height = int(rect.height * scale_y)

            try:
                shape = slide.shapes.add_shape(1, left, top, width, height)
                shape.fill.solid()
                shape.fill.fore_color.rgb = RGBColor(
                    min(255, int(fill[0] * 255)),
                    min(255, int(fill[1] * 255)),
                    min(255, int(fill[2] * 255)),
                )
                shape.line.fill.background()
                shape.rotation = 0.0
            except Exception:
                pass
            continue

        # Stroked-only shapes (borders, frames)
        stroke = path.get("color")
        if stroke is None:
            continue
        if rect.width < 5 or rect.height < 5:
            continue

        left = int(rect.x0 * scale_x)
        top = int(rect.y0 * scale_y)
        width = int(rect.width * scale_x)
        height = int(rect.height * scale_y)

        try:
            shape = slide.shapes.add_shape(1, left, top, width, height)
            shape.fill.background()
            shape.line.color.rgb = RGBColor(
                min(255, int(stroke[0] * 255)),
                min(255, int(stroke[1] * 255)),
                min(255, int(stroke[2] * 255)),
            )
            lw = path.get("width", 1)
            shape.line.width = Pt(max(0.25, lw))
        except Exception:
            pass


def _add_lines(slide, page, scale_x, scale_y):
    """Add lines and connectors from PDF drawings."""
    for path in page.get_drawings():
        items = path.get("items", [])
        color = path.get("color")
        if not items or color is None:
            continue
        # Skip if it has a fill (handled by _add_rects)
        if path.get("fill") is not None:
            continue

        # Only process simple line segments (2-point paths)
        lines = [item for item in items if item[0] == "l"]
        if len(lines) != 1 or len(items) > 2:
            continue

        line_item = lines[0]
        p1 = line_item[1]  # start point
        p2 = line_item[2]  # end point

        x1 = int(p1.x * scale_x)
        y1 = int(p1.y * scale_y)
        x2 = int(p2.x * scale_x)
        y2 = int(p2.y * scale_y)

        # Skip tiny lines
        length_sq = (x2 - x1) ** 2 + (y2 - y1) ** 2
        if length_sq < Emu(50000) ** 2:
            continue

        try:
            connector = slide.shapes.add_connector(
                1, x1, y1, x2 - x1, y2 - y1  # MSO_CONNECTOR_TYPE.STRAIGHT
            )
            connector.line.color.rgb = RGBColor(
                min(255, int(color[0] * 255)),
                min(255, int(color[1] * 255)),
                min(255, int(color[2] * 255)),
            )
            lw = path.get("width", 1)
            connector.line.width = Pt(max(0.25, lw))
        except Exception:
            pass


# ─── Image extraction ──────────────────────────────────────────────

def _add_images(slide, page, pdf_doc, scale_x, scale_y):
    """Extract and place images at their exact PDF positions."""
    seen = set()
    for img_info in page.get_images(full=True):
        xref = img_info[0]
        if xref in seen:
            continue
        seen.add(xref)

        try:
            base = pdf_doc.extract_image(xref)
            if not base or "image" not in base:
                continue
            img_data = base["image"]
            img_ext = base.get("ext", "png")

            # Some PDFs have CMYK or unusual color spaces - convert via raw pixmap
            if img_ext in ("jpx", "jb2", "ccitt"):
                pix = fitz.Pixmap(pdf_doc, xref)
                if pix.n > 4:
                    pix = fitz.Pixmap(fitz.csRGB, pix)
                img_data = pix.tobytes("png")

            for rect in page.get_image_rects(xref):
                if rect.width < 2 or rect.height < 2:
                    continue

                left = int(rect.x0 * scale_x)
                top = int(rect.y0 * scale_y)
                width = int(rect.width * scale_x)
                height = int(rect.height * scale_y)

                if width < Emu(10000) or height < Emu(10000):
                    continue

                slide.shapes.add_picture(
                    io.BytesIO(img_data), left, top, width, height
                )
        except Exception:
            pass


# ─── Text extraction ───────────────────────────────────────────────

# Common font name mappings for better PowerPoint compatibility
_FONT_MAP = {
    "ArialMT": "Arial",
    "TimesNewRomanPSMT": "Times New Roman",
    "TimesNewRomanPS": "Times New Roman",
    "CourierNewPSMT": "Courier New",
    "Helvetica": "Arial",
    "HelveticaNeue": "Arial",
    "Verdana": "Verdana",
    "Georgia": "Georgia",
    "Calibri": "Calibri",
    "Cambria": "Cambria",
    "Tahoma": "Tahoma",
    "TrebuchetMS": "Trebuchet MS",
    "Symbol": "Symbol",
    "ZapfDingbats": "Wingdings",
}


def _clean_font_name(raw_font):
    """Clean and map PDF font name to a PowerPoint-compatible font."""
    if not raw_font:
        return "Arial"

    # Remove subset prefix (e.g. ABCDEF+FontName)
    if "+" in raw_font:
        raw_font = raw_font.split("+", 1)[1]

    # Check direct mapping first
    base_key = raw_font.split("-")[0].split(",")[0].strip()
    if base_key in _FONT_MAP:
        return _FONT_MAP[base_key]

    # Strip style suffixes
    clean = base_key
    for suffix in ("Bold", "Italic", "Oblique", "Regular", "Medium",
                    "Light", "Semibold", "SemiBold", "ExtraBold", "Black",
                    "Thin", "Book", "Roman", "Condensed", "Narrow", "MT", "PS"):
        clean = clean.replace(suffix, "")
    clean = clean.strip()

    if not clean:
        return "Arial"

    # Add spaces before capitals (e.g. TimesNewRoman -> Times New Roman)
    spaced = ""
    for i, ch in enumerate(clean):
        if i > 0 and ch.isupper() and clean[i - 1].islower():
            spaced += " "
        spaced += ch

    return spaced.strip() or "Arial"


def _detect_alignment(spans, block_bbox):
    """Detect text alignment based on span positions within the block."""
    if not spans:
        return PP_ALIGN.LEFT

    block_width = block_bbox[2] - block_bbox[0]
    if block_width < 10:
        return PP_ALIGN.LEFT

    # Check first span position relative to block
    first_span = spans[0]
    span_bbox = first_span.get("bbox", block_bbox)
    left_margin = span_bbox[0] - block_bbox[0]
    right_margin = block_bbox[2] - span_bbox[2]

    # Centered text: roughly equal margins on both sides
    if block_width > 50 and abs(left_margin - right_margin) < block_width * 0.15:
        if left_margin > block_width * 0.1:
            return PP_ALIGN.CENTER

    # Right-aligned: large left margin, small right margin
    if left_margin > block_width * 0.4 and right_margin < block_width * 0.1:
        return PP_ALIGN.RIGHT

    return PP_ALIGN.LEFT


def _add_text(slide, page, scale_x, scale_y, transparent=True):
    """
    Add editable text boxes to the slide.

    Args:
        transparent: If True, text boxes have no fill (for hybrid mode overlay).
                     If False, text boxes are opaque (for standalone editable mode).
    """
    text_dict = page.get_text("dict", flags=fitz.TEXT_PRESERVE_WHITESPACE)

    for block in text_dict.get("blocks", []):
        if block.get("type") != 0:
            continue

        lines = block.get("lines", [])
        if not lines:
            continue

        # Collect all spans to check if block has real text
        all_spans = []
        for line in lines:
            for span in line.get("spans", []):
                if span.get("text", "").strip():
                    all_spans.append(span)
        if not all_spans:
            continue

        bbox = block.get("bbox", [0, 0, 0, 0])
        left = int(bbox[0] * scale_x)
        top = int(bbox[1] * scale_y)
        width = int((bbox[2] - bbox[0]) * scale_x)
        height = int((bbox[3] - bbox[1]) * scale_y)

        # Ensure minimum dimensions
        width = max(width, Emu(200000))
        height = max(height, Emu(80000))

        # Add slight padding to prevent text clipping
        width = int(width * 1.02)

        txBox = slide.shapes.add_textbox(left, top, width, height)
        tf = txBox.text_frame
        tf.word_wrap = True
        tf.margin_left = Emu(0)
        tf.margin_right = Emu(0)
        tf.margin_top = Emu(0)
        tf.margin_bottom = Emu(0)

        # Transparent fill so the background (image or shapes) shows through
        txBox.fill.background()
        txBox.line.fill.background()

        # Detect alignment from first line spans
        first_line_spans = lines[0].get("spans", []) if lines else []
        alignment = _detect_alignment(first_line_spans, bbox)

        first_para = True
        for line in lines:
            if first_para:
                p = tf.paragraphs[0]
                first_para = False
            else:
                p = tf.add_paragraph()

            p.space_before = Pt(0)
            p.space_after = Pt(0)
            p.alignment = alignment

            # Calculate line spacing from font size
            line_spans = line.get("spans", [])
            if line_spans:
                max_size = max(s.get("size", 12) for s in line_spans)
                if max_size > 20:
                    p.line_spacing = 1.0
                elif max_size > 14:
                    p.line_spacing = 1.05
                else:
                    p.line_spacing = 1.1

            for span in line_spans:
                text = span.get("text", "")
                if not text:
                    continue

                run = p.add_run()
                run.text = text

                # Font size
                size = span.get("size", 12)
                run.font.size = Pt(max(1, size))

                # Font name (cleaned and mapped)
                font_name = span.get("font", "")
                run.font.name = _clean_font_name(font_name)

                # Bold / Italic detection
                flags = span.get("flags", 0)
                font_lower = font_name.lower()
                if "bold" in font_lower or "black" in font_lower or (flags & 16):
                    run.font.bold = True
                if ("italic" in font_lower or "oblique" in font_lower or (flags & 2)):
                    run.font.italic = True

                # Underline
                if flags & 4:
                    run.font.underline = True

                # Text color
                color_int = span.get("color", 0)
                if color_int and color_int != 0:
                    r_val = (color_int >> 16) & 0xFF
                    g_val = (color_int >> 8) & 0xFF
                    b_val = color_int & 0xFF
                    run.font.color.rgb = RGBColor(r_val, g_val, b_val)
                else:
                    run.font.color.rgb = RGBColor(0, 0, 0)

                # In hybrid mode, make text color transparent so it doesn't
                # visually duplicate with the background image, but remains
                # selectable/editable. User can toggle visibility in PowerPoint.
                if transparent:
                    # Keep full color - users expect to see the text.
                    # The image background + text overlay gives best results.
                    pass
