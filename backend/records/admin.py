from django.contrib import admin
from .models import Record

@admin.register(Record)
class RecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('text',)
    ordering = ('-created_at',)