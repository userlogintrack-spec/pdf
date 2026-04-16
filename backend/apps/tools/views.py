from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from .models import ToolJob
from apps.documents.models import Document
from common.pdf_utils import get_file_path
from .services import merge, split, rotate, reorder, extract, compress, watermark, crop


class MergeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_ids = request.data.get('document_ids', [])
        if len(doc_ids) < 2:
            return Response({'error': 'At least 2 documents required'}, status=400)

        docs = [get_object_or_404(Document, id=did) for did in doc_ids]
        file_paths = [get_file_path(doc) for doc in docs]

        try:
            result = merge.merge_pdfs(file_paths)
            response = HttpResponse(result, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="merged.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class SplitView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        ranges = request.data.get('ranges', [])
        doc = get_object_or_404(Document, id=doc_id)

        try:
            page_ranges = []
            for r in ranges:
                if isinstance(r, str) and '-' in r:
                    start, end = r.split('-')
                    page_ranges.append((int(start) - 1, int(end) - 1))
                elif isinstance(r, (list, tuple)):
                    page_ranges.append((r[0], r[1]))

            results = split.split_pdf(get_file_path(doc), page_ranges)

            if len(results) == 1:
                response = HttpResponse(results[0], content_type='application/pdf')
                response['Content-Disposition'] = 'attachment; filename="split.pdf"'
                return response

            response = HttpResponse(results[0], content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="split_1.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class RotateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        rotations = request.data.get('pages', {})
        doc = get_object_or_404(Document, id=doc_id)

        try:
            result = rotate.rotate_pages(get_file_path(doc), rotations)
            response = HttpResponse(result, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="rotated.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class ReorderView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        new_order = request.data.get('new_order', [])
        doc = get_object_or_404(Document, id=doc_id)

        try:
            result = reorder.reorder_pages(get_file_path(doc), new_order)
            response = HttpResponse(result, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="reordered.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class ExtractView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        page_numbers = request.data.get('pages', [])
        doc = get_object_or_404(Document, id=doc_id)

        try:
            result = extract.extract_pages(get_file_path(doc), page_numbers)
            response = HttpResponse(result, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="extracted.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class CompressView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        quality = request.data.get('quality', 'medium')
        doc = get_object_or_404(Document, id=doc_id)

        try:
            result = compress.compress_pdf(get_file_path(doc), quality)
            response = HttpResponse(result['data'], content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="compressed.pdf"'
            response['X-Original-Size'] = str(result['original_size'])
            response['X-Compressed-Size'] = str(result['compressed_size'])
            response['X-Compression-Ratio'] = str(result['ratio'])
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class WatermarkView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        text = request.data.get('text', 'DRAFT')
        font_size = request.data.get('font_size', 60)
        color = request.data.get('color', '#CCCCCC')
        opacity = request.data.get('opacity', 0.3)
        rotation = request.data.get('rotation', 45)
        position = request.data.get('position', 'center')
        doc = get_object_or_404(Document, id=doc_id)

        try:
            result = watermark.add_text_watermark(
                get_file_path(doc), text=text, font_size=font_size,
                color=color, opacity=opacity, rotation=rotation, position=position,
            )
            response = HttpResponse(result, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="watermarked.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class CropView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document_id')
        crop_box = request.data.get('crop_box', {})
        pages = request.data.get('pages')
        doc = get_object_or_404(Document, id=doc_id)

        try:
            result = crop.crop_pages(get_file_path(doc), crop_box, pages)
            response = HttpResponse(result, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename="cropped.pdf"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class JobStatusView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, job_id):
        job = get_object_or_404(ToolJob, id=job_id)
        return Response({
            'id': str(job.id),
            'tool_type': job.tool_type,
            'status': job.status,
            'progress': job.progress,
            'error_message': job.error_message,
        })
