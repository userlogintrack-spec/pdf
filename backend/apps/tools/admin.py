from django.contrib import admin
from .models import ToolJob


@admin.register(ToolJob)
class ToolJobAdmin(admin.ModelAdmin):
    list_display = ('tool_type', 'status', 'progress', 'created_at')
    list_filter = ('tool_type', 'status')
