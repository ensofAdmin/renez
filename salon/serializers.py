from django.contrib.auth import get_user_model

from rest_framework import serializers
from .models import Appointment, GuestContactRequest, Review, Service, Stylist

User = get_user_model()


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "name", "duration", "price"]


class StylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stylist
        fields = "__all__"


class AppointmentSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    stylist = StylistSerializer(read_only=True)

    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        source="service",
        write_only=True
    )

    stylist_id = serializers.PrimaryKeyRelatedField(
        queryset=Stylist.objects.all(),
        source="stylist",
        write_only=True
    )

    class Meta:
        model = Appointment
        fields = [
            "id",
            "date",
            "notes",
            "cancelled",
            "service",
            "stylist",
            "service_id",
            "stylist_id",
            "user",
        ]


class GuestContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuestContactRequest
        fields = ["name", "email", "phone", "message"]


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.name", read_only=True)
    stylist_name = serializers.CharField(source="stylist.name", read_only=True)
    service_name = serializers.CharField(source="service.name", read_only=True)

    class Meta:
        model = Review
        fields = [
            "id",
            "user",
            "user_name",
            "appointment",
            "service",
            "service_name",
            "stylist",
            "stylist_name",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]
        extra_kwargs = {
            "user": {"read_only": True},          # ⭐ FIX — user is NOT required
            "appointment": {"required": True},
            "service": {"required": True},
            "stylist": {"required": True},
            "rating": {"required": True},
        }


class UserSerializer(serializers.ModelSerializer):
    is_superuser = serializers.BooleanField(read_only=True)
    is_staff = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "is_superuser", "is_staff"]