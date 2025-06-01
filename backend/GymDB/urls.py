from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from GymUs.views import (
    RegisterViewSet, ArticlesViewSet, EventViewSet,
    MembershipTypeViewSet, MembershipViewSet, PurchaseMembershipView, ProductViewSet, CartDetailView, CartItemsView,
    CheckoutCartView, CartItemDetailModifyView
)
from GymUs.admin import custom_admin_site

router = routers.DefaultRouter()
router.register('register', RegisterViewSet, basename='register')
router.register('articles', ArticlesViewSet, basename='articles')
router.register('clients', ClientViewSet, basename='clients')
router.register('events', EventViewSet, basename='events')
router.register('membership-types', MembershipTypeViewSet, basename='membership-types')
router.register('my-memberships', MembershipViewSet, basename='my-memberships')
router.register('purchase-membership', PurchaseMembershipView, basename='purchase-membership')
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('admin/', custom_admin_site.urls),
    path('api/', include(router.urls)),
    path('api/', include('GymUs.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/cart/', CartDetailView.as_view(), name='cart-detail'),
    path('api/cart/items/', CartItemsView.as_view(), name='cart-items'),
    path('api/cart/items/<int:item_id>/', CartItemDetailModifyView.as_view(), name='cart-item-modify'),
    path('api/cart/checkout/', CheckoutCartView.as_view(), name='cart-checkout'),
]
