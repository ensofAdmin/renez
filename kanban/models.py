from django.db import models
from django.conf import settings

class Column(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=20, default="#007bff")
    icon = models.CharField(max_length=10, default="📁")

    def __str__(self):
        return self.title

class Task(models.Model):
    column = models.ForeignKey(Column, related_name="tasks", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)
    priority = models.CharField(max_length=20, default="medium")
    labels = models.JSONField(default=list)

    def __str__(self):
        return self.title
