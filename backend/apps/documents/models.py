import uuid
from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


def default_expiry():
    return timezone.now() + timedelta(hours=24)


class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name='documents', null=True, blank=True
    )
    session_key = models.CharField(max_length=40, blank=True, db_index=True)
    original_filename = models.CharField(max_length=500)
    file = models.FileField(upload_to='documents/%Y/%m/%d/')
    file_size = models.BigIntegerField()
    page_count = models.IntegerField(default=0)
    width = models.FloatField(default=0)
    height = models.FloatField(default=0)
    mime_type = models.CharField(max_length=100, default='application/pdf')
    is_encrypted = models.BooleanField(default=False)
    has_forms = models.BooleanField(default=False)
    metadata_json = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=default_expiry)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['expires_at']),
        ]

    def __str__(self):
        return f"{self.original_filename} ({self.page_count} pages)"


class DocumentVersion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='versions')
    version_number = models.IntegerField()
    file = models.FileField(upload_to='versions/%Y/%m/%d/')
    description = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('document', 'version_number')
        ordering = ['-version_number']

    def __str__(self):
        return f"{self.document.original_filename} v{self.version_number}"


class DocumentAsset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='assets')
    file = models.FileField(upload_to='assets/%Y/%m/%d/')
    asset_type = models.CharField(max_length=20)  # 'image', 'signature'
    original_filename = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.asset_type}: {self.original_filename}"
