from rest_framework import generics, permissions
from .models import Patient
from .serializers import PatientSerializer, PatientCreateSerializer

class CreatePatientProfileView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

class GetPatientProfileView(generics.RetrieveAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]


class UpdatePatientProfileView(generics.UpdateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]

class DeletePatientProfileView(generics.DestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAdminUser]

class ListPatientsView(generics.ListAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]  # hoặc custom permission
