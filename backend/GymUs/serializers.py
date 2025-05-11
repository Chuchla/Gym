from rest_framework import serializers
from .models import Client, Event

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['first_name', 'last_name', 'email', 'phone_number', 'password']


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['event_id', 'event_type', 'date', 'trainer']