from django.contrib import admin
from django.contrib.auth.hashers import make_password
from django.template.response import TemplateResponse
from django.utils.html import format_html
from django.urls import reverse

from .models import *


class CustomAdminSite(admin.AdminSite):
    index_template = "admin/custom_index.html"

    def index(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['unapproved_articles'] = Article.objects.filter(is_approved=False).count()
        extra_context['pending_memberships'] = Membership.objects.filter(status="pending_payment").count()
        return super().index(request, extra_context=extra_context)


custom_admin_site = CustomAdminSite(name='custom_admin')


class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'created_at', 'is_approved')
    list_filter = ('is_approved',)
    search_fields = ('title', 'content')
    actions = ['approve_articles']

    @admin.action(description="Zatwierdź wybrane artykuły")
    def approve_articles(self, request, queryset):
        queryset.update(is_approved=True)


class ClientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'role')
    search_fields = ('first_name', 'last_name', 'email')
    list_filter = ('role',)


class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email')

    def save_model(self, request, obj, form, change):
        if 'password' in form.changed_data:
            obj.password = make_password(obj.password)
        super().save_model(request, obj, form, change)


class MembershipAdmin(admin.ModelAdmin):
    list_display = ('client', 'membership_type', 'active_from', 'active_to', 'status', 'purchase_date')
    list_filter = ('membership_type', 'status', 'active_from', 'active_to')
    search_fields = ('client__email', 'client__first_name', 'client__last_name', 'membership_type__name')
    exclude = ('active_to',)


class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'time', 'place', 'trainer', 'capacity', 'is_personal_training')
    list_filter = ('is_personal_training', 'trainer')
    search_fields = ('name', 'trainer__first_name', 'trainer__last_name')


class ReservationAdmin(admin.ModelAdmin):
    list_display = ('client', 'event', 'date')
    list_filter = ('event', 'client')
    search_fields = ('client__first_name', 'client__last_name', 'event__name')


class ActivityAdmin(admin.ModelAdmin):
    list_display = ('client', 'date')
    list_filter = ('date',)


class MembershipTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'duration_days')
    search_fields = ['name']
    list_filter = ['duration_days']

    filter_horizontal = ('features',)


class FeatureAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


class BasketItemInline(admin.TabularInline):
    model = BasketItem
    fields = ('product', 'quantity', 'get_item_price', 'get_total_item_price') # Dodajemy metody do wyświetlania cen
    readonly_fields = ('get_item_price', 'get_total_item_price')
    extra = 0

    def get_item_price(self, obj):
        if obj.product:
            return obj.product.price
        return "N/A"
    get_item_price.short_description = 'Cena jednostkowa'

    def get_total_item_price(self, obj):
        if obj.product and obj.quantity is not None:
            return obj.product.price * obj.quantity
        return "N/A"
    get_total_item_price.short_description = 'Cena całkowita pozycji'


class BasketInline(admin.StackedInline):
    model = Basket
    inlines = [BasketItemInline]
    can_delete = False
    verbose_name_plural = 'Koszyk przypisany do tego zamówienia'


@admin.register(Order, site=custom_admin_site)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_client_email', 'date', 'status', 'price', 'view_items_count')
    list_filter = ('status', 'date', 'client')
    search_fields = ('id', 'client__email', 'client__first_name', 'client__last_name')
    list_editable = ('status',)
    readonly_fields = ('price', 'date', 'client_link')
    date_hierarchy = 'date'

    inlines = [BasketInline]

    fieldsets = (
        (None, {
            'fields': ('client_link', 'status', 'date', 'price')
        }),
    )

    def get_client_email(self, obj):
        if obj.client:
            return obj.client.email
        return "Brak klienta (gość)"
    get_client_email.short_description = 'Email Klienta'
    get_client_email.admin_order_field = 'client__email'

    def client_link(self, obj):
        if obj.client:
            link = reverse("admin:GymUs_client_change", args=[obj.client.id])
            return format_html('<a href="{}">{}</a>', link, obj.client.email)
        return "Brak klienta"
    client_link.short_description = 'Klient'

    def view_items_count(self, obj):
        if hasattr(obj, 'basket') and obj.basket:
            return obj.basket.items.count()
        return 0
    view_items_count.short_description = 'Liczba pozycji'

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.status in ['completed', 'cancelled']:
            return self.readonly_fields + ('status',)
        return self.readonly_fields


custom_admin_site.register(Article, ArticleAdmin)
custom_admin_site.register(Client, ClientAdmin)
custom_admin_site.register(Employee, EmployeeAdmin)
custom_admin_site.register(Product)
custom_admin_site.register(Activities, ActivityAdmin)
custom_admin_site.register(Membership, MembershipAdmin)
custom_admin_site.register(MembershipType, MembershipTypeAdmin)
custom_admin_site.register(Feature, FeatureAdmin)
custom_admin_site.register(Event, EventAdmin)
custom_admin_site.register(Reservation, ReservationAdmin)
