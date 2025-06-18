from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from .models import Role  
from patient.models import Patient
from doctor.models import Doctor

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=Role.ROLE_CHOICES)
    profile = serializers.DictField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'profile']

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', {})  # nếu không có thì lấy dict rỗng
        role_data = validated_data.pop('role')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        Role.objects.create(user=user, role=role_data)

        if role_data == 'patient':
            Patient.objects.create(
                user=user,
                first_name=profile_data.get('first_name', ''),
                last_name=profile_data.get('last_name', ''),
                dob=profile_data.get('dob', '2000-01-01'),  # giá trị mặc định hợp lệ
                gender=profile_data.get('gender', 'O'),
                phone_number=profile_data.get('phone_number', ''),
                address=profile_data.get('address', ''),
                medical_history=profile_data.get('medical_history', '')
            )
        elif role_data == 'doctor':
            Doctor.objects.create(
                user=user,
                first_name=profile_data.get('first_name', ''),
                last_name=profile_data.get('last_name', ''),
                specialty=profile_data.get('specialty', 'DK'),
                experience_years=profile_data.get('experience_years', 0),
                phone_number=profile_data.get('phone_number', ''),
                address=profile_data.get('address', '')
            )

        return user

class UserWithRoleSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

    def get_role(self, obj):
        try:
            return obj.role.role 
        except Role.DoesNotExist:
            return None

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Lấy role user
        user = self.user
        role = None
        try:
            role = user.role.role  
        except:
            pass
        
        # Thêm role vào response data
        data['role'] = role
        
        return data