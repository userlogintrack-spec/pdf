import os
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.conf import settings
from .models import EditSession, EditOperation
from .serializers import EditSessionSerializer, EditOperationSerializer
from apps.documents.models import Document
from .services.renderer import render_final_pdf
from .services.text_editor import extract_text_blocks, modify_text_in_pdf


class EditSessionCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        doc_id = request.data.get('document')
        doc = get_object_or_404(Document, id=doc_id)
        EditSession.objects.filter(document=doc, is_active=True).update(is_active=False)
        session = EditSession.objects.create(document=doc)
        return Response(EditSessionSerializer(session).data, status=201)


class EditSessionDetailView(generics.RetrieveAPIView):
    serializer_class = EditSessionSerializer
    permission_classes = [permissions.AllowAny]
    queryset = EditSession.objects.all()
    lookup_field = 'id'


class EditOperationCreateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, session_id):
        session = get_object_or_404(EditSession, id=session_id)
        serializer = EditOperationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(session=session)
        return Response(serializer.data, status=201)


class EditOperationUpdateView(APIView):
    permission_classes = [permissions.AllowAny]

    def put(self, request, session_id, op_id):
        operation = get_object_or_404(EditOperation, id=op_id, session_id=session_id)
        serializer = EditOperationSerializer(operation, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, session_id, op_id):
        operation = get_object_or_404(EditOperation, id=op_id, session_id=session_id)
        operation.delete()
        return Response(status=204)


class TextBlocksView(APIView):
    """Get all text blocks from a PDF page with positions for inline editing."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, doc_id, page_num):
        doc = get_object_or_404(Document, id=doc_id)
        blocks = extract_text_blocks(doc, page_num)
        return Response({
            'page': page_num,
            'blocks': blocks,
        })


class TextModifyView(APIView):
    """Modify existing text in a PDF and return the updated PDF."""
    permission_classes = [permissions.AllowAny]

    def post(self, request, doc_id):
        doc = get_object_or_404(Document, id=doc_id)
        modifications = request.data.get('modifications', [])

        if not modifications:
            return Response({'error': 'No modifications provided'}, status=400)

        try:
            pdf_bytes = modify_text_in_pdf(doc, modifications)

            # Save to uploads/outputs/
            output_dir = getattr(settings, 'OUTPUT_DIR', settings.BASE_DIR / 'uploads' / 'outputs')
            os.makedirs(output_dir, exist_ok=True)
            filename = f"edited_{doc.original_filename}"
            output_path = os.path.join(output_dir, filename)

            if os.path.exists(output_path):
                name, ext = os.path.splitext(filename)
                import uuid
                filename = f"{name}_{uuid.uuid4().hex[:8]}{ext}"
                output_path = os.path.join(output_dir, filename)

            with open(output_path, 'wb') as f:
                f.write(pdf_bytes)

            # Also update the document's file to the modified version
            # so subsequent edits work on the updated PDF
            from common.pdf_utils import get_file_path
            current_path = get_file_path(doc)
            with open(current_path, 'wb') as f:
                f.write(pdf_bytes)

            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
        except Exception as e:
            return Response(
                {'error': f'Failed to modify text: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class EditSessionSaveView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, session_id):
        session = get_object_or_404(EditSession, id=session_id)

        try:
            pdf_bytes = render_final_pdf(session)

            output_dir = getattr(settings, 'OUTPUT_DIR', settings.BASE_DIR / 'uploads' / 'outputs')
            os.makedirs(output_dir, exist_ok=True)

            filename = f"edited_{session.document.original_filename}"
            output_path = os.path.join(output_dir, filename)

            if os.path.exists(output_path):
                name, ext = os.path.splitext(filename)
                filename = f"{name}_{str(session.id)[:8]}{ext}"
                output_path = os.path.join(output_dir, filename)

            with open(output_path, 'wb') as f:
                f.write(pdf_bytes)

            response = HttpResponse(pdf_bytes, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            response['X-Output-Path'] = output_path
            return response
        except Exception as e:
            return Response(
                {'error': f'Failed to render PDF: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
