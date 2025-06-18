from rest_framework import generics, permissions
from .models import Doctor
from .serializers import DoctorSerializer, DoctorCreateSerializer

class CreateDoctorProfileView(generics.CreateAPIView):
    serializer_class = DoctorCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

class GetDoctorProfileView(generics.RetrieveAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]

class UpdateDoctorProfileView(generics.UpdateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]

class DeleteDoctorProfileView(generics.DestroyAPIView):
    queryset = Doctor.objects.all()
    permission_classes = [permissions.IsAdminUser]

class ListDoctorsView(generics.ListAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [permissions.IsAuthenticated]
