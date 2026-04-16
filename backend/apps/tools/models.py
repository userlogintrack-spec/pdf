import uuid
from django.db import models
from django.conf import settings


class ToolJob(models.Model):
    class Status(models.TextChoices):
        QUEUED = 'queued', 'Queued'
        PROCESSING = 'processing', 'Processing'
        COMPLETED = 'completed', 'Completed'
        FAILED = 'failed', 'Failed'

    class ToolType(models.TextChoices):
        MERGE = 'merge', 'Merge'
        SPLIT = 'split', 'Split'
        ROTATE = 'rotate', 'Rotate'
        CROP = 'crop', 'Crop'
        REORDER = 'reorder', 'Reorder'
        EXTRACT = 'extract', 'Extract'
        COMPRESS = 'compress', 'Compress'
        WATERMARK = 'watermark', 'Watermark'
        PROTECT = 'protect', 'Protect'
        UNLOCK = 'unlock', 'Unlock'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='tool_jobs'
    )
    tool_type = models.CharField(max_length=30, choices=ToolType.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.QUEUED)
    progress = models.IntegerField(default=0)
    input_params = models.JSONField(default=dict)
    result_file = models.FileField(upload_to='results/%Y/%m/%d/', null=True, blank=True)
    error_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.tool_type} - {self.status}"
