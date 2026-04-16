"""
PDF Renderer - The core engine that flattens JSON edit operations into the final PDF.
Takes an EditSession and applies all operations to produce the modified PDF.
"""
import io
import fitz  # PyMuPDF
from django.core.files.storage import default_storage


def render_final_pdf(session):
    """
    Take the original PDF and all edit operations from the session,
    apply them, and return the final PDF as bytes.
    """
    from common.pdf_utils import get_file_path
    document = session.document
    doc = fitz.open(get_file_path(document))
    operations = session.operations.all().order_by('page_number', 'z_index')

    for op in operations:
        if op.page_number >= doc.page_count:
            continue

        page = doc[op.page_number]

        if op.operation_type == 'text':
            _apply_text(page, op)
        elif op.operation_type == 'image':
            _apply_image(page, op)
        elif op.operation_type == 'shape':
            _apply_shape(page, op)
        elif op.operation_type == 'annotation':
            _apply_annotation(page, op)
        elif op.operation_type == 'signature':
            _apply_image(page, op)  # Signatures are placed as images
        elif op.operation_type == 'freehand':
            _apply_freehand(page, op)

    # Save to bytes
    output = io.BytesIO()
    doc.save(output)
    doc.close()
    return output.getvalue()


def _apply_text(page, op):
    """Insert text onto a PDF page."""
    props = op.properties
    text = props.get('content', '')
    font_size = props.get('font_size', 12)
    font_color_hex = props.get('font_color', '#000000')
    font_family = props.get('font_family', 'helv')
    bold = props.get('bold', False)
    italic = props.get('italic', False)

    # Convert hex color to RGB tuple (0-1 range)
    color = _hex_to_rgb(font_color_hex)

    # Map font names to PyMuPDF built-in font base names
    # PyMuPDF built-in fonts: helv, hebo, heit, hebi, tiro, tibo, tiit, tibi, cour, cobo, coit, cobi
    font_map = {
        'helvetica': 'helv',
        'arial': 'helv',
        'helv': 'helv',
        'times': 'tiro',
        'times new roman': 'tiro',
        'tiro': 'tiro',
        'courier': 'cour',
        'courier new': 'cour',
        'cour': 'cour',
    }
    base = font_map.get(font_family.lower(), 'helv')

    # Build font variant name
    bold_map = {
        'helv': {'normal': 'helv', 'bold': 'hebo', 'italic': 'heit', 'bolditalic': 'hebi'},
        'tiro': {'normal': 'tiro', 'bold': 'tibo', 'italic': 'tiit', 'bolditalic': 'tibi'},
        'cour': {'normal': 'cour', 'bold': 'cobo', 'italic': 'coit', 'bolditalic': 'cobi'},
    }
    variant = 'normal'
    if bold and italic:
        variant = 'bolditalic'
    elif bold:
        variant = 'bold'
    elif italic:
        variant = 'italic'

    fontname = bold_map.get(base, bold_map['helv'])[variant]

    # Insert text at position
    point = fitz.Point(op.x, op.y + font_size)  # y offset for baseline
    page.insert_text(
        point,
        text,
        fontsize=font_size,
        fontname=fontname,
        color=color,
        rotate=int(op.rotation),
    )


def _apply_image(page, op):
    """Insert an image onto a PDF page."""
    props = op.properties
    image_id = props.get('image_id')
    if not image_id:
        return

    from apps.documents.models import DocumentAsset
    try:
        asset = DocumentAsset.objects.get(id=image_id)
        rect = fitz.Rect(op.x, op.y, op.x + op.width, op.y + op.height)
        page.insert_image(rect, filename=asset.file.path)
    except DocumentAsset.DoesNotExist:
        pass


def _apply_shape(page, op):
    """Draw a shape on a PDF page."""
    props = op.properties
    shape_type = props.get('shape_type', 'rectangle')
    fill_color = _hex_to_rgb(props.get('fill_color')) if props.get('fill_color') else None
    stroke_color = _hex_to_rgb(props.get('stroke_color', '#000000'))
    stroke_width = props.get('stroke_width', 1)

    shape = page.new_shape()
    rect = fitz.Rect(op.x, op.y, op.x + op.width, op.y + op.height)

    if shape_type == 'rectangle':
        shape.draw_rect(rect)
    elif shape_type == 'circle':
        center = fitz.Point(op.x + op.width / 2, op.y + op.height / 2)
        radius = min(op.width, op.height) / 2
        shape.draw_circle(center, radius)
    elif shape_type == 'line':
        p1 = fitz.Point(op.x, op.y)
        p2 = fitz.Point(op.x + op.width, op.y + op.height)
        shape.draw_line(p1, p2)

    shape.finish(
        color=stroke_color,
        fill=fill_color,
        width=stroke_width,
    )
    shape.commit()


def _apply_annotation(page, op):
    """Apply annotation (highlight, underline, etc.)."""
    props = op.properties
    annot_type = props.get('annotation_type', 'highlight')
    rect = fitz.Rect(op.x, op.y, op.x + op.width, op.y + op.height)

    if annot_type == 'highlight':
        annot = page.add_highlight_annot(rect)
        color = props.get('color', '#FFFF00')
        annot.set_colors(stroke=_hex_to_rgb(color))
        annot.update()
    elif annot_type == 'underline':
        annot = page.add_underline_annot(rect)
        annot.update()
    elif annot_type == 'strikethrough':
        annot = page.add_strikeout_annot(rect)
        annot.update()
    elif annot_type == 'comment':
        point = fitz.Point(op.x, op.y)
        text = props.get('content', '')
        annot = page.add_text_annot(point, text)
        annot.update()


def _apply_freehand(page, op):
    """Draw freehand paths on a PDF page."""
    props = op.properties
    points = props.get('points', [])
    stroke_color = _hex_to_rgb(props.get('stroke_color', '#000000'))
    stroke_width = props.get('stroke_width', 2)

    if len(points) < 2:
        return

    shape = page.new_shape()
    shape.draw_line(fitz.Point(points[0]['x'], points[0]['y']),
                    fitz.Point(points[1]['x'], points[1]['y']))

    for i in range(2, len(points)):
        shape.draw_line(fitz.Point(points[i - 1]['x'], points[i - 1]['y']),
                        fitz.Point(points[i]['x'], points[i]['y']))

    shape.finish(color=stroke_color, width=stroke_width)
    shape.commit()


def _hex_to_rgb(hex_color):
    """Convert hex color string to RGB tuple (0-1 range)."""
    if not hex_color:
        return (0, 0, 0)
    hex_color = hex_color.lstrip('#')
    r = int(hex_color[0:2], 16) / 255.0
    g = int(hex_color[2:4], 16) / 255.0
    b = int(hex_color[4:6], 16) / 255.0
    return (r, g, b)
