from django.urls import path
from .views import register_client, login_client, events_view, login_employee, get_trainer_classes, login_view, \
    register_view

urlpatterns = [
    path('register/', register_view, name='api-register'),
    path('login/', login_view, name='api-login'),
    path('events/', events_view, name='events'),
    path('login-employee/', login_employee, name='login-employee'),
    path('trainer/myclasses/', get_trainer_classes, name='trainer-my-classes'),
]
