import os
import tempfile
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from apps.documents.models import Document
from common.pdf_utils import get_file_path
from .services import (
    pdf_to_word, pdf_to_excel, pdf_to_image, pdf_to_ppt, pdf_to_text, pdf_to_html, pdf_to_csv,
    word_to_pdf, excel_to_pdf, image_to_pdf, ppt_to_pdf, html_to_pdf, text_to_pdf, csv_to_pdf,
    word_to_image, word_to_html, word_to_text, image_convert, ocr,
)


class PDFToWordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        doc = get_object_or_404(Document, id=doc_id)

        try:
            result = pdf_to_word.convert_pdf_to_word(get_file_path(doc))
            response = HttpResponse(
                result,
                content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            )
            name = os.path.splitext(doc.original_filename)[0]
            response['Content-Disposition'] = f'attachment; filename="{name}.docx"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class PDFToExcelView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        doc = get_object_or_404(Document, id=doc_id)

        try:
            result = pdf_to_excel.convert_pdf_to_excel(get_file_path(doc))
            response = HttpResponse(
                result,
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            name = os.path.splitext(doc.original_filename)[0]
            response['Content-Disposition'] = f'attachment; filename="{name}.xlsx"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


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
            response = HttpResponse(result['data'], content_type=result['content_type'])
            response['Content-Disposition'] = f'attachment; filename="{result["filename"]}"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class PDFToPPTView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        mode = request.data.get('mode', 'hybrid')
        dpi = int(request.data.get('dpi', 250))
        pages = request.data.get('pages')  # optional list of 0-based page numbers
        doc = get_object_or_404(Document, id=doc_id)

        # Validate mode
        if mode not in ('image', 'editable', 'hybrid'):
            mode = 'hybrid'

        # Clamp DPI
        dpi = max(72, min(600, dpi))

        # Parse pages if provided
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
            response = HttpResponse(
                result,
                content_type='application/vnd.openxmlformats-officedocument.presentationml.presentation'
            )
            name = os.path.splitext(doc.original_filename)[0]
            response['Content-Disposition'] = f'attachment; filename="{name}.pptx"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class PDFToTextView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        doc = get_object_or_404(Document, id=doc_id)

        try:
            result = pdf_to_text.convert_pdf_to_text(get_file_path(doc))
            response = HttpResponse(result, content_type='text/plain; charset=utf-8')
            name = os.path.splitext(doc.original_filename)[0]
            response['Content-Disposition'] = f'attachment; filename="{name}.txt"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class PDFToHTMLView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        doc = get_object_or_404(Document, id=doc_id)

        try:
            result = pdf_to_html.convert_pdf_to_html(get_file_path(doc))
            response = HttpResponse(result, content_type='text/html; charset=utf-8')
            name = os.path.splitext(doc.original_filename)[0]
            response['Content-Disposition'] = f'attachment; filename="{name}.html"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class PDFToCSVView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        doc = get_object_or_404(Document, id=doc_id)

        try:
            result = pdf_to_csv.convert_pdf_to_csv(get_file_path(doc))
            response = HttpResponse(result, content_type='text/csv; charset=utf-8')
            name = os.path.splitext(doc.original_filename)[0]
            response['Content-Disposition'] = f'attachment; filename="{name}.csv"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


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

            name = os.path.splitext(file.name)[0]
            response = HttpResponse(result, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{name}.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


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

            name = os.path.splitext(file.name)[0]
            response = HttpResponse(result, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{name}.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


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
            response = HttpResponse(result, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="images.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


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

            name = os.path.splitext(file.name)[0]
            response = HttpResponse(result, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{name}.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


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

            name = os.path.splitext(file.name)[0]
            response = HttpResponse(result, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{name}.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


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

            name = os.path.splitext(file.name)[0]
            response = HttpResponse(result, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{name}.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


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

            name = os.path.splitext(file.name)[0]
            response = HttpResponse(result, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{name}.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


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

            response = HttpResponse(result['data'], content_type=result['content_type'])
            response['Content-Disposition'] = f'attachment; filename="{result["filename"]}"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


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

            name = os.path.splitext(file.name)[0]
            response = HttpResponse(result, content_type='text/html; charset=utf-8')
            response['Content-Disposition'] = f'attachment; filename="{name}.html"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


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

            name = os.path.splitext(file.name)[0]
            response = HttpResponse(result, content_type='text/plain; charset=utf-8')
            response['Content-Disposition'] = f'attachment; filename="{name}.txt"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


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

            name = os.path.splitext(file.name)[0]
            response = HttpResponse(result['data'], content_type=result['content_type'])
            response['Content-Disposition'] = f'attachment; filename="{name}.{result["extension"]}"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


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

            name = os.path.splitext(file.name)[0]
            response = HttpResponse(result['data'], content_type=result['content_type'])
            response['Content-Disposition'] = f'attachment; filename="{name}_compressed.{result["extension"]}"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class OCRView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        language = request.data.get('language', 'eng')
        doc = get_object_or_404(Document, id=doc_id)

        try:
            result = ocr.ocr_pdf(get_file_path(doc), language=language)
            response = HttpResponse(result['data'], content_type='application/pdf')
            name = os.path.splitext(doc.original_filename)[0]
            response['Content-Disposition'] = f'attachment; filename="{name}_ocr.pdf"'
            response['X-OCR-Used'] = str(result['ocr_used'])
            response['X-Pages-Processed'] = str(result['pages_processed'])
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)
