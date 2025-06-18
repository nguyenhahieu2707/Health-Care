from django.urls import path
from .views import *

urlpatterns = [
    path('/get-list-for-patient/<int:patient_id>', ListAppointmentsForPatientView.as_view(), name='list-appointments-for-patient'),
    path('/get-list-for-doctor/<int:doctor_id>', ListAppointmentsForDoctorView.as_view(), name='list-appointments-for-doctor'),
    path('/get-list', ListAppointmentsView.as_view(), name='list-appointments'),
    path('/create', CreateAppointmentView.as_view(), name='create-appointment'),
    path('/<int:pk>', GetAppointmentDetailView.as_view(), name='appointment-detail'),
    path('/update/<int:pk>', UpdateAppointmentView.as_view(), name='update-appointment'),
    path('/delete/<int:pk>', DeleteAppointmentView.as_view(), name='delete-appointment'),
    path('/cancel/<int:pk>', CancelAppointmentView.as_view(), name='cancel-appointment'),
]
