from django.db import models
from datetime import timedelta
from patient.models import Patient
from doctor.models import Doctor  

class Appointment(models.Model):
    STATUS_CHOICES = [
        ('Requested', 'Đã yêu cầu'),
        ('Confirmed', 'Đã xác nhận'),
        ('Completed', 'Đã hoàn thành'),
        ('CanceledByPatient', 'Đã hủy bởi bệnh nhân'),
        ('CanceledByDoctor', 'Đã hủy bởi bác sĩ'),
    ]

    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    scheduled_time = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=30)  
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Requested')

    def end_time(self):
        return self.scheduled_time + timedelta(minutes=self.duration_minutes)

    def __str__(self):
        return f"{self.patient} - {self.doctor} at {self.scheduled_time}"
