# backend/salon/admin.py
from django.contrib import admin
from .models import Service, Stylist, Appointment, GalleryPhoto, GuestContactRequest, Review


# -------------------------
# SERVICE ADMIN
# -------------------------
@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price", "duration")
    search_fields = ("name",)
    ordering = ("name",)


# -------------------------
# STYLIST ADMIN
# -------------------------
@admin.register(Stylist)
class StylistAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "specialty", "bio")
    search_fields = ("name", "specialty")
    ordering = ("name",)


# -------------------------
# APPOINTMENT ADMIN
# -------------------------
@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "stylist",
        "service",
        "date",
        "cancelled",
    )

    list_filter = (
        "stylist",
        "service",
        "date",
    )

    # Group fields in admin form
    fieldsets = (
        ("Client Info", {
            "fields": ("user",)
        }),
        ("Appointment Details", {
            "fields": ("stylist", "service", "date", "notes")
        }),
    )


# -------------------------
# GALLERY ADMIN
# -------------------------
@admin.register(GalleryPhoto)
class GalleryPhotoAdmin(admin.ModelAdmin):
    list_display = ("id", "label", "created_at")
    search_fields = ("label",)
    ordering = ("-created_at",)

# -------------------------
# GUEST CONTACT ADMIN
# -------------------------
@admin.register(GuestContactRequest)
class GuestContactAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "created_at")
    search_fields = ("name", "email", "phone")
    list_filter = ("created_at",)


# -------------------------
# REVIEW ADMIN
# -------------------------
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "rating", "created_at")
    list_filter = ("rating", "created_at")
    search_fields = ("user__email", "comment")
    ordering = ("-created_at",)
