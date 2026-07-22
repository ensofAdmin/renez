from django.contrib import admin
from .models import Column, Task

# -------------------------
# COLUMN ADMIN
# -------------------------
@admin.register(Column)
class ColumnAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "order", "color")
    search_fields = ("title",)
    ordering = ("title",)


# -------------------------
# TASK ADMIN
# -------------------------
@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("id", "column", "title", "description", "order", "priority", "labels")
    search_fields = ("column", "title",)
    ordering = ("title",)