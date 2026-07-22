from datetime import datetime, time, timedelta

from django.core.files.base import ContentFile
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from .models import GalleryPhoto, Service, Stylist, Appointment, Review
from .serializers import (
    AppointmentSerializer, GuestContactSerializer, ReviewSerializer, ServiceSerializer, StylistSerializer,
    UserSerializer
)
from users.utils import decode_token

import base64, requests

User = get_user_model()

def get_user_from_request(request):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    payload = decode_token(token)
    if not payload:
        return None

    try:
        return User.objects.get(id=payload.get("sub"))
    except User.DoesNotExist:
        return None

def generate_timeslots(date_obj, service, stylist_id):
    """
    Generate available time slots for a given date, stylist, and service duration.
    Blocks ALL overlapping times, not just the appointment start time.
    """

    # Business hours
    start_time = time(0, 0)
    end_time = time(23, 59)
    slot_length = timedelta(minutes=30)

    # Convert date_obj (datetime.date) → aware datetime at midnight
    date_dt = datetime.combine(date_obj, time.min)
    if timezone.is_naive(date_dt):
        date_dt = timezone.make_aware(date_dt)

    # Generate all possible slots
    all_slots = []
    current = datetime.combine(date_dt.date(), start_time)
    current = timezone.make_aware(current)

    end_dt = datetime.combine(date_dt.date(), end_time)
    end_dt = timezone.make_aware(end_dt)

    while current <= end_dt:
        all_slots.append(current)
        current += slot_length

    # Fetch existing appointments for stylist on that date
    existing_appointments = Appointment.objects.filter(stylist_id=stylist_id, date__date=date_dt.date(), cancelled=False)

    # Helper: check if a slot overlaps an appointment window
    def is_overlapping(slot_dt, appt_start, appt_end):
        return appt_start <= slot_dt < appt_end

    available_slots = []

    for slot_dt in all_slots:
        conflict = False

        for appt in existing_appointments:

            appt_start = appt.date.replace(tzinfo=None)
            appt_end = (appt.date + timedelta(hours=service.duration)).replace(tzinfo=None)
            slot_dt = slot_dt.replace(tzinfo=None)

            if is_overlapping(slot_dt, appt_start, appt_end):
                conflict = True
                break

        if not conflict:
            available_slots.append(slot_dt.strftime("%H:%M"))

    return available_slots

def remove_background(image_b64):
    response = requests.post(
        "https://api.remove.bg/v1.0/removebg",
        files={"image_file": base64.b64decode(image_b64.split(",")[1])},
        data={"size": "auto"},
        headers={"X-Api-Key": "YOUR_API_KEY"},
    )
    return response.content  # binary PNG


class ServiceListCreateView(APIView):
    def get(self, request):
        services = Service.objects.all().order_by("name")
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


