from datetime import timedelta
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

from .serializers import (
    LoginSerializer,
    OTPRequestSerializer,
    OTPVerifySerializer,
    PasswordResetCompleteSerializer,
    RegisterSerializer,
    UserSerializer,
)
from .models import User, PasswordResetOTP
from .utils import create_access_token, create_refresh_token

import jwt, random, urllib.parse

User = get_user_model()


class ListAllUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Only superusers can view all users
        if not request.user.is_superuser:
            return Response({"error": "Not authorized"}, status=403)

        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        return Response({
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "is_superuser": user.is_superuser,                  # Include field to reflect on the frontend
                "is_staff": user.is_staff,                          # Include field to reflect on the frontend
            },
            "access": access,
            "refresh": str(refresh)
        })


class LogoutView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        response = Response({"message": "Logged out"})
        response.delete_cookie("jwt")
        return response


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        return Response({
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "phone_number": user.phone_number,
            "preferred_stylist": user.preferred_stylist,
            "preferred_service": user.preferred_service,
            "notes": user.notes,
            "has_face_embedding": user.face_embeddings is not None,
        })


class OTPRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Email not found"}, status=404)

        code = str(random.randint(10000, 99999))

        PasswordResetOTP.objects.create(user=user, code=code)

        send_mail(
            subject="Your Password Reset Code",
            message=f"Your OTP is {code}",
            from_email="noreply@renez.com",
            recipient_list=[email],
        )

        return Response({"message": "OTP sent"})


class OTPVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        code = serializer.validated_data["code"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Email not found"}, status=404)

        try:
            otp = PasswordResetOTP.objects.filter(
                user=user, code=code, is_used=False
            ).latest("created_at")
        except PasswordResetOTP.DoesNotExist:
            return Response({"error": "Invalid OTP"}, status=400)

        # Check expiration (10 minutes)
        if timezone.now() - otp.created_at > timedelta(minutes=10):
            return Response({"error": "OTP expired"}, status=400)

        otp.is_used = True
        otp.save()

        return Response({"message": "OTP verified. You may now set a new password."})


class PasswordResetCompleteView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetCompleteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        new_password = serializer.validated_data["new_password"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Email not found"}, status=404)

        user.set_password(new_password)
        user.save()

        return Response({"message": "Password updated successfully"})


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    permission_classes = [AllowAny]   # ⭐ PUBLIC ENDPOINT
    authentication_classes = []       # ⭐ DISABLE AUTH COMPLETELY

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )


class UpdateUserRoleView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        # Only superusers can update roles
        if not request.user.is_superuser:
            return Response({"error": "Not authorized"}, status=403)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        # Update is_staff or is_superuser
        is_staff = request.data.get("is_staff")
        is_superuser = request.data.get("is_superuser")

        if is_staff is not None:
            user.is_staff = is_staff

        if is_superuser is not None:
            user.is_superuser = is_superuser

        user.first_name = request.data.get("first_name")
        user.last_name = request.data.get("last_name")
        user.role = request.data.get("role")

        user.save()

        return Response(UserSerializer(user).data)


class UserListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.all().order_by("id")
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)