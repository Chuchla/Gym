from rest_framework.decorators import api_view, action
from GymDB import settings
from rest_framework import viewsets, permissions, status
from .serializers import *
from .models import *
from rest_framework.response import Response
from django.contrib.auth import get_user_model

User = get_user_model()
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


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


class ArticlesViewSet(viewsets.ModelViewSet):
    """
        GET    /api/articles/         → lista
        GET    /api/articles/{pk}/    → detail
        POST   /api/articles/         → create
        PUT    /api/articles/{pk}/    → update
        DELETE /api/articles/{pk}/    → destroy
    """
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class EventViewSet(viewsets.ModelViewSet):
    """
    GET    /api/events/         → lista
    GET    /api/events/{pk}/    → detail
    POST   /api/events/         → create
    PUT    /api/events/{pk}/    → update
    DELETE /api/events/{pk}/    → destroy
    POST   /api/events/{pk}/reserve/    → zapisanie się na wydarzenie
    """
    queryset = Event.objects.all().order_by('date', 'time')
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action in ['list', 'retrive']:
            return [permissions.AllowAny()]
        elif self.action == 'reserve':
            return [permissions.IsAuthenticated()]
        elif self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(trainer=self.request.user)

    @action(
        detail=True,
        methods=['post'],
        permission_classes=[IsAuthenticated],
        url_path='reserve',
        url_name='reserve'
    )
    def reserve(self, request, pk=None):
        """
        POST /api/events/{pk}/reserve/
        """
        user = request.user
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response(
                {'detail': 'Event nie istnieje'},
                status=status.HTTP_404_NOT_FOUND
            )
        reserved_count = event.reservations.count()
        if reserved_count >= event.capacity:
            return Response(
                {'detail': 'Brak wolnych miejsc.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        already = Reservation.objects.filter(client=user, event=event).exists()
        if already:
            return Response(
                {'detail': "Już jestes zapisany na ten event."},
                status=status.HTTP_400_BAD_REQUEST
            )
        Reservation.objects.create(
            client=user,
            event=event,
            date=event.date,
        )
        serializer = self.get_serializer(event)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


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


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def events_view(request):
    user = request.user

    if request.method == 'GET':
        events = Event.objects.filter(trainer=user)
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        if user.role != 'trainer' or 'admin':
            return Response({'error': 'Tylko trenerzy mogą dodawać wydarzenia.'}, status=403)
        serializer = EventSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login_employee(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        employee = Employee.objects.get(email=email)
        return Response({'message': 'Zalogowano', 'employee_id': employee.id}, status=200)
    except Employee.DoesNotExist:
        return Response({'error': 'Nieprawidłowy login'}, status=401)


@api_view(['POST'])
def create_article(request):
    user = request.user
    serializer = ArticleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(created_by=user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_trainer_classes(request):
    user = request.user

    if not hasattr(user, 'role') or user.role != 'trainer':
        return Response({'error': 'Brak dostępu — tylko trenerzy mają dostęp do tej listy.'}, status=403)

    events = Event.objects.filter(employee__email=user.email)
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)
