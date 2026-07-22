from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    LoginView,
    LogoutView,
    RegisterView,
    MeView,
    OTPRequestView,
    OTPVerifyView,
    PasswordResetCompleteView,
)

urlpatterns = [
    # Authentication
    path("login/", LoginView.as_view(), name="auth-login"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("register/", RegisterView.as_view(), name="auth-register"),

    # User identity
    path("me/", MeView.as_view(), name="auth-me"),

    # JWT refresh
    path("token/refresh/", TokenRefreshView.as_view(), name="auth-token-refresh"),

    # Password reset (OTP)
    path("password-reset/request/", OTPRequestView.as_view(), name="auth-password-reset-request"),
    path("password-reset/verify/", OTPVerifyView.as_view(), name="auth-password-reset-verify"),
    path("password-reset/complete/", PasswordResetCompleteView.as_view(), name="auth-password-reset-complete"),
]