class ServiceDetailView(APIView):

    def get(self, request, pk):
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response({"detail": "Service not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ServiceSerializer(service)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response({"detail": "Service not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ServiceSerializer(service, data=request.data, partial=False)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response({"detail": "Service not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ServiceSerializer(service, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response({"detail": "Service not found"}, status=status.HTTP_404_NOT_FOUND)

        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StylistDetailView(APIView):

    def get(self, request):
        try:
            stylists = Stylist.objects.all().order_by("name")
            serializer = StylistSerializer(stylists, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({"detail": str(e)}, status=500)

    def post(self, request):
        try:
            serializer = StylistSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=201)

            return Response(serializer.errors, status=400)

        except Exception as e:
            return Response({"detail": str(e)}, status=500)

    def put(self, request, stylist_id):
        try:
            stylist = Stylist.objects.get(id=stylist_id)
        except Stylist.DoesNotExist:
            return Response({"detail": "Stylist not found"}, status=404)

        serializer = StylistSerializer(stylist, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, stylist_id):
        try:
            stylist = Stylist.objects.get(id=stylist_id)
        except Stylist.DoesNotExist:
            return Response({"detail": "Stylist not found"}, status=404)

        stylist.delete()
        return Response(status=204)


class AppointmentListCreateView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.is_staff: qs = Appointment.objects.filter(cancelled=False).order_by("-date")
        else: qs = Appointment.objects.filter(user=user, cancelled=False).order_by("-date")
        return Response(AppointmentSerializer(qs, many=True).data)

    def post(self, request):
        user = request.user

        data = request.data.copy()

        try:
            data["date"] = datetime.strptime(data["date"], "%Y-%m-%d %H:%M")
        except Exception as e:
            return Response({"detail": "Invalid date format"}, status=400)

        # Validate serializer
        serializer = AppointmentSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        service = serializer.validated_data["service"]
        stylist = serializer.validated_data["stylist"]
        new_start = serializer.validated_data["date"]
        new_end = new_start + timedelta(hours=service.duration)

        # Fetch existing appointments
        existing = Appointment.objects.filter(stylist=stylist, date__date=new_start.date(), cancelled=False)

        # Overlap check
        for appt in existing:
            appt_start = appt.date
            appt_end = appt.date + timedelta(hours=service.duration)

            if new_start < appt_end and new_end > appt_start:
                return Response({
                    "detail": "This appointment overlaps with another booking. Please choose a different time."
                }, status=400)

        # Save appointment
        appt = serializer.save(user=user)
        return Response(AppointmentSerializer(appt).data, status=201)


class AppointmentDetailView(APIView):
    def get(self, request, id):
        try:
            appt = Appointment.objects.get(id=id, user=request.user)
        except Appointment.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AppointmentSerializer(appt)
        return Response(serializer.data)

    def put(self, request, id):
        try:
            appt = Appointment.objects.get(id=id, user=request.user)
        except Appointment.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = AppointmentSerializer(appt, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            appt = Appointment.objects.get(id=id, user=request.user)
        except Appointment.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        appt.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AppointmentCancelView(APIView):
    def post(self, request, pk):
        user = get_user_from_request(request)
        if not user:
            return Response({"detail": "Unauthorized"}, status=401)
        try:
            appt = Appointment.objects.get(id=pk, user=user)
        except Appointment.DoesNotExist:
            return Response({"detail": "Not found"}, status=404)
        appt.cancelled = True
        appt.save()
        return Response({"detail": "Cancelled"})


class GuestContactView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GuestContactSerializer(data=request.data)

        if serializer.is_valid():
            # Save to database
            contact = serializer.save()

            # Send email to admin
            try:
                send_mail(
                    subject="New Guest Contact Request",
                    message=(
                        f"Name: {contact.name}\n"
                        f"Email: {contact.email}\n"
                        f"Phone: {contact.phone}\n"
                        f"Message: {contact.message}\n"
                    ),
                    from_email="ensofassetcare@gmail.com",
                    recipient_list=["ensofassetcare@gmail.com"],
                    fail_silently=False,
                )
            except Exception as e:
                return Response({"detail": str(e)}, status=500)

            return Response({"message": "Contact request submitted"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TimeSlotView(APIView):

    def get(self, request):
        try:
            date = request.GET.get("date")

            service_id = request.GET.get("service")
            stylist_id = request.GET.get("stylist")

            if not date or not service_id or not stylist_id:
                return Response({"detail": "Missing parameters"}, status=400)

            # Validate date
            try:
                date_obj = datetime.strptime(date, "%Y-%m-%d").date()
            except ValueError:
                return Response({"detail": "Invalid date format"}, status=400)

            # Validate service
            try:
                service = Service.objects.get(id=service_id)
            except Service.DoesNotExist:
                return Response({"detail": "Service not found"}, status=404)

            # Validate stylist
            try:
                stylist = Stylist.objects.get(id=stylist_id)
            except Stylist.DoesNotExist:
                return Response({"detail": "Stylist not found"}, status=404)

            # Generate slots

            slots = generate_timeslots(date_obj, service, stylist_id)

            return Response({"available_slots": slots})

        except Exception as e:
            return Response({"detail": str(e)}, status=500)


class ReviewUpsertView(APIView):
    """
    Create OR update a review.
    A user can only have one review per appointment.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        appointment_id = request.data.get("appointment")
        service_id = request.data.get("service")
        stylist_id = request.data.get("stylist")
        rating = request.data.get("rating")
        comment = request.data.get("comment")



        if not appointment_id:
            return Response(
                {"detail": "Appointment is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate appointment exists
        appointment = get_object_or_404(Appointment, id=appointment_id)

        # ⭐ Check if review already exists for this user + appointment
        existing = Review.objects.filter(user=user, appointment=appointment).first()

        if existing:
            # ⭐ Update existing review
            existing.rating = rating
            existing.comment = comment
            existing.service_id = service_id
            existing.stylist_id = stylist_id
            existing.save()

            serializer = ReviewSerializer(existing)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # ⭐ Otherwise create a new review

        serializer = ReviewSerializer(data={
            "appointment": appointment_id,
            "service": service_id,
            "stylist": stylist_id,
            "rating": rating,
            "comment": comment
        })

        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReviewListView(APIView):
    """
    Get reviews filtered by service or stylist.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        service_id = request.query_params.get("service")
        stylist_id = request.query_params.get("stylist")

        qs = Review.objects.all()

        if service_id:
            qs = qs.filter(service_id=service_id)

        if stylist_id:
            qs = qs.filter(stylist_id=stylist_id)

        serializer = ReviewSerializer(qs.order_by("-created_at"), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReviewDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        review = get_object_or_404(Review, pk=pk, user=request.user)
        review.delete()
        return Response(status=204)


class UploadEditedPhoto(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        label = request.data.get("label", "")
        image_b64 = request.data.get("image")

        if not image_b64:
            return Response({"error": "No image provided"}, status=400)

        # Remove header: "data:image/jpeg;base64,"
        format, imgstr = image_b64.split(";base64,")
        ext = format.split("/")[-1]

        image_file = ContentFile(base64.b64decode(imgstr), name=f"edited.{ext}")

        photo = GalleryPhoto.objects.create(
            label=label,
            image=image_file
        )

        return Response({
            "id": photo.id,
            "label": photo.label,
            "image": photo.image.url
        })


class UserListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        users = User.objects.all().order_by("id")
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)