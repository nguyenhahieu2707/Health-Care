from django.urls import path
from .views import *

urlpatterns = [
    path('/predict', PredictHeartDiseaseView.as_view(), name='predict-heart-disease'),
]
