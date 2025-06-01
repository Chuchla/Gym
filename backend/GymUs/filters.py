# GymUs/filters.py
import django_filters
from .models import Membership, MembershipType


class MembershipFilter(django_filters.FilterSet):
    status = django_filters.ChoiceFilter(choices=Membership.STATUS_CHOICES, label='Status karnetu')

    membership_type = django_filters.ModelChoiceFilter(
        queryset=MembershipType.objects.all(),
        field_name='membership_type',
        label='Typ karnetu'
    )

    active_from_after = django_filters.DateFilter(
        field_name='active_from',
        lookup_expr='gte',
        label='Aktywny od (lub później niż)'
    )
    active_from_before = django_filters.DateFilter(
        field_name='active_from',
        lookup_expr='lte',
        label='Aktywny od (lub wcześniej niż)'
    )

    active_to_after = django_filters.DateFilter(
        field_name='active_to',
        lookup_expr='gte',
        label='Ważny do (lub później niż)'
    )

    active_to_before = django_filters.DateFilter(
        field_name='active_to',
        lookup_expr='lte',
        label='Ważny do (lub wcześniej niż)'
    )

    purchase_date = django_filters.DateFilter(
        field_name='purchase_date',
        lookup_expr='date',
        label='Data zakupu (dokładna)'
    )

    purchase_date_after = django_filters.DateFilter(
        field_name='purchase_date',
        lookup_expr='date__gte',
        label='Zakupiony od (lub później niż)'
    )

    purchase_date_before = django_filters.DateFilter(
        field_name='purchase_date',
        lookup_expr='date__lte',
        label='Zakupiony do (lub wcześniej niż)'
    )

    class Meta:
        model = Membership
        fields = {
            'status': ['exact'],
            'membership_type': ['exact'],
            'active_from': ['gte', 'lte', 'exact'],
            'active_to': ['gte', 'lte', 'exact'],
            'purchase_date': ['exact', 'gte', 'lte'],
        }
