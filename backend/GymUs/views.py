from datetime import date

from rest_framework.decorators import api_view, action
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from GymDB import settings
from rest_framework import viewsets, permissions, status
from .serializers import *
from .models import *
from rest_framework.response import Response
from django.contrib.auth import get_user_model

User = get_user_model()
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from pusher import Pusher

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


pusher = Pusher(
    app_id="2002420",
    key="97893798d096f5f036a6",
    secret="d1558224dd7c8ae37cae",
    cluster="eu",
    ssl=True
)

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

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
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

    events = Event.objects.filter(trainer=user)
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


class RecurringEventCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = RecurringEventSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            events = serializer.save()
            return Response({"message": f"Utworzono {len(events)} wydarzeń."})
        return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, id):
    current_user = request.user
    messages = Message.objects.filter(
        models.Q(sender_id=current_user.id, receiver_id=id) |
        models.Q(sender_id=id, receiver_id=current_user.id)
    ).order_by('date')
    data = [{"sender": msg.sender_id, "text": msg.content} for msg in messages]
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({"id": user.id, "username": f"{user.first_name} {user.last_name}"})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request, id):
    try:
        user = Client.objects.get(id=id)
        return Response({
            "id": user.id,
            "username": f"{user.first_name} {user.last_name}"
        })
    except Client.DoesNotExist:
        return Response({"error": "User not found"}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_users(request):
    current_user = request.user
    users = Client.objects.exclude(id=current_user.id)
    data = [{"id": user.id, "username": f"{user.first_name} {user.last_name}"} for user in users]
    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_clients(request):
    query = request.GET.get('q', '').strip().lower()

    if not query:
        return Response([], status=200)

    clients = Client.objects.filter(
        Q(first_name__icontains=query) |
        Q(last_name__icontains=query)
    )

    serializer = RegisterSerializer(clients, many=True)
    return Response(serializer.data)


class MessagePagination(PageNumberPagination):
    page_size = 20
    ordering = '-date'


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    sender = request.user

    receiver_id = request.data.get('receiver')
    content = request.data.get('text')

    if not receiver_id or not content:
        return Response({'error': 'Brakuje danych'}, status=400)

    try:
        receiver = Client.objects.get(id=receiver_id)
        message = Message.objects.create(
            sender=sender,
            receiver=receiver,
            content=content,
            date=date.today()
        )

        pusher.trigger('chat', 'message', {
            'sender': sender.id,
            'receiver': receiver.id,
            'text': message.content,
            'date': str(message.date),
        })

        return Response({'message': 'Wiadomość wysłana'})
    except Client.DoesNotExist:
        return Response({'error': 'Odbiorca nie istnieje'}, status=404)


class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, receiver_id):
        user = request.user
        messages = Message.objects.filter(
            Q(sender=user, receiver_id=receiver_id) |
            Q(sender_id=receiver_id, receiver=user)
        ).order_by('-timestamp', '-id')

        paginator = MessagePagination()
        result_page = paginator.paginate_queryset(messages, request)
        serializer = MessageSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class MembershipTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint do przeglądania dostępnych typów karnetów.
    GET /api/membership-types/ - lista typów karnetów
    GET /api/membership-types/{id}/ - szczegóły typu karnetu
    """
    queryset = MembershipType.objects.all()
    serializer_class = MembershipTypeSerializer
    permission_classes = [permissions.AllowAny]


class MembershipViewSet(viewsets.mixins.ListModelMixin,
                        viewsets.mixins.RetrieveModelMixin,
                        viewsets.GenericViewSet):
    """
    API endpoint do zarządzania karnetami klienta.
    GET /api/my-memberships/ - lista karnetów zalogowanego użytkownika
    GET /api/my-memberships/{id}/ - szczegóły konkretnego karnetu użytkownika
    """
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Membership.objects.filter(client=self.request.user).order_by('-purchase_date')


class PurchaseMembershipView(viewsets.ViewSet):  # Lub użyj generics.CreateAPIView
    """
    API endpoint do zakupu karnetu.
    POST /api/purchase-membership/ - zakup karnetu
        {
            "membership_type_id": ID_TYPU_KARNETU
        }
    """
    serializer_class = PurchaseMembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            client_membership = serializer.save()
            response_serializer = MembershipSerializer(client_membership, context={'request': request})
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_users(request):
    user = request.user

    messages = Message.objects.filter(Q(sender=user) | Q(receiver=user))

    user_ids = set()
    for msg in messages:
        if msg.sender != user:
            user_ids.add(msg.sender.id)
        if msg.receiver != user:
            user_ids.add(msg.receiver.id)

    users = Client.objects.filter(id__in=user_ids)
    serialized = RegisterSerializer(users, many=True)
    return Response(serialized.data)
