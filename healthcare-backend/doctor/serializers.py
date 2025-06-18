from django.contrib.auth import get_user_model
from rest_framework import serializers
from unidecode import unidecode 
from .models import Doctor
from authentication.models import Role

User = get_user_model()

class DoctorCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = Doctor
        fields = [
            'first_name', 'last_name', 'specialty', 'experience_years', 
            'phone_number', 'address', 'email'
        ]

    def create(self, validated_data):
        email = validated_data.get('email')
        first_name = validated_data.get('first_name', '').strip()
        last_name = validated_data.get('last_name', '').strip()

        # Tạo username: bỏ dấu, khoảng trắng, lowercase
        raw_name = f"{last_name} {first_name}"
        normalized_name = "".join(raw_name.split())  
        raw_username = unidecode(normalized_name.lower())

        # Kiểm tra username đã tồn tại chưa
        username = raw_username
        counter = 1
        while User.objects.filter(username=username).exists():
            counter += 1
            username = f"{raw_username}{counter}"

        # Tạo user với password mặc định
        password = "123456"
        user = User.objects.create_user(
            email=email,
            username=username,
            password=password
        )

        # Tạo role cho user
        Role.objects.create(user=user, role='doctor')

        # Tạo profile-doctor cho user
        doctor = Doctor.objects.create(user=user, **validated_data)
        return doctor

class DoctorSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )

    class Meta:
        model = Doctor
        fields = [
            'id', 'user_id', 'first_name', 'last_name',
            'specialty', 'experience_years', 'phone_number','email', 'address'
        ]
