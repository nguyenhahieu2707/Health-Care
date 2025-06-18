from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .utils import predict_heart

class PredictHeartDiseaseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data  # DRF tự parse JSON rồi
        result = predict_heart(data)
        return Response(result)

    def get(self, request):
        return Response({'error': 'Only POST allowed'}, status=405)