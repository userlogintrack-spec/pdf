import io
import fitz


def add_text_watermark(file_path, text='DRAFT', font_size=60, color='#CCCCCC',
                       opacity=0.3, rotation=45, position='center', pages=None):
    """
    Add a text watermark to PDF pages.
    position: 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'diagonal'
    pages: list of page numbers (0-indexed), None for all pages
    """
    doc = fitz.open(file_path)

    # Parse color
    hex_color = color.lstrip('#')
    r = int(hex_color[0:2], 16) / 255.0
    g = int(hex_color[2:4], 16) / 255.0
    b = int(hex_color[4:6], 16) / 255.0

    target_pages = pages if pages is not None else range(doc.page_count)

    for page_num in target_pages:
        if page_num >= doc.page_count:
            continue

        page = doc[page_num]
        rect = page.rect

        # Calculate position
        if position == 'center' or position == 'diagonal':
            x = rect.width / 2
            y = rect.height / 2
        elif position == 'top-left':
            x = rect.width * 0.2
            y = rect.height * 0.15
        elif position == 'top-right':
            x = rect.width * 0.8
            y = rect.height * 0.15
        elif position == 'bottom-left':
            x = rect.width * 0.2
            y = rect.height * 0.85
        elif position == 'bottom-right':
            x = rect.width * 0.8
            y = rect.height * 0.85
        else:
            x = rect.width / 2
            y = rect.height / 2

        # Create text writer with rotation
        tw = fitz.TextWriter(page.rect)
        font = fitz.Font("helv")
        tw.append(fitz.Point(x - len(text) * font_size * 0.25, y), text,
                  font=font, fontsize=font_size)

        # Apply with opacity
        tw.write_text(page, color=(r, g, b), opacity=opacity,
                      morph=(fitz.Point(x, y), fitz.Matrix(rotation)))

    output = io.BytesIO()
    doc.save(output)
    doc.close()
    return output.getvalue()


def add_image_watermark(file_path, image_path, opacity=0.3, scale=0.5, pages=None):
    """Add an image watermark to PDF pages."""
    doc = fitz.open(file_path)

    target_pages = pages if pages is not None else range(doc.page_count)

    for page_num in target_pages:
        if page_num >= doc.page_count:
            continue

        page = doc[page_num]
        rect = page.rect

        # Center the image
        img_rect = fitz.Rect(
            rect.width * (1 - scale) / 2,
            rect.height * (1 - scale) / 2,
            rect.width * (1 + scale) / 2,
            rect.height * (1 + scale) / 2,
        )

        page.insert_image(img_rect, filename=image_path, overlay=True,
                          alpha=int(opacity * 255))

    output = io.BytesIO()
    doc.save(output)
    doc.close()
    return output.getvalue()
