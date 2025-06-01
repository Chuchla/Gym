from django.core.management.base import BaseCommand
from django.utils import timezone
from GymUs.models import Membership
import datetime


class Command(BaseCommand):
    help = 'Updates statuses of memberships that have expired.'

    def handle(self, *args, **options):
        today = timezone.now().date()
        self.stdout.write(f"[{today}] Rozpoczynanie aktualizacji statusów karnetów...")

        # Znajdź karnety, które są 'aktywne', ale ich data 'active_to' już minęła
        # Używamy lt (less than - mniejszy niż) dla daty, ponieważ karnet jest ważny do końca dnia 'active_to'
        # Jeśli karnet jest ważny DO 01.06, to 02.06 powinien być już wygasły.
        # Więc sprawdzamy, czy active_to < today
        expired_memberships = Membership.objects.filter(
            status='active',
            active_to__lt=today  # active_to jest wcześniejsza niż dzisiejsza data
        )

        count_updated = 0
        for membership in expired_memberships:
            old_status = membership.status
            membership.status = 'expired'
            membership.save(update_fields=['status'])  # Zapisz tylko zmienione pole status
            count_updated += 1
            self.stdout.write(self.style.SUCCESS(
                f"Zaktualizowano karnet ID: {membership.id} (Klient: {membership.client.email}, Typ: {membership.membership_type.name}) "
                f"ze statusu '{old_status}' na 'expired'. Był ważny do: {membership.active_to}."
            ))

        if count_updated == 0:
            self.stdout.write(self.style.NOTICE("Nie znaleziono aktywnych karnetów do wygaszenia."))
        else:
            self.stdout.write(self.style.SUCCESS(f"Pomyślnie zaktualizowano {count_updated} karnetów na 'expired'."))

        self.stdout.write(f"[{timezone.now().date()}] Zakończono aktualizację statusów karnetów.")
