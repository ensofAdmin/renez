from django.urls import path, include

from django.http import JsonResponse

def root(request):
    return JsonResponse({"status": "ok", "message": "Renez API is running"})

urlpatterns = [
    path("", root),
    path("api/", include("users.urls")),
    path("api/", include("salon.urls")),
    path("api/", include("kanban.urls")),
]