from django.urls import path
from .views import events_view, login_employee, get_trainer_classes, create_article

urlpatterns = [
    path('events/', events_view, name='events'),
    path('login-employee/', login_employee, name='login-employee'),
    path('trainer/trainerPanel/', get_trainer_classes, name='trainer-panel'),
    path('articles/', create_article, name='create-article'),

]
