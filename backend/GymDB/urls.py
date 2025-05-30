from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from GymUs.views import RegisterViewSet, ArticlesViewSet, EventViewSet
from GymUs.admin import custom_admin_site

router = routers.DefaultRouter()
router.register('register', RegisterViewSet, basename='register')
router.register('articles', ArticlesViewSet, basename='articles')
router.register('events', EventViewSet, basename='events')
urlpatterns = [
    path('admin/', custom_admin_site.urls),
    path('api/', include(router.urls)),
    path('api/', include('GymUs.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
