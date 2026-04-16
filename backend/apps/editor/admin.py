from django.contrib import admin
from .models import EditSession, EditOperation


@admin.register(EditSession)
class EditSessionAdmin(admin.ModelAdmin):
    list_display = ('document', 'is_active', 'created_at', 'updated_at')


@admin.register(EditOperation)
class EditOperationAdmin(admin.ModelAdmin):
    list_display = ('session', 'operation_type', 'page_number', 'created_at')
    list_filter = ('operation_type',)
