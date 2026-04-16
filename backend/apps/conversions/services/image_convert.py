import io
from PIL import Image


def convert_image_format(image_bytes, target_format='png'):
    """
    Convert image to a different format.
    Supports: png, jpeg, webp, bmp, gif, tiff
    """
    img = Image.open(io.BytesIO(image_bytes))

    # Handle transparency for formats that don't support it
    if target_format.lower() in ('jpeg', 'jpg', 'bmp') and img.mode in ('RGBA', 'LA', 'P'):
        background = Image.new('RGB', img.size, (255, 255, 255))
        if img.mode == 'P':
            img = img.convert('RGBA')
        background.paste(img, mask=img.split()[-1] if 'A' in img.mode else None)
        img = background

    if target_format.lower() in ('jpeg', 'jpg') and img.mode != 'RGB':
        img = img.convert('RGB')

    output = io.BytesIO()
    save_format = target_format.upper()
    if save_format == 'JPG':
        save_format = 'JPEG'

    save_kwargs = {}
    if save_format == 'JPEG':
        save_kwargs['quality'] = 90
    elif save_format == 'WEBP':
        save_kwargs['quality'] = 90

    img.save(output, format=save_format, **save_kwargs)
    output.seek(0)

    mime_types = {
        'PNG': 'image/png',
        'JPEG': 'image/jpeg',
        'WEBP': 'image/webp',
        'BMP': 'image/bmp',
        'GIF': 'image/gif',
        'TIFF': 'image/tiff',
    }

    return {
        'data': output.getvalue(),
        'content_type': mime_types.get(save_format, 'application/octet-stream'),
        'extension': target_format.lower() if target_format.lower() != 'jpeg' else 'jpg',
    }


def compress_image(image_bytes, quality=70, max_width=None, max_height=None):
    """
    Compress and optionally resize an image.
    """
    img = Image.open(io.BytesIO(image_bytes))
    original_format = img.format or 'PNG'

    # Resize if dimensions specified
    if max_width or max_height:
        w, h = img.size
        if max_width and w > max_width:
            ratio = max_width / w
            w = max_width
            h = int(h * ratio)
        if max_height and h > max_height:
            ratio = max_height / h
            h = max_height
            w = int(w * ratio)
        img = img.resize((w, h), Image.LANCZOS)

    # Convert for saving
    if original_format in ('JPEG', 'JPG'):
        if img.mode != 'RGB':
            img = img.convert('RGB')
        output = io.BytesIO()
        img.save(output, format='JPEG', quality=quality, optimize=True)
        content_type = 'image/jpeg'
        ext = 'jpg'
    elif original_format == 'WEBP':
        output = io.BytesIO()
        img.save(output, format='WEBP', quality=quality)
        content_type = 'image/webp'
        ext = 'webp'
    else:
        # PNG: use optimize
        output = io.BytesIO()
        if img.mode == 'RGBA':
            img.save(output, format='PNG', optimize=True)
        else:
            img = img.convert('RGB')
            img.save(output, format='JPEG', quality=quality, optimize=True)
            content_type = 'image/jpeg'
            ext = 'jpg'
            output.seek(0)
            return {
                'data': output.getvalue(),
                'content_type': content_type,
                'extension': ext,
            }
        content_type = 'image/png'
        ext = 'png'

    output.seek(0)
    return {
        'data': output.getvalue(),
        'content_type': content_type,
        'extension': ext,
    }
