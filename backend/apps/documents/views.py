import os
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
from .models import Document, DocumentAsset
from .serializers import (
    DocumentSerializer, DocumentListSerializer,
    DocumentUploadSerializer, DocumentAssetSerializer,
)
from . import services


def _save_uploaded_file(uploaded_file):
    """Save uploaded file to uploads/ directory and return the path."""
    upload_dir = getattr(settings, 'UPLOAD_DIR', settings.BASE_DIR / 'uploads')
    os.makedirs(upload_dir, exist_ok=True)

    import uuid as _uuid
    ext = os.path.splitext(uploaded_file.name)[1] or '.pdf'
    filename = f"{_uuid.uuid4().hex}{ext}"
    filepath = os.path.join(str(upload_dir), filename)

    with open(filepath, 'wb+') as f:
        for chunk in uploaded_file.chunks():
            f.write(chunk)

    return filepath, filename


def get_file_path(doc):
    """Get the actual filesystem path of a document's file."""
    # If file.name is a full path, use it directly
    name = doc.file.name
    if os.path.isabs(name) and os.path.exists(name):
        return name
    # Otherwise try file.path (Django default)
    try:
        return get_file_path(doc)
    except Exception:
        return name


class DocumentUploadView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = DocumentUploadSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        uploaded_file = serializer.validated_data['file']

        # Save file to uploads/ folder
        filepath, saved_name = _save_uploaded_file(uploaded_file)

        # Create document
        doc = Document(
            original_filename=uploaded_file.name,
            file=filepath,
            file_size=uploaded_file.size,
            mime_type=uploaded_file.content_type or 'application/pdf',
        )

        if request.user.is_authenticated:
            doc.user = request.user
        else:
            if not request.session.session_key:
                request.session.create()
            doc.session_key = request.session.session_key

        doc.save()

        # Extract PDF info
        try:
            info = services.get_pdf_info(filepath)
            doc.page_count = info['page_count']
            doc.width = info['width']
            doc.height = info['height']
            doc.is_encrypted = info['is_encrypted']
            doc.has_forms = info['has_forms']
            doc.metadata_json = info['metadata']
            doc.save()
        except Exception as e:
            doc.delete()
            return Response(
                {'error': f'Failed to process PDF: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(DocumentSerializer(doc).data, status=status.HTTP_201_CREATED)


class DocumentListView(generics.ListAPIView):
    serializer_class = DocumentListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Document.objects.filter(user=self.request.user)
        session_key = self.request.session.session_key
        if session_key:
            return Document.objects.filter(session_key=session_key)
        return Document.objects.none()


class DocumentDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Document.objects.filter(user=self.request.user)
        session_key = self.request.session.session_key
        if session_key:
            return Document.objects.filter(session_key=session_key)
        return Document.objects.none()


class PageImageView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, doc_id, page_num):
        doc = get_object_or_404(Document, id=doc_id)
        dpi = int(request.query_params.get('dpi', 150))
        width = request.query_params.get('width')
        width = int(width) if width else None

        img_bytes = services.render_page_image(get_file_path(doc), page_num, dpi=dpi, width=width)
        if img_bytes is None:
            return Response({'error': 'Invalid page number'}, status=404)

        response = HttpResponse(img_bytes, content_type='image/png')
        response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        response['Pragma'] = 'no-cache'
        return response


class ThumbnailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, doc_id, page_num):
        doc = get_object_or_404(Document, id=doc_id)
        width = int(request.query_params.get('width', 200))

        img_bytes = services.render_thumbnail(get_file_path(doc), page_num, width=width)
        if img_bytes is None:
            return Response({'error': 'Invalid page number'}, status=404)

        return HttpResponse(img_bytes, content_type='image/png')


class PageTextView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, doc_id, page_num):
        doc = get_object_or_404(Document, id=doc_id)

        text_data = services.extract_page_text(get_file_path(doc), page_num)
        if text_data is None:
            return Response({'error': 'Invalid page number'}, status=404)

        return Response(text_data)


class DocumentAssetUploadView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, doc_id):
        doc = get_object_or_404(Document, id=doc_id)
        file = request.FILES.get('file')
        asset_type = request.data.get('asset_type', 'image')

        if not file:
            return Response({'error': 'No file provided'}, status=400)

        asset = DocumentAsset.objects.create(
            document=doc,
            file=file,
            asset_type=asset_type,
            original_filename=file.name,
        )

        return Response(DocumentAssetSerializer(asset).data, status=201)
