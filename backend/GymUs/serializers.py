from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password, make_password
from rest_framework import serializers
from .models import *

User = get_user_model()


# Meta chce wiedziec do jakiego modelu bedzie odnosic sie te serializer
# W tym przypadku jest to oczywiscie Client (moze kiedys User jak zmienimy nazwe tabeli)
# User bo User = get_user_model i tak bierze sobie Client - z Settings da sie to wyczytac
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'phone_number')
        # Nie chcemy pokazywac naszego hasła przy getach dlatego tylko write_only. Po prostu nie zwracamy
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'password']


class EventSerializer(serializers.ModelSerializer):
    trainer_name = serializers.ReadOnlyField(source='trainer.username')

    reserved_count = serializers.SerializerMethodField(read_only=True)
    remaining_spots = serializers.SerializerMethodField(read_only=True)

    client_ids = serializers.PrimaryKeyRelatedField(
        source='reservation_set',
        read_only=True,
        many=True
    )

    class Meta:
        model = Event
        fields = [
            'id', 'name', 'description', 'date', 'time',
            'capacity', 'place', 'is_personal_training',
            'trainer', 'trainer_name', 'reserved_count', 'remaining_spots', 'client_ids'
        ]
        read_only_fields = ['trainer', 'trainer_name',
                            'reserved_count',
                            'remaining_spots',
                            'client_ids', ]

    def get_reserved_count(self, obj):
        return obj.reservations.count()

    def get_remaining_spots(self, obj):
        return max(obj.capacity - obj.reservations.count(), 0)

    def create(self, validated_data):
        client_ids = validated_data.pop('client_ids', [])
        event = Event.objects.create(**validated_data)

        for client_id in client_ids:
            try:
                client = Client.objects.get(id=client_id)
                Reservation.objects.create(client=client, event=event, date=event.date)
            except Client.DoesNotExist:
                continue

        return event


class ClientLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        try:
            client = Client.objects.get(email=email)
        except Client.DoesNotExist:
            raise serializers.ValidationError("Nie ma użytkownika o takim adresie e-mail.")

        if not check_password(password, client.password):
            raise serializers.ValidationError("Nieprawidłowe hasło.")

        attrs['client'] = client
        return attrs


class ArticleSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'created_by', 'created_at', 'is_approved', 'visible_from', 'visible_to', ]
        read_only_fields = ['is_approved', 'visible_from', 'visible_to']

    def get_created_by(self, obj):
        return f'{obj.created_by.first_name} {obj.created_by.last_name}'

    def get_created_at(self, obj):
        return obj.created_at.strftime('%Y-%m-%d')


class ClientRegistrationSerializer(serializers.ModelSerializer):
    repeat_password = serializers.CharField(write_only=True)

    class Meta:
        model = Client
        fields = [
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'password',
            'repeat_password',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'phone_number': {'required': False, 'allow_blank': True, 'allow_null': True},
        }

    def validate_email(self, value):
        if Client.objects.filter(email=value).exists():
            raise serializers.ValidationError("Użytkownik z takim e-mailem już istnieje.")
        return value

    def validate(self, attrs):
        pw = attrs.get('password')
        pw2 = attrs.pop('repeat_password', None)
        if pw != pw2:
            raise serializers.ValidationError({"repeat_password": "Hasła nie są takie same."})
        if len(pw) < 4:
            raise serializers.ValidationError({"password": "Hasło musi mieć co najmniej 4 znaków."})
        return attrs

    def create(self, validated_data):
        # make_password zahashuje hasło zgodnie z ustawieniami Django
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)


class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ['id', 'name']


class MembershipTypeSerializer(serializers.ModelSerializer):
    features = FeatureSerializer(many=True, read_only=True)

    feature_ids = serializers.PrimaryKeyRelatedField(
        queryset=Feature.objects.all(),
        many=True,
        write_only=True,
        source='features'
    )

    class Meta:
        model = MembershipType
        fields = fields = [
            'id',
            'name',
            'description',
            'price',
            'duration_days',
            'features',  # do odczytu
            'feature_ids',  # do zapisu
        ]


class MembershipSerializer(serializers.ModelSerializer):
    membership_type_details = MembershipTypeSerializer(source='membership_type', read_only=True)
    client_email = serializers.EmailField(source='client.email', read_only=True)

    class Meta:
        model = Membership
        fields = [
            'id',
            'client',
            'client_email',
            'membership_type',
            'membership_type_details',
            'purchase_date',
            'active_from',
            'active_to',
            'status'
        ]
        read_only_fields = ['purchase_date', 'active_to', 'client_email', 'membership_type_details']
        extra_kwargs = {
            'client': {'write_only': True, 'required': False},
            'membership_type': {'write_only': True}
        }


class PurchaseMembershipSerializer(serializers.Serializer):
    membership_type_id = serializers.IntegerField()
    active_from_date = serializers.DateField(required=False, help_text="Data aktywacji, domyślnie dzisiaj.")

    def validate_membership_type_id(self, value):
        try:
            membership_type = MembershipType.objects.get(id=value)

        except MembershipType.DoesNotExist:
            raise serializers.ValidationError("Wybrany typ karnetu nie istnieje.")
        return value

    def create(self, validated_data):
        client = self.context['request'].user
        membership_type_id = validated_data['membership_type_id']
        membership_type = MembershipType.objects.get(id=membership_type_id)

        active_from = timezone.now().date()
        active_to = active_from + timedelta(days=membership_type.duration_days)

        membership = Membership.objects.create(
            client=client,
            membership_type=membership_type,
            active_from=active_from,
            active_to=active_to,
            status='active'
        )
        return membership

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'text', 'timestamp']


class RecurringEventSerializer(serializers.Serializer):
    name = serializers.CharField()
    description = serializers.CharField(required=False, allow_blank=True)
    time = serializers.TimeField()
    place = serializers.CharField()
    capacity = serializers.IntegerField()
    is_personal_training = serializers.BooleanField(default=False)
    is_recurring = serializers.BooleanField(default=True)
    day_of_week = serializers.CharField()
    start_repeat = serializers.DateField()
    end_repeat = serializers.DateField()
    client_ids = serializers.ListField(child=serializers.IntegerField(), required=False)

    def create(self, validated_data):
        from datetime import timedelta
        import calendar

        trainer = self.context['request'].user

        client_ids = validated_data.pop('client_ids', [])
        day_of_week = validated_data.pop('day_of_week')
        start_date = validated_data.pop('start_repeat')
        end_date = validated_data.pop('end_repeat')
        validated_data.pop('is_recurring', None)

        weekday_index = list(calendar.day_name).index(day_of_week.capitalize())

        current = start_date
        created_events = []

        while current <= end_date:
            if current.weekday() == weekday_index:
                event = Event.objects.create(
                    trainer=trainer,
                    date=current,
                    **validated_data
                )
                for client_id in client_ids:
                    try:
                        client = Client.objects.get(id=client_id)
                        Reservation.objects.create(client=client, event=event, date=current)
                    except Client.DoesNotExist:
                        continue
                created_events.append(event)
            current += timedelta(days=1)

        return created_events