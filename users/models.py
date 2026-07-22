from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    ROLE_CHOICES = (
        ("superuser", "Superuser"),
        ("admin", "Admin"),
        ("guest", "Guest"),
    )

    email = models.EmailField(unique=True)

    # Override Django's default fields to make them required and consistent
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)

    # OAuth
    google_id = models.CharField(max_length=255, blank=True, null=True)

    # Facial recognition embedding
    face_embeddings = models.JSONField(default=list, blank=True)

    # Profile fields
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    preferred_stylist = models.CharField(max_length=100, blank=True, null=True)
    preferred_service = models.CharField(max_length=100, blank=True, null=True)

    notes = models.TextField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="guest")

    def __str__(self):
        return self.username


class PasswordResetOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=5)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"OTP for {self.user.email}: {self.code}"
