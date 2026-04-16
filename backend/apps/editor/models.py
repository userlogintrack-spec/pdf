import uuid
from django.db import models
from apps.documents.models import Document


class EditSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='edit_sessions')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Session for {self.document.original_filename}"


class EditOperation(models.Model):
    class OperationType(models.TextChoices):
        TEXT = 'text', 'Text'
        IMAGE = 'image', 'Image'
        SHAPE = 'shape', 'Shape'
        ANNOTATION = 'annotation', 'Annotation'
        SIGNATURE = 'signature', 'Signature'
        FORM_FIELD = 'form_field', 'Form Field'
        FREEHAND = 'freehand', 'Freehand'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(EditSession, on_delete=models.CASCADE, related_name='operations')
    page_number = models.IntegerField()
    operation_type = models.CharField(max_length=20, choices=OperationType.choices)
    x = models.FloatField()
    y = models.FloatField()
    width = models.FloatField()
    height = models.FloatField()
    rotation = models.FloatField(default=0)
    properties = models.JSONField()
    z_index = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['page_number', 'z_index']

    def __str__(self):
        return f"{self.operation_type} on page {self.page_number}"
