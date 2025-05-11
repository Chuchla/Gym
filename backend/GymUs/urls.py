from django.urls import path
from .views import register_client, login_client, get_events, login_employee, get_trainer_classes

urlpatterns = [
    path('register/', register_client, name='register-client'),
    path('login/', login_client, name='login-client'),
    path('events/', get_events, name='get-events'),
    path('login-employee/', login_employee, name='login-employee'),
    path('trainer/myclasses/', get_trainer_classes, name='trainer-my-classes'),

]