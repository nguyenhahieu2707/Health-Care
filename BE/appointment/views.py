from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError, NotFound
from django.utils.timezone import timedelta
from rest_framework.response import Response
from .models import Appointment
from patient.models import Patient
from doctor.models import Doctor
from .serializers import AppointmentSerializer

class CreateAppointmentView(generics.CreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        data = serializer.validated_data
        patient = data.get('patient')
        doctor = data.get('doctor')
        scheduled_time = data.get('scheduled_time')
        duration = data.get('duration_minutes')

        # Kiểm tra patient
        if not Patient.objects.filter(id=patient.id).exists():
            raise ValidationError("Patient does not exist.")

        # Kiểm tra doctor
        if not Doctor.objects.filter(id=doctor.id).exists():
            raise ValidationError("Doctor does not exist.")

        # Tính thời gian kết thúc của cuộc hẹn mới
        end_time = scheduled_time + timedelta(minutes=duration)

        # Lấy tất cả cuộc hẹn đã Confirm của bác sĩ
        confirmed_appointments = Appointment.objects.filter(
            doctor=doctor,
            status='Confirmed'
        )

        # Kiểm tra chồng lấn lịch
        for appt in confirmed_appointments:
            appt_end = appt.end_time()
            if (appt.scheduled_time < end_time) and (scheduled_time < appt_end):
                raise ValidationError("Doctor already has a confirmed appointment that overlaps with this time.")

        # Nếu không xung đột, lưu
        serializer.save(status='Requested')
class ListAppointmentsView(generics.ListAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class GetAppointmentDetailView(generics.RetrieveAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class UpdateAppointmentView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        data = serializer.validated_data
        patient = data.get('patient', None)  # update có thể không thay đổi patient
        doctor = data.get('doctor', None)
        scheduled_time = data.get('scheduled_time', None)
        duration = data.get('duration_minutes', None)

        instance = self.get_object()  # cuộc hẹn hiện tại đang update

        # Kiểm tra patient nếu được cập nhật
        if patient and not Patient.objects.filter(id=patient.id).exists():
            raise ValidationError("Patient does not exist.")

        # Kiểm tra doctor nếu được cập nhật
        if doctor and not Doctor.objects.filter(id=doctor.id).exists():
            raise ValidationError("Doctor does not exist.")

        # Nếu không truyền scheduled_time hoặc duration, lấy từ instance hiện tại
        if not scheduled_time:
            scheduled_time = instance.scheduled_time
        if not duration:
            duration = instance.duration_minutes  # bạn cần có trường duration_minutes trong model

        end_time = scheduled_time + timedelta(minutes=duration)

        # Lấy các cuộc hẹn confirmed của bác sĩ, trừ chính cuộc hẹn hiện tại
        confirmed_appointments = Appointment.objects.filter(
            doctor=doctor if doctor else instance.doctor,
            status='Confirmed'
        ).exclude(id=instance.id)

        # Kiểm tra xung đột lịch
        for appt in confirmed_appointments:
            appt_end = appt.end_time()  # bạn cần định nghĩa method này trong model
            if (appt.scheduled_time < end_time) and (scheduled_time < appt_end):
                raise ValidationError("Doctor already has a confirmed appointment that overlaps with this time.")

        # Nếu ok thì lưu
        serializer.save()

class DeleteAppointmentView(generics.DestroyAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class CancelAppointmentView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        # Chỉ cho phép hủy nếu trạng thái là Requested hoặc Confirmed
        if instance.status not in ['Requested', 'Confirmed']:
            return Response(
                {'detail': 'Only appointments that are Requested or Confirmed can be canceled.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Xác định ai đang hủy
        if hasattr(user, 'patient_profile'):
            instance.status = 'CanceledByPatient'
        elif hasattr(user, 'doctor_profile'):
            instance.status = 'CanceledByDoctor'
        else:
            return Response({'detail': 'Only patient or doctor can cancel an appointment.'},
                            status=status.HTTP_400_BAD_REQUEST)

        instance.save()
        return Response(AppointmentSerializer(instance).data)

class ListAppointmentsForPatientView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        patient_id = self.kwargs.get('patient_id')
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            raise NotFound("Patient not found.")
        return Appointment.objects.filter(patient=patient)

class ListAppointmentsForDoctorView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        doctor_id = self.kwargs.get('doctor_id')
        try:
            doctor = Doctor.objects.get(id=doctor_id)
        except Doctor.DoesNotExist:
            raise NotFound("Doctor not found.")
        return Appointment.objects.filter(doctor=doctor)