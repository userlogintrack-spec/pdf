import io
import fitz


def compress_pdf(file_path, quality='medium'):
    """
    Compress a PDF by recompressing images and cleaning up.
    quality: 'low', 'medium', 'high'
    """
    quality_map = {
        'low': {'image_dpi': 72, 'jpeg_quality': 40},
        'medium': {'image_dpi': 120, 'jpeg_quality': 65},
        'high': {'image_dpi': 150, 'jpeg_quality': 85},
    }
    settings = quality_map.get(quality, quality_map['medium'])

    doc = fitz.open(file_path)
    original_size = len(open(file_path, 'rb').read())

    # Recompress images in each page
    for page_num in range(doc.page_count):
        page = doc[page_num]
        image_list = page.get_images(full=True)

        for img_index, img in enumerate(image_list):
            xref = img[0]
            try:
                base_image = doc.extract_image(xref)
                if not base_image:
                    continue

                image_bytes = base_image["image"]
                from PIL import Image as PILImage

                pil_img = PILImage.open(io.BytesIO(image_bytes))

                # Resize if larger than target DPI equivalent
                max_dim = settings['image_dpi'] * 10  # rough max
                if pil_img.width > max_dim or pil_img.height > max_dim:
                    ratio = min(max_dim / pil_img.width, max_dim / pil_img.height)
                    new_size = (int(pil_img.width * ratio), int(pil_img.height * ratio))
                    pil_img = pil_img.resize(new_size, PILImage.LANCZOS)

                # Convert to RGB if necessary
                if pil_img.mode in ('RGBA', 'P'):
                    pil_img = pil_img.convert('RGB')

                # Recompress as JPEG
                img_buffer = io.BytesIO()
                pil_img.save(img_buffer, format='JPEG', quality=settings['jpeg_quality'], optimize=True)
                img_buffer.seek(0)

                # Replace image in PDF - skip if replacement fails
                try:
                    doc.update_stream(xref, img_buffer.read())
                except Exception:
                    pass

            except Exception:
                continue

    # Save with garbage collection and deflate
    output = io.BytesIO()
    doc.save(output, garbage=4, deflate=True, clean=True)
    doc.close()

    compressed_bytes = output.getvalue()
    compressed_size = len(compressed_bytes)

    return {
        'data': compressed_bytes,
        'original_size': original_size,
        'compressed_size': compressed_size,
        'ratio': round((1 - compressed_size / original_size) * 100, 1) if original_size > 0 else 0,
    }
