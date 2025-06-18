from django.contrib.auth import get_user_model  
from rest_framework import serializers
from unidecode import unidecode
from .models import Patient
from authentication.models import Role

User = get_user_model()

class PatientCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = Patient
        fields = [
            'first_name', 'last_name', 'dob', 'gender',
            'address', 'phone_number', 'medical_history',
            'email', 
        ]

    def create(self, validated_data):
        email = validated_data.get('email')
        first_name = validated_data.get('first_name', '').strip()
        last_name = validated_data.get('last_name', '').strip()

        # Ghép tên, loại bỏ dấu, khoảng trắng, đưa về lowercase
        raw_name = f"{last_name} {first_name}"
        normalized_name = "".join(raw_name.split())  
        raw_username = unidecode(normalized_name.lower())

        # Kiểm tra username đã tồn tại chưa
        username = raw_username
        counter = 1
        while User.objects.filter(username=username).exists():
            counter += 1
            username = f"{raw_username}{counter}"

        # Tạo user với mật khẩu mặc định
        password = "123456"
        user = User.objects.create_user(
            email=email,
            username=username,
            password=password
        )

        # Tạo role cho user
        Role.objects.create(user=user, role='patient')

        # Tạo profile-patient cho user
        patient = Patient.objects.create(user=user, **validated_data)
        return patient

class PatientSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )

    class Meta:
        model = Patient
        fields = [
            'id', 'user_id', 'first_name', 'last_name', 'dob',
            'gender', 'address', 'phone_number', 'email', 'medical_history'
        ]

