from django.contrib import admin
from django.contrib.auth.hashers import make_password
from .models import (
    Client, Employee, Product, Activity, Membership, Event,
    Reservation, Basket, BasketItem, Order, Payment, Message
)

class ClientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name')

class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email')

    def save_model(self, request, obj, form, change):
        if 'password' in form.changed_data:
            obj.password = make_password(obj.password)
        super().save_model(request, obj, form, change)

admin.site.register(Client, ClientAdmin)
admin.site.register(Employee, EmployeeAdmin)
admin.site.register(Product)
admin.site.register(Activity)
admin.site.register(Membership)
admin.site.register(Event)
admin.site.register(Reservation)
admin.site.register(Basket)
admin.site.register(BasketItem)
admin.site.register(Order)
admin.site.register(Payment)
admin.site.register(Message)
