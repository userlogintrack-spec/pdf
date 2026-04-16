from django.contrib import admin
from .models import Document, DocumentVersion, DocumentAsset


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('original_filename', 'user', 'page_count', 'file_size', 'created_at')
    list_filter = ('mime_type', 'is_encrypted')
    search_fields = ('original_filename',)
    readonly_fields = ('id', 'created_at')


@admin.register(DocumentVersion)
class DocumentVersionAdmin(admin.ModelAdmin):
    list_display = ('document', 'version_number', 'created_at')


@admin.register(DocumentAsset)
class DocumentAssetAdmin(admin.ModelAdmin):
    list_display = ('document', 'asset_type', 'original_filename', 'created_at')
