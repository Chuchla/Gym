import jwt
from django.core.serializers import serialize
from rest_framework import viewsets
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from GymDB import settings
from .models import Client, Employee
from .serializers import ClientSerializer, ClientLoginSerializer, ClientRegistrationSerializer
from django.contrib.auth.hashers import check_password, make_password
from rest_framework.authtoken.models import Token
from .models import Event
from .serializers import EventSerializer


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
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'Brakuje adresu e-mail lub hasła.'}, status=status.HTTP_400_BAD_REQUEST)

    # 🔍 Spróbuj najpierw klienta
    try:
        client = Client.objects.get(email=email)
        if check_password(password, client.password):
            payload = {'user_id': client.id, 'email': client.email, 'role': 'client'}
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            return Response({
                'token': token,
                'role': 'client',
                'user': {
                    'id': client.id,
                    'first_name': client.first_name,
                    'last_name': client.last_name,
                    'email': client.email,
                }
            }, status=200)
        else:
            return Response({'error': 'Nieprawidłowe hasło.'}, status=401)
    except Client.DoesNotExist:
        pass

    # 🔍 Jeśli nie klient, spróbuj pracownika
    try:
        employee = Employee.objects.get(email=email)
        if check_password(password, employee.password):
            payload = {'user_id': employee.id, 'email': employee.email, 'role': 'employee'}
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            return Response({
                'token': token,
                'role': 'employee',
                'user': {
                    'id': employee.id,
                    'first_name': employee.first_name,
                    'last_name': employee.last_name,
                    'email': employee.email,
                }
            }, status=200)
        else:
            return Response({'error': 'Nieprawidłowe hasło.'}, status=401)
    except Employee.DoesNotExist:
        return Response({'error': 'Użytkownik nie istnieje.'}, status=404)



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


@api_view(['GET'])
def get_trainer_classes(request):
    employee_id = request.headers.get('Employee-ID')
    if not employee_id:
        return Response({'error': 'Brak identyfikatora trenera'}, status=400)

    events = Event.objects.filter(employee__id=employee_id)
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)
