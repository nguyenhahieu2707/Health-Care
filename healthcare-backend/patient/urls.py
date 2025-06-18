from django.urls import path
from .views import *

urlpatterns = [
    path('/create', CreatePatientProfileView.as_view(), name='create_patient'),
    path('/<int:pk>', GetPatientProfileView.as_view(), name='get_patient'),
    path('/update/<int:pk>', UpdatePatientProfileView.as_view(), name='update_patient'),
    path('/delete/<int:pk>', DeletePatientProfileView.as_view(), name='delete_patient'),
    path('/get-list', ListPatientsView.as_view(), name='list_patients'),
]
