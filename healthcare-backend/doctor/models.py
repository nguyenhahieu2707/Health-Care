from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Doctor(models.Model):
    SPECIALTY_CHOICES = (
        ('ND', 'Nội khoa'),
        ('NK', 'Nhi khoa'),
        ('TM', 'Tim mạch'),
        ('DL', 'Da liễu'),
        ('DK', 'Đa khoa'),
        ('CT', 'Chấn thương chỉnh hình'),
        ('TT', 'Tâm thần'),
        ('TK', 'Thần kinh'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    specialty = models.CharField(max_length=2, choices=SPECIALTY_CHOICES)
    experience_years = models.PositiveIntegerField(default=0)
    phone_number = models.CharField(max_length=15)
    email = models.EmailField(max_length=255, unique=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Bác sĩ {self.first_name} {self.last_name} - {self.get_specialty_display()}"
