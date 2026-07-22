from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    LoginView, LogoutView, MeView, RegisterView,
    UpdateUserRoleView, ListAllUsersView, OTPRequestView,
    OTPVerifyView, PasswordResetCompleteView
)

urlpatterns = [

    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),

    path("me/", MeView.as_view()),

    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path("register/", RegisterView.as_view()),
    path("<int:user_id>/role/", UpdateUserRoleView.as_view()),
    path("all/", ListAllUsersView.as_view()),

    path("password-reset/request/", OTPRequestView.as_view()),
    path("password-reset/verify/", OTPVerifyView.as_view()),
    path("password-reset/complete/", PasswordResetCompleteView.as_view()),

]