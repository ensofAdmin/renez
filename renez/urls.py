from django.urls import path, include
from django.http import JsonResponse

def root(request):
    return JsonResponse({"status": "ok", "message": "Renez API is running"})

urlpatterns = [
    # API root
    path("", root),

    # Authentication routes
    path("api/auth/", include("users.auth_urls")),

    # User management routes
    path("api/users/", include("users.user_urls")),

    # Salon routes
    path("api/salon/", include("salon.urls")),

    # Kanban routes
    path("api/kanban/", include("kanban.urls")),
]
