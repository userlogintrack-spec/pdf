import os
import tempfile
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from apps.documents.models import Document
from common.pdf_utils import get_file_path
from common.preview import (
    respond_with_preview as _respond_with_preview,
    is_preview as _is_preview,
    DownloadByTokenView,
    PreviewPageView,
)
from .services import (
    pdf_to_word, pdf_to_excel, pdf_to_image, pdf_to_ppt, pdf_to_text, pdf_to_html, pdf_to_csv,
    word_to_pdf, excel_to_pdf, image_to_pdf, ppt_to_pdf, html_to_pdf, text_to_pdf, csv_to_pdf,
    word_to_image, word_to_html, word_to_text, image_convert, ocr,
)

# Re-export so existing urls.py (views.DownloadByTokenView / PreviewPageView) keeps working
__all__ = ['DownloadByTokenView', 'PreviewPageView']


class PDFToWordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        doc = get_object_or_404(Document, id=doc_id)
        try:
            result = pdf_to_word.convert_pdf_to_word(get_file_path(doc))
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(doc.original_filename)[0]
        return _respond_with_preview(
            result, f"{name}.docx",
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            preview_flag=_is_preview(request), source_doc=doc,
        )


class PDFToExcelView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        doc = get_object_or_404(Document, id=doc_id)
        try:
            result = pdf_to_excel.convert_pdf_to_excel(get_file_path(doc))
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(doc.original_filename)[0]
        return _respond_with_preview(
            result, f"{name}.xlsx",
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            preview_flag=_is_preview(request), source_doc=doc,
        )


class PDFToImageView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        fmt = request.data.get('format', 'png')
        dpi = int(request.data.get('dpi', 200))
        pages = request.data.get('pages')
        doc = get_object_or_404(Document, id=doc_id)
        try:
            result = pdf_to_image.convert_pdf_to_images(
                get_file_path(doc), fmt=fmt, dpi=dpi, pages=pages
            )
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        if _is_preview(request):
            # PDF→Image outputs may be a single image OR a zip of images.
            # Use source PDF pages as preview proxy (what the user will get).
            return _respond_with_preview(
                result['data'], result['filename'], result['content_type'],
                preview_flag=True, source_doc=doc,
            )
        response = HttpResponse(result['data'], content_type=result['content_type'])
        response['Content-Disposition'] = f'attachment; filename="{result["filename"]}"'
        return response


class PDFToPPTView(APIView):
    """Convert PDF → PPTX. Supports `preview=true` flag (see _respond_with_preview)."""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        mode = request.data.get('mode', 'hybrid')
        dpi = int(request.data.get('dpi', 250))
        pages = request.data.get('pages')
        doc = get_object_or_404(Document, id=doc_id)

        if mode not in ('image', 'editable', 'hybrid'):
            mode = 'hybrid'
        dpi = max(72, min(600, dpi))

        page_list = None
        if pages:
            if isinstance(pages, list):
                page_list = [int(p) for p in pages]
            elif isinstance(pages, str):
                page_list = [int(p.strip()) for p in pages.split(',') if p.strip().isdigit()]

        try:
            result = pdf_to_ppt.convert_pdf_to_ppt(
                get_file_path(doc), mode=mode, dpi=dpi, pages=page_list
            )
        except Exception as e:
            return Response({'error': str(e)}, status=500)

        name = os.path.splitext(doc.original_filename)[0]
        return _respond_with_preview(
            result, f"{name}.pptx",
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            preview_flag=_is_preview(request), source_doc=doc,
            pages_param=page_list, extra_meta={'mode': mode, 'dpi': dpi,
            'slide_count': len(page_list) if page_list else doc.page_count},
        )


class PDFToTextView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        doc = get_object_or_404(Document, id=doc_id)
        try:
            result = pdf_to_text.convert_pdf_to_text(get_file_path(doc))
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(doc.original_filename)[0]
        raw = result.encode('utf-8') if isinstance(result, str) else result
        return _respond_with_preview(
            raw, f"{name}.txt", 'text/plain; charset=utf-8',
            preview_flag=_is_preview(request), source_doc=doc,
        )


class PDFToHTMLView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        doc = get_object_or_404(Document, id=doc_id)
        try:
            result = pdf_to_html.convert_pdf_to_html(get_file_path(doc))
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(doc.original_filename)[0]
        raw = result.encode('utf-8') if isinstance(result, str) else result
        return _respond_with_preview(
            raw, f"{name}.html", 'text/html; charset=utf-8',
            preview_flag=_is_preview(request), source_doc=doc,
        )


class PDFToCSVView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        doc = get_object_or_404(Document, id=doc_id)

        try:
            result = pdf_to_csv.convert_pdf_to_csv(get_file_path(doc))
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(doc.original_filename)[0]
        raw = result.encode('utf-8') if isinstance(result, str) else result
        return _respond_with_preview(
            raw, f"{name}.csv", 'text/csv; charset=utf-8',
            preview_flag=_is_preview(request), source_doc=doc,
        )


class WordToPDFView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as tmp:
                for chunk in file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name
            result = word_to_pdf.convert_word_to_pdf(tmp_path)
            os.unlink(tmp_path)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(file.name)[0]
        return _respond_with_preview(
            result, f"{name}.pdf", 'application/pdf',
            preview_flag=_is_preview(request), is_pdf_output=True,
        )


