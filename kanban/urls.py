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
    # -------------------------
    # COLUMNS
    # -------------------------
    path("columns/", ColumnListCreateView.as_view(), name="kanban-columns"),
    path("columns/<int:pk>/", ColumnUpdateView.as_view(), name="kanban-column-detail"),
    path("columns/<int:pk>/delete/", ColumnDeleteView.as_view(), name="kanban-column-delete"),

    # -------------------------
    # TASKS
    # -------------------------
    path("tasks/", TaskCreateView.as_view(), name="kanban-tasks"),
    path("tasks/<int:pk>/", TaskUpdateView.as_view(), name="kanban-task-detail"),
    path("tasks/<int:pk>/delete/", TaskDeleteView.as_view(), name="kanban-task-delete"),

    # -------------------------
    # DRAG & DROP MOVEMENT
    # -------------------------
    path("move-column/", MoveColumnView.as_view(), name="kanban-move-column"),
    path("move-task/", MoveTaskView.as_view(), name="kanban-move-task"),
]
