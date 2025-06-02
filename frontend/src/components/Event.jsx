// Event.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link as RouterLink } from "react-router-dom"; // Dodajemy RouterLink dla przycisku logowania
import { format, parseISO } from "date-fns"; // parseISO do parsowania daty/czasu z backendu

import AxiosInstance from "./AxiosInstance.jsx";
import Section from "./Section.jsx";
import Heading from "./Heading.jsx";
import Button from "./Button.jsx"; // Załóżmy, że Button obsługuje props 'disabled' i 'variant'
import { isLoggedIn } from "../Utils/Auth.jsx"; // Twoja funkcja sprawdzająca zalogowanie

const Event = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reserving, setReserving] = useState(false);
  const [reserveError, setReserveError] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false); // Domyślnie false, sprawdzimy w useEffect
  const [isCurrentUserTrainer, setIsCurrentUserTrainer] = useState(false); // Stan do przechowywania informacji, czy zalogowany użytkownik jest trenerem TEGO wydarzenia

  // Sprawdzenie statusu zalogowania i czy użytkownik jest trenerem przy montowaniu komponentu
  useEffect(() => {
    const checkAuthAndTrainerStatus = async () => {
      const loggedInStatus = isLoggedIn();
      setLoggedIn(loggedInStatus);

      if (loggedInStatus && event && event.trainer) {
        try {
          const userResp = await AxiosInstance.get("clients/me/");
          if (userResp.data && userResp.data.id === event.trainer) {
            setIsCurrentUserTrainer(true); // POPRAWKA
          } else {
            setIsCurrentUserTrainer(false); // POPRAWKA
          }
        } catch (err) {
          console.error("Błąd podczas sprawdzania statusu trenera:", err);
          setIsCurrentUserTrainer(false); // POPRAWKA
        }
      } else {
        setIsCurrentUserTrainer(false); // POPRAWKA
      }
    };

    if (event) {
      checkAuthAndTrainerStatus();
    }
  }, [event]);

  const fetchEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await AxiosInstance.get(`events/${id}/`); // Upewnij się, że jest trailing slash jeśli API tego wymaga
      setEvent(resp.data);
    } catch (err) {
      console.error("Blad podczas ladowania wydarzenia: ", err);
      if (err.response && err.response.status === 404) {
        setError("Nie znaleziono takiego wydarzenia.");
      } else {
        setError(
          "Nie udało się załadować danych wydarzenia. Spróbuj ponownie później.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleReserve = async () => {
    if (!loggedIn) {
      setReserveError("By zapisać się na zajęcia, musisz być zalogowany.");
      return;
    }
    setReserving(true);
    setReserveError(null);
    try {
      const resp = await AxiosInstance.post(`events/${id}/reserve/`);
      // Po udanej rezerwacji, odśwież dane eventu, aby zaktualizować liczbę miejsc i listę uczestników
      fetchEvent();
      // Można też bezpośrednio zaktualizować stan 'event' danymi z resp.data, jeśli API zwraca pełny obiekt
      // setEvent(resp.data);
    } catch (err) {
      console.error("Blad podczas rezerwacji: ", err.response || err);
      if (err.response && err.response.data && err.response.data.detail) {
        setReserveError(err.response.data.detail);
      } else {
        setReserveError("Nie udało się zapisać na zajęcia. Spróbuj ponownie.");
      }
    } finally {
      setReserving(false);
    }
  };

  // Formatowanie daty i czasu przy użyciu date-fns
  const formattedDate = event ? format(parseISO(event.date), "dd.MM.yyyy") : "";
  const formattedTime = event
    ? format(parseISO(`${event.date}T${event.time}`), "HH:mm")
    : "";

  // Renderowanie stanu ładowania
  if (loading) {
    return (
      <Section customPaddings className="py-8 sm:py-10 lg:py-12">
        <div className="container mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color-1 mx-auto mb-4"></div>
          <p className="text-n-2">Ładowanie danych wydarzenia...</p>
        </div>
      </Section>
    );
  }

  // Renderowanie stanu błędu
  if (error) {
    return (
      <Section customPaddings className="py-8 sm:py-10 lg:py-12">
        <div className="container mx-auto text-center">
          <Heading title="Błąd" className="text-red-500 mb-4" />
          <p className="text-n-2">{error}</p>
          <Button href="/" className="mt-6">
            Powrót na stronę główną
          </Button>
        </div>
      </Section>
    );
  }

  // Renderowanie jeśli nie ma wydarzenia (np. po błędzie 404)
  if (!event) {
    return (
      <Section customPaddings className="py-8 sm:py-10 lg:py-12">
        <div className="container mx-auto text-center">
          <Heading title="Nie znaleziono wydarzenia" className="mb-4" />
          <Button href="/calendar" className="mt-6">
            Zobacz kalendarz
          </Button>{" "}
          {/* Zakładając, że masz stronę /calendar */}
        </div>
      </Section>
    );
  }

  const canReserve = event.remaining_spots > 0 && !isCurrentUserTrainer;

  return (
    <Section customPaddings className="py-10 lg:py-16 xl:py-20">
      <div className="container mx-auto max-w-4xl">
        {" "}
        {/* Ograniczenie szerokości dla lepszej czytelności */}
        <Heading
          title={event.name}
          text={`Zajęcia odbędą się o godzinie ${formattedTime} dnia ${formattedDate}`}
          className="text-center mb-10 md:mb-12"
        />
        <div className="bg-n-7 border border-n-6 rounded-xl shadow-xl p-6 sm:p-8 md:p-10 space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-color-1 mb-3">
              Opis zajęć
            </h3>
            <p className="text-n-2 leading-relaxed text-justify">
              {event.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-n-6 pt-6">
            <div>
              <h4 className="text-lg font-semibold text-n-1 mb-2">
                Informacje o miejscach:
              </h4>
              <p className="text-n-3">
                Zajętych miejsc:{" "}
                <span className="font-bold text-color-3">
                  {event.reserved_count}
                </span>{" "}
                / {event.capacity}
              </p>
              <p className="text-n-3">
                Wolnych miejsc:{" "}
                <span className="font-bold text-color-4">
                  {event.remaining_spots}
                </span>
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end justify-center">
              {canReserve ? (
                <Button
                  onClick={handleReserve}
                  disabled={reserving || !loggedIn}
                  className={`
                    w-full md:w-auto px-8 py-3 text-lg
                    ${!loggedIn && "opacity-50 cursor-not-allowed !bg-n-5 !text-n-3 border-n-5"}
                    ${reserving && "opacity-50 cursor-not-allowed"}
                  `}
                >
                  {reserving
                    ? "Rezerwuję..."
                    : !loggedIn
                      ? "Zaloguj się by zarezerwować"
                      : "Zapisz się na zajęcia"}
                </Button>
              ) : isCurrentUserTrainer ? (
                <p className="text-center md:text-right text-color-5 italic">
                  Prowadzisz te zajęcia.
                </p>
              ) : (
                <p className="text-center md:text-right text-color-3 font-semibold text-lg">
                  Brak wolnych miejsc
                </p>
              )}
              {reserveError && (
                <p className="text-red-400 mt-3 text-center md:text-right">
                  {reserveError}
                </p>
              )}
              {!loggedIn &&
                !canReserve &&
                !isCurrentUserTrainer && ( // Dodatkowy komunikat jeśli nie jest zalogowany i nie ma miejsc
                  <p className="text-n-4 mt-2 text-xs text-center md:text-right">
                    Aby zobaczyć możliwość rezerwacji,{" "}
                    <RouterLink
                      to="/login"
                      className="text-color-1 underline hover:text-purple-400"
                    >
                      zaloguj się
                    </RouterLink>
                    .
                  </p>
                )}
            </div>
          </div>
        </div>
        {/* Sekcja dla trenera - lista uczestników */}
        {loggedIn && isCurrentUserTrainer && event.participants && (
          <div className="mt-10 md:mt-12 bg-n-7 border border-n-6 rounded-xl shadow-xl p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-color-1 mb-6 text-center sm:text-left">
              Lista uczestników ({event.participants.length}/{event.capacity}){" "}
              {/* ZMIANA */}
            </h3>
            {event.participants.length > 0 /* ZMIANA */ ? (
              <ul className="space-y-3">
                {event.participants.map(
                  (participant, index /* ZMIANA + zmiana nazwy zmiennej */) => (
                    <li
                      key={participant.id || index}
                      className="flex justify-between items-center p-3 bg-n-6 rounded-md border border-n-5"
                    >
                      <span className="text-n-1">
                        {index + 1}. {participant.first_name}{" "}
                        {participant.last_name}
                      </span>
                      <span className="text-sm text-n-3">
                        {participant.email}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            ) : (
              <p className="text-n-3 text-center">
                Brak zapisanych uczestników.
              </p>
            )}
            {/* Opcjonalne wyświetlanie pustych slotów */}
            {Array.from({
              length: Math.max(0, event.capacity - event.participants.length),
            }).map((_, index /* ZMIANA */) => (
              <div
                key={`empty-${index}`}
                className="p-3 bg-n-8 border border-dashed border-n-5 rounded-md mt-3 text-center text-n-4 italic"
              >
                Wolne miejsce
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
};

export default Event;
