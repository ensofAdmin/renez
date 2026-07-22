from django.urls import path
from .views import (
    ColumnListCreateView,
    ColumnUpdateView,
    ColumnDeleteView,
    TaskCreateView,
    TaskUpdateView,
    TaskDeleteView,
    MoveColumnView,
    MoveTaskView,
)

urlpatterns = [
    path("columns/", ColumnListCreateView.as_view()),
    path("columns/<int:pk>/update/", ColumnUpdateView.as_view()),
    path("columns/<int:pk>/delete/", ColumnDeleteView.as_view()),
    path("tasks/", TaskCreateView.as_view()),
    path("tasks/<int:pk>/update/", TaskUpdateView.as_view()),
    path("tasks/<int:pk>/delete/", TaskDeleteView.as_view()),
    path("move-column/", MoveColumnView.as_view()),
    path("move-task/", MoveTaskView.as_view()),
]
