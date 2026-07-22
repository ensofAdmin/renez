from rest_framework import serializers
from .models import Column, Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "order",
            "priority",
            "labels",
            "column",
        ]

class ColumnSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Column
        fields = ["id", "title", "order", "color", "tasks", "icon"]
