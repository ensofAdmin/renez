from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Column, Task
from .serializers import ColumnSerializer, TaskSerializer


class ColumnListCreateView(APIView):
    def get(self, request):
        user = request.user

        if not user:
            return Response({"detail": "Unauthorized"}, status=401)
        qs = Column.objects.filter(user=user).order_by("order")
        return Response(ColumnSerializer(qs, many=True).data)

    def post(self, request):
        user = request.user

        if not user:
            return Response({"detail": "Unauthorized"}, status=401)

        title = request.data.get("title")
        order = Column.objects.filter(user=user).count()
        col = Column.objects.create(user=user, title=title, order=order)
        return Response(ColumnSerializer(col).data, status=201)


class ColumnUpdateView(generics.UpdateAPIView):
    serializer_class = ColumnSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        return Column.objects.filter(user=user)

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        response = super().update(request, *args, **kwargs)
        return Response(response.data)  # ⭐ ALWAYS return updated column


class ColumnDeleteView(APIView):
    def delete(self, request, pk):
        user = request.user

        if not user:
            return Response({"detail": "Unauthorized"}, status=401)
        try:
            col = Column.objects.get(id=pk, user=user)
        except Column.DoesNotExist:
            return Response({"detail": "Not found"}, status=404)
        col.delete()
        return Response(status=204)


class TaskCreateView(APIView):
    def post(self, request):
        user = request.user

        if not user:
            return Response({"detail": "Unauthorized"}, status=401)
        column_id = request.data.get("column")
        try:
            col = Column.objects.get(id=column_id, user=user)
        except Column.DoesNotExist:
            return Response({"detail": "Column not found"}, status=404)

        order = Task.objects.filter(column=col).count()
        data = request.data.copy()
        data["order"] = order
        serializer = TaskSerializer(data=data)
        if serializer.is_valid():
            task = serializer.save(column=col)
            return Response(TaskSerializer(task).data, status=201)
        return Response(serializer.errors, status=400)


class TaskUpdateView(generics.UpdateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ["patch"]

    def get_queryset(self):
        return Task.objects.all()


class TaskDeleteView(APIView):
    def delete(self, request, pk):
        user = request.user
        if not user:
            return Response({"detail": "Unauthorized"}, status=401)
        try:
            task = Task.objects.get(id=pk, column__user=user)
        except Task.DoesNotExist:
            return Response({"detail": "Not found"}, status=404)
        task.delete()
        return Response(status=204)


class MoveColumnView(APIView):
    def post(self, request):
        user = request.user
        if not user:
            return Response({"detail": "Unauthorized"}, status=401)

        column_id = request.data.get("columnId")
        hover_id = request.data.get("hoverColumnId")

        cols = list(Column.objects.filter(user=user).order_by("order"))
        id_to_index = {c.id: i for i, c in enumerate(cols)}

        if column_id not in id_to_index or hover_id not in id_to_index:
            return Response({"detail": "Invalid ids"}, status=400)

        src = id_to_index[column_id]
        dest = id_to_index[hover_id]

        col = cols.pop(src)
        cols.insert(dest, col)

        for i, c in enumerate(cols):
            c.order = i
            c.save()

        return Response({"detail": "ok"})


class MoveTaskView(APIView):
    def post(self, request):

        user = request.user
        if not user:
            return Response({"detail": "Unauthorized"}, status=401)

        task_id = request.data.get("taskId")
        from_col_id = request.data.get("fromColumnId")
        to_col_id = request.data.get("toColumnId")
        hover_index = request.data.get("hoverIndex")

        try:
            task = Task.objects.get(id=task_id, column__user=user)
        except Task.DoesNotExist:
            return Response({"detail": "Task not found"}, status=404)

        from_col = Column.objects.get(id=from_col_id, user=user)
        to_col = Column.objects.get(id=to_col_id, user=user)

        if from_col.id != to_col.id:
            task.column = to_col
            task.save()

        tasks = list(Task.objects.filter(column=to_col).order_by("order"))
        tasks = [t for t in tasks if t.id != task.id]

        if hover_index is None:
            tasks.append(task)
        else:
            tasks.insert(int(hover_index), task)

        for i, t in enumerate(tasks):
            t.order = i
            t.save()

        return Response({"detail": "ok"})
