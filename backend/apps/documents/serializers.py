from rest_framework import serializers
from .models import Document, DocumentAsset


class DocumentUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        allowed_types = [
            'application/pdf',
            'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp',
        ]
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                f"Unsupported file type: {value.content_type}. Allowed: PDF, PNG, JPEG, GIF, WebP"
            )
        max_size = 200 * 1024 * 1024  # 200MB
        if value.size > max_size:
            raise serializers.ValidationError(f"File too large. Maximum size is 200MB.")
        return value


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = (
            'id', 'original_filename', 'file_size', 'page_count',
            'width', 'height', 'mime_type', 'is_encrypted', 'has_forms',
            'metadata_json', 'created_at', 'expires_at',
        )
        read_only_fields = fields


class DocumentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ('id', 'original_filename', 'file_size', 'page_count', 'created_at')
        read_only_fields = fields


class DocumentAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentAsset
        fields = ('id', 'file', 'asset_type', 'original_filename', 'created_at')
        read_only_fields = ('id', 'created_at')
