from django.urls import path
from .views import *

urlpatterns = [
    path('/create', CreateDoctorProfileView.as_view(), name='create_doctor'),
    path('/<int:pk>', GetDoctorProfileView.as_view(), name='get_doctor'),
    path('/update/<int:pk>', UpdateDoctorProfileView.as_view(), name='update_doctor'),
    path('/delete/<int:pk>', DeleteDoctorProfileView.as_view(), name='delete_doctor'),
    path('/get-list', ListDoctorsView.as_view(), name='list_doctors'),
]
