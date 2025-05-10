from django.contrib import admin
from .models import Client
# Register your models here.

class ToDoAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name')

admin.site.register(Client, ToDoAdmin)