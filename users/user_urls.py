from django.urls import path
from .views import (
    ListAllUsersView,
    UpdateUserRoleView,
)

urlpatterns = [
    # List all users
    path("all/", ListAllUsersView.as_view(), name="users-all"),

    # Update user role
    path("<int:user_id>/role/", UpdateUserRoleView.as_view(), name="users-role-update"),
]
