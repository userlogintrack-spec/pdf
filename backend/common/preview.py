"""
Shared preview-flow helpers.

Pattern: conversion/tool endpoints accept a `preview=true` flag. When set,
we stash the generated file server-side under a short-lived token and
return JSON with download URL + preview page images — so the client can
show a thumbnail grid before the user commits to downloading.
"""
import os
import time
import uuid as _uuid

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions
from django.conf import settings
from django.http import HttpResponse, Http404


# In-memory cache: token -> {path, filename, content_type, created_at}
_PREVIEW_CACHE: dict = {}
PREVIEW_TTL_SECONDS = 900  # 15 minutes


def stash_download(path, filename, content_type):
    """Register a generated file for short-lived download-by-token access."""
    token = _uuid.uuid4().hex
    _PREVIEW_CACHE[token] = {
        'path': path,
        'filename': filename,
        'content_type': content_type,
        'created_at': time.time(),
    }
    prune_preview_cache()
    return token


def prune_preview_cache():
    """Drop expired entries + delete their underlying files."""
    now = time.time()
    stale = [t for t, e in _PREVIEW_CACHE.items()
             if now - e['created_at'] > PREVIEW_TTL_SECONDS]
    for t in stale:
        entry = _PREVIEW_CACHE.pop(t, None)
        if entry:
            try:
                os.unlink(entry['path'])
            except OSError:
                pass


def get_cached_entry(token):
    prune_preview_cache()
    return _PREVIEW_CACHE.get(token)


def is_preview(request):
    return str(request.data.get('preview', '')).lower() in ('1', 'true', 'yes', 'on')


def respond_with_preview(
    result_bytes, filename, content_type, preview_flag=False,
    source_doc=None, pages_param=None, is_pdf_output=False, extra_meta=None,
):
    """
    Either stream a download (preview_flag=False) or stash + return JSON
    with a token + preview page URLs (preview_flag=True).

    - `is_pdf_output=True` → preview pages rendered from the output PDF
      via the /api/v1/convert/preview/<token>/<page>/ endpoint.
    - `source_doc` given → preview uses input PDF's pages as a visual
      proxy (correct for PDF→X conversions where the output *looks*
      like the source).
    """
    if not preview_flag:
        response = HttpResponse(result_bytes, content_type=content_type)
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response

    out_dir = settings.BASE_DIR / 'uploads' / 'outputs'
    os.makedirs(out_dir, exist_ok=True)
    ext = os.path.splitext(filename)[1] or '.bin'
    tmp_path = os.path.join(str(out_dir), f"{_uuid.uuid4().hex}{ext}")
    with open(tmp_path, 'wb') as f:
        f.write(result_bytes)
    token = stash_download(tmp_path, filename, content_type)

    preview_pages = []
    page_count = 0

    if is_pdf_output:
        try:
            import fitz
            d = fitz.open(stream=result_bytes, filetype='pdf')
            page_count = d.page_count
            for i in range(page_count):
                preview_pages.append({
                    'index': i + 1,
                    'page_num': i,
                    'thumbnail_url': f'/api/v1/convert/preview/{token}/{i}/?dpi=72',
                    'preview_url':   f'/api/v1/convert/preview/{token}/{i}/?dpi=120',
                })
            d.close()
        except Exception:
            pass
    elif source_doc is not None:
        slides = pages_param if pages_param else list(range(source_doc.page_count))
        page_count = len(slides)
        for idx, p in enumerate(slides):
            preview_pages.append({
                'index': idx + 1,
                'page_num': p,
                'thumbnail_url': f'/api/v1/documents/{source_doc.id}/pages/{p}/image/?dpi=72',
                'preview_url':   f'/api/v1/documents/{source_doc.id}/pages/{p}/image/?dpi=120',
            })

    payload = {
        'token': token,
        'download_url': f'/api/v1/convert/download/{token}/',
        'filename': filename,
        'file_size': len(result_bytes),
        'page_count': page_count,
        'expires_in': PREVIEW_TTL_SECONDS,
        'preview_pages': preview_pages,
    }
    if extra_meta:
        payload.update(extra_meta)
    return Response(payload)


class DownloadByTokenView(APIView):
    """Serve a previously-stashed converted file by token."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, token):
        entry = get_cached_entry(token)
        if not entry or not os.path.exists(entry['path']):
            raise Http404('Download not found or expired')
        with open(entry['path'], 'rb') as f:
            data = f.read()
        response = HttpResponse(data, content_type=entry['content_type'])
        response['Content-Disposition'] = f'attachment; filename="{entry["filename"]}"'
        return response


class PreviewPageView(APIView):
    """Render a single page of a stashed PDF output as PNG."""
    permission_classes = [permissions.AllowAny]

    def get(self, request, token, page_num):
        entry = get_cached_entry(token)
        if not entry or not os.path.exists(entry['path']):
            raise Http404('Preview not found or expired')
        if not entry['path'].lower().endswith('.pdf'):
            raise Http404('Preview only available for PDF output')

        dpi = int(request.query_params.get('dpi', 120))
        dpi = max(48, min(300, dpi))

        try:
            import fitz
            d = fitz.open(entry['path'])
            if page_num < 0 or page_num >= d.page_count:
                d.close()
                raise Http404('Invalid page number')
            page = d[page_num]
            zoom = dpi / 72.0
            pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
            img_bytes = pix.tobytes('png')
            d.close()
        except Http404:
            raise
        except Exception:
            raise Http404('Failed to render preview')

        response = HttpResponse(img_bytes, content_type='image/png')
        response['Cache-Control'] = 'public, max-age=600'
        return response
