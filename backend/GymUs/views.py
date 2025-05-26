import jwt
from rest_framework.decorators import api_view
from GymDB import settings
from rest_framework import viewsets, permissions, status
from .serializers import *
from .models import *
from rest_framework.response import Response
from django.contrib.auth import get_user_model

User = get_user_model()


class RegisterViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClientView(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    queryset = Client.objects.all()


@api_view(['POST'])
def register_client(request):
    data = request.data.copy()
    data['password'] = make_password(data['password'])  # hashowanie hasła
    serializer = ClientSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Użytkownik zarejestrowany!"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_client(request):
    login = request.data.get('login')
    password = request.data.get('password')

    try:
        client = Client.objects.get(login=login)
        if check_password(password, client.password):
            return Response({'message': 'Zalogowano pomyślnie'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Nieprawidłowe hasło'}, status=status.HTTP_401_UNAUTHORIZED)
    except Client.DoesNotExist:
        return Response({'error': 'Użytkownik nie istnieje'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def login_view(request):
    serializer = ClientLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    client = serializer.validated_data['client']

    payload = {
        "client_id": client.id,
        "email": client.email,
    }
    # Upewnij się, że importujesz PyJWT: `import jwt`
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

    return Response({"token": token}, status=status.HTTP_200_OK)


@api_view(['POST'])
def register_view(request):
    serializer = ClientRegistrationSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    client = serializer.save()

    # generujemy prosty JWT
    payload = {'client_id': client.id, 'email': client.email}
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

    return Response({
        'client': {
            'id': client.id,
            'first_name': client.first_name,
            'last_name': client.last_name,
            'email': client.email,
            'phone_number': client.phone_number,
        },
        'token': token,
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def get_events(request):
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


# views.py
@api_view(['POST'])
def login_employee(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        employee = Employee.objects.get(email=email)
        # Jeśli nie trzymasz hasła, pominij check_password
        return Response({'message': 'Zalogowano', 'employee_id': employee.id}, status=200)
    except Employee.DoesNotExist:
        return Response({'error': 'Nieprawidłowy login'}, status=401)


@api_view(['GET'])
def get_trainer_classes(request):
    employee_id = request.headers.get('Employee-ID')
    if not employee_id:
        return Response({'error': 'Brak identyfikatora trenera'}, status=400)

    events = Event.objects.filter(employee__id=employee_id)
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)
