from django.urls import path
from .views import events_view, login_employee, get_trainer_classes, create_article, search_clients, RecurringEventCreateView, chat_users, get_user_info, current_user, get_messages, send_message, get_chat_users
urlpatterns = [
    path('events/', events_view, name='events'),
    path('login-employee/', login_employee, name='login-employee'),
    path('trainer/trainerPanel/', get_trainer_classes, name='trainer-panel'),
    path('articles/', create_article, name='create-article'),
    path('clients/', search_clients),
    path('events-recurring/', RecurringEventCreateView.as_view(), name='recurring-events'),
    path('users/<int:id>/', get_user_info),
    path('current_user/', current_user),
    path('messages/<int:id>/', get_messages),
    path('send/', send_message),
    path("chats/", get_chat_users, name="get_chat_users"),
]
