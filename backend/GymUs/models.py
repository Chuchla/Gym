from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.conf import settings

class ClientUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)


class Client(AbstractUser):
    ROLE_CHOICES = [
        ('client', 'Client'),
        ('trainer', 'Trainer'),
        ('admin', 'Admin'),
    ]
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')
    username = models.CharField(max_length=200, null=True, blank=True)

    objects = ClientUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name", "phone_number"]

    def __str__(self):
        return f"{self.first_name} {self.last_name} <{self.email}>"

    def save(self, *args, **kwargs):
        if self.role in ['trainer', 'admin']:
            self.is_staff = True
        else:
            self.is_staff = False
        super().save(*args, **kwargs)


class Employee(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name


class Activity(models.Model):
    date = models.DateField()
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='activities')

    def __str__(self):
        return f"Activity {self.id} on {self.date}"


class Membership(models.Model):
    active_from = models.DateField()
    active_to = models.DateField()
    type = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='memberships')

    def __str__(self):
        return f"Membership {self.type} ({self.status})"




class Event(models.Model):
    date = models.DateField()
    time = models.TimeField()
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    capacity = models.IntegerField()
    trainer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='trainer_events',
        limit_choices_to={'role': 'trainer'}
    )
    place = models.CharField(max_length=255)
    is_personal_training = models.BooleanField(default=False)
    def __str__(self):
        return self.name



class Reservation(models.Model):
    date = models.DateField()
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='reservations')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reservations')

    def __str__(self):
        return f"Reservation {self.id} by {self.client}"


class Basket(models.Model):
    order = models.OneToOneField('Order', on_delete=models.CASCADE, related_name='basket')

    def __str__(self):
        return f"Basket {self.id} for Order {self.order.id}"


class BasketItem(models.Model):
    basket = models.ForeignKey(Basket, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.RESTRICT, related_name='basket_items')
    quantity = models.IntegerField()

    class Meta:
        unique_together = ('basket', 'product')

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


class Order(models.Model):
    client = models.ForeignKey(Client, on_delete=models.SET_NULL, null=True, related_name='orders')
    price = models.FloatField()
    date = models.DateField()
    status = models.CharField(max_length=255)

    def __str__(self):
        return f"Order {self.id} ({self.status})"


class Payment(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='payments')
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    date = models.DateField()
    charge = models.FloatField()
    status = models.CharField(max_length=255)

    def __str__(self):
        return f"Payment {self.id} for Order {self.order.id} ({self.status})"


class Message(models.Model):
    sender_id = models.IntegerField()
    receiver_id = models.IntegerField()
    content = models.CharField(max_length=255)
    date = models.DateField()
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='messages')
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='messages')

    def __str__(self):
        return f"Message {self.id} on {self.date}"