class ExcelToPDFView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as tmp:
                for chunk in file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name
            result = excel_to_pdf.convert_excel_to_pdf(tmp_path)
            os.unlink(tmp_path)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(file.name)[0]
        return _respond_with_preview(
            result, f"{name}.pdf", 'application/pdf',
            preview_flag=_is_preview(request), is_pdf_output=True,
        )


class ImageToPDFView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        files = request.FILES.getlist('files')
        if not files:
            file = request.FILES.get('file')
            if file:
                files = [file]
            else:
                return Response({'error': 'No files provided'}, status=400)
        try:
            image_bytes_list = []
            for f in files:
                image_bytes_list.append((f.name, f.read()))
            result = image_to_pdf.convert_image_bytes_to_pdf(image_bytes_list)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        return _respond_with_preview(
            result, 'images.pdf', 'application/pdf',
            preview_flag=_is_preview(request), is_pdf_output=True,
        )


class PPTToPDFView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pptx') as tmp:
                for chunk in file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name
            result = ppt_to_pdf.convert_ppt_to_pdf(tmp_path)
            os.unlink(tmp_path)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(file.name)[0]
        return _respond_with_preview(
            result, f"{name}.pdf", 'application/pdf',
            preview_flag=_is_preview(request), is_pdf_output=True,
        )


class HTMLToPDFView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.html') as tmp:
                for chunk in file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name
            result = html_to_pdf.convert_html_to_pdf(tmp_path)
            os.unlink(tmp_path)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(file.name)[0]
        return _respond_with_preview(
            result, f"{name}.pdf", 'application/pdf',
            preview_flag=_is_preview(request), is_pdf_output=True,
        )


class TextToPDFView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.txt') as tmp:
                for chunk in file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name
            result = text_to_pdf.convert_text_to_pdf(tmp_path)
            os.unlink(tmp_path)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(file.name)[0]
        return _respond_with_preview(
            result, f"{name}.pdf", 'application/pdf',
            preview_flag=_is_preview(request), is_pdf_output=True,
        )


class CSVToPDFView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.csv') as tmp:
                for chunk in file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name
            result = csv_to_pdf.convert_csv_to_pdf(tmp_path)
            os.unlink(tmp_path)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(file.name)[0]
        return _respond_with_preview(
            result, f"{name}.pdf", 'application/pdf',
            preview_flag=_is_preview(request), is_pdf_output=True,
        )


class WordToImageView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
        fmt = request.data.get('format', 'png')
        dpi = int(request.data.get('dpi', 200))
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as tmp:
                for chunk in file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name
            result = word_to_image.convert_word_to_images(tmp_path, fmt=fmt, dpi=dpi)
            os.unlink(tmp_path)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        return _respond_with_preview(
            result['data'], result['filename'], result['content_type'],
            preview_flag=_is_preview(request),
        )


class WordToHTMLView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as tmp:
                for chunk in file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name
            result = word_to_html.convert_word_to_html(tmp_path)
            os.unlink(tmp_path)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(file.name)[0]
        raw = result.encode('utf-8') if isinstance(result, str) else result
        return _respond_with_preview(
            raw, f"{name}.html", 'text/html; charset=utf-8',
            preview_flag=_is_preview(request),
        )


class WordToTextView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as tmp:
                for chunk in file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name
            result = word_to_text.convert_word_to_text(tmp_path)
            os.unlink(tmp_path)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(file.name)[0]
        raw = result.encode('utf-8') if isinstance(result, str) else result
        return _respond_with_preview(
            raw, f"{name}.txt", 'text/plain; charset=utf-8',
            preview_flag=_is_preview(request),
        )


class ImageFormatConvertView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
        target_format = request.data.get('format', 'png')
        try:
            img_bytes = file.read()
            result = image_convert.convert_image_format(img_bytes, target_format)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(file.name)[0]
        return _respond_with_preview(
            result['data'], f"{name}.{result['extension']}", result['content_type'],
            preview_flag=_is_preview(request),
        )


class ImageCompressView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'No file provided'}, status=400)
        quality = int(request.data.get('quality', 70))
        max_width = request.data.get('max_width')
        max_height = request.data.get('max_height')
        if max_width:
            max_width = int(max_width)
        if max_height:
            max_height = int(max_height)
        try:
            img_bytes = file.read()
            result = image_convert.compress_image(
                img_bytes, quality=quality, max_width=max_width, max_height=max_height
            )
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(file.name)[0]
        orig_size = len(img_bytes)
        new_size = len(result['data'])
        return _respond_with_preview(
            result['data'], f"{name}_compressed.{result['extension']}", result['content_type'],
            preview_flag=_is_preview(request),
            extra_meta={'original_size': orig_size, 'compressed_size': new_size,
                        'ratio': round(new_size / orig_size, 3) if orig_size else 1.0},
        )


class OCRView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        language = request.data.get('language', 'eng')
        doc = get_object_or_404(Document, id=doc_id)
        try:
            result = ocr.ocr_pdf(get_file_path(doc), language=language)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        name = os.path.splitext(doc.original_filename)[0]
        return _respond_with_preview(
            result['data'], f"{name}_ocr.pdf", 'application/pdf',
            preview_flag=_is_preview(request), is_pdf_output=True,
            extra_meta={'ocr_used': result.get('ocr_used'),
                        'pages_processed': result.get('pages_processed')},
        )
