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
    path("services/", ServiceListCreateView.as_view()),
    path("services/<int:pk>/", ServiceDetailView.as_view(), name="service-detail"),

    path("stylists/", StylistDetailView.as_view()),
    path("stylists/<int:stylist_id>/", StylistDetailView.as_view()),

    path("gallery/upload-edited/", UploadEditedPhoto.as_view()),

    path("appointments/", AppointmentListCreateView.as_view()),

    path("appointments/<int:id>/", AppointmentDetailView.as_view()),
    path("appointments/<int:id>/cancel/", AppointmentCancelView.as_view()),

    path("guest-contact/", GuestContactView.as_view(), name="guest-contact"),
    path("timeslots/", TimeSlotView.as_view()),

    path("reviews/upsert/", ReviewUpsertView.as_view()),
    path("reviews/", ReviewListView.as_view()),

    path("reviews/<int:pk>/", ReviewDeleteView.as_view()),

    path("users/all/", UserListView.as_view()),

]
