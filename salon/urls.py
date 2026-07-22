from django.urls import path
from .views import (
    AppointmentCancelView,
    AppointmentDetailView,
    AppointmentListCreateView,

    ReviewUpsertView,
    ReviewListView,
    ReviewDeleteView,

    ServiceListCreateView,
    ServiceDetailView,

    StylistDetailView,

    GuestContactView,
    TimeSlotView,

    UploadEditedPhoto,

    UserListView,
)

urlpatterns = [
    # -------------------------
    # SERVICES
    # -------------------------
    path("services/", ServiceListCreateView.as_view(), name="salon-services"),
    path("services/<int:pk>/", ServiceDetailView.as_view(), name="salon-service-detail"),

    # -------------------------
    # STYLISTS
    # -------------------------
    path("stylists/", StylistDetailView.as_view(), name="salon-stylists"),
    path("stylists/<int:stylist_id>/", StylistDetailView.as_view(), name="salon-stylist-detail"),

    # -------------------------
    # GALLERY / PHOTO EDITING
    # -------------------------
    path("gallery/upload-edited/", UploadEditedPhoto.as_view(), name="salon-gallery-upload-edited"),

    # -------------------------
    # APPOINTMENTS
    # -------------------------
    path("appointments/", AppointmentListCreateView.as_view(), name="salon-appointments"),
    path("appointments/<int:id>/", AppointmentDetailView.as_view(), name="salon-appointment-detail"),
    path("appointments/<int:id>/cancel/", AppointmentCancelView.as_view(), name="salon-appointment-cancel"),

    # -------------------------
    # GUEST CONTACT FORM
    # -------------------------
    path("guest-contact/", GuestContactView.as_view(), name="salon-guest-contact"),

    # -------------------------
    # TIME SLOTS
    # -------------------------
    path("timeslots/", TimeSlotView.as_view(), name="salon-timeslots"),

    # -------------------------
    # REVIEWS
    # -------------------------
    path("reviews/", ReviewListView.as_view(), name="salon-reviews"),
    path("reviews/upsert/", ReviewUpsertView.as_view(), name="salon-review-upsert"),
    path("reviews/<int:pk>/", ReviewDeleteView.as_view(), name="salon-review-delete"),

    # -------------------------
    # USERS (Salon-specific)
    # -------------------------
    path("users/all/", UserListView.as_view(), name="salon-users-all"),
]
