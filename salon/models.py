from django.db import models
from django.conf import settings


class GalleryPhoto(models.Model):
    label = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to="gallery/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.label or f"Photo {self.id}"


class GuestContactRequest(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} — {self.email}"


class Service(models.Model):
    name = models.CharField(max_length=100)
    duration = models.PositiveIntegerField(default=30)
    price = models.DecimalField(max_digits=7, decimal_places=2)  # e.g., 150.00

    def __str__(self):
        return f"{self.name} ({self.price} SAR)"


class Stylist(models.Model):
    name = models.CharField(max_length=100)
    specialty = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Appointment(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="appointments"
    )

    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    stylist = models.ForeignKey(Stylist, on_delete=models.CASCADE)

    # ISO datetime string from React maps cleanly to DateTimeField
    date = models.DateTimeField()

    notes = models.TextField(blank=True)
    cancelled = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.service} with {self.stylist} on {self.date}"


class Review(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.CASCADE,
        related_name="appointment"
    )

    stylist = models.ForeignKey(
        Stylist,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviews"
    )

    service = models.ForeignKey(
        Service,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reviews"
    )

    rating = models.PositiveSmallIntegerField(default=5)  # 1–5 stars
    comment = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # ⭐ Added for upsert tracking

    class Meta:
        # ⭐ Prevent duplicate reviews for same appointment by same user
        unique_together = ("user", "appointment")

    def __str__(self):
        return f"{self.user.email} — {self.rating}★"


