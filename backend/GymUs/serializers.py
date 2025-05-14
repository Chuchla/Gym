from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password, make_password
from rest_framework import serializers
from .models import Client, Event, Employee

User = get_user_model()


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'password']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['event_id', 'event_type', 'date', 'trainer']


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
