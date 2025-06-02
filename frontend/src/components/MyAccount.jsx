// MyAccount.jsx
import React, { useEffect, useState, useMemo } from "react";
import Section from "./Section.jsx";
import { my_acc_menu } from "../constans/my_acc_const.jsx"; // Upewnij się, że ścieżka jest poprawna
import { logout, isLoggedIn } from "../Utils/Auth.jsx"; // Dodano isLoggedIn dla warunkowego renderowania
import Heading from "./Heading.jsx";
import AxiosInstance from "./AxiosInstance.jsx";
import {
  format,
  parseISO,
  subYears,
  eachDayOfInterval,
  getDay,
  startOfWeek as dateFnsStartOfWeek,
  addDays as dateFnsAddDays,
  subHours,
  isAfter,
  isBefore,
} from "date-fns";
import { pl } from "date-fns/locale";
import Button from "./Button.jsx"; // Polska lokalizacja dla nazw dni/miesięcy

// Komponent dla pojedynczego kwadracika w kalendarzu aktywności
const ActivitySquare = ({ date, activityLevel = 0 }) => {
  // activityLevel: 0 (brak), 1 (mało), 2 (średnio), 3 (dużo) - do przyszłego użytku
  const colors = [
    "bg-n-6", // Brak aktywności (ciemniejszy szary z Twojej palety)
    "bg-color-5/30", // Mało aktywności (Twój kolor-5 z przezroczystością)
    "bg-color-5/60", // Średnio
    "bg-color-5", // Dużo
  ];
  // Na razie wszystkie będą 'brak aktywności'
  const bgColor = colors[0]; // Zmienisz na colors[activityLevel] gdy będziesz miał dane

  // Tooltip pokazujący datę
  const tooltipText = date ? format(date, "PPP", { locale: pl }) : "";

  return (
    <div
      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm ${bgColor} relative group cursor-pointer`}
      title={tooltipText} // Prosty tooltip przeglądarki
    >
      {/* Można dodać bardziej zaawansowany tooltip Tailwind, jeśli potrzebujesz */}
    </div>
  );
};

// Komponent kalendarza aktywności
const ActivityCalendar = () => {
  const today = new Date();
  const oneYearAgo = subYears(today, 1);
  // Generujemy wszystkie dni w ciągu ostatniego roku
  const daysInYear = eachDayOfInterval({ start: oneYearAgo, end: today });

  // Organizujemy dni w kolumny (tygodnie)
  const weeks = [];
  let currentWeek = [];

  // Aby zacząć od poniedziałku, znajdź pierwszy poniedziałek przed 'oneYearAgo' lub w tym samym tygodniu
  const startDateForGrid = dateFnsStartOfWeek(oneYearAgo, { weekStartsOn: 1 });

  // Wypełnij puste komórki na początku pierwszego tygodnia
  const dayOfWeekForFirstActualDay = getDay(oneYearAgo); // 0=Niedziela, 1=Poniedziałek...
  // Potrzebujemy dni od poniedziałku (index 1 wg date-fns z weekStartsOn: 1)
  // Jeśli getDay(oneYearAgo) to np. 3 (środa), a weekStartsOn: 1 (poniedziałek), to daysBefore = 3-1 = 2 (pon, wt)
  let daysBefore =
    dayOfWeekForFirstActualDay === 0 ? 6 : dayOfWeekForFirstActualDay - 1; // 0 (Mon) to 6 (Sun)
  for (let i = 0; i < daysBefore; i++) {
    currentWeek.push(<ActivitySquare key={`empty-start-${i}`} date={null} />);
  }

  daysInYear.forEach((day, index) => {
    currentWeek.push(<ActivitySquare key={day.toISOString()} date={day} />);
    // getDay(day) zwraca 0 dla niedzieli, 6 dla soboty. Jeśli weekStartsOn: 1 (poniedziałek), to niedziela jest końcem tygodnia
    if (getDay(day) === 0 || index === daysInYear.length - 1) {
      // Niedziela lub ostatni dzień
      // Dopełnij tydzień pustymi kwadratami, jeśli potrzeba (gdy ostatni tydzień nie jest pełny)
      if (index === daysInYear.length - 1 && currentWeek.length < 7) {
        for (let i = currentWeek.length; i < 7; i++) {
          currentWeek.push(
            <ActivitySquare key={`empty-end-${i}`} date={null} />,
          );
        }
      }
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const dayLabels = ["", "Pon", "", "Śro", "", "Pią", ""]; // GitHub-like labels

  // Generowanie etykiet miesięcy - uproszczone
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    if (week.length > 0 && week.find((day) => day.props.date)) {
      // Sprawdź czy tydzień nie jest całkowicie pusty
      const firstDayInWeekWithDate = week.find((day) => day.props.date).props
        .date;
      if (firstDayInWeekWithDate) {
        const month = firstDayInWeekWithDate.getMonth();
        if (month !== lastMonth) {
          // Pokaż etykietę miesiąca co ~4 tygodnie
          if (weekIndex % 4 === 0 || lastMonth === -1) {
            monthLabels.push(
              <div
                key={`month-${month}-${weekIndex}`}
                className="text-xs text-n-4 absolute"
                style={{
                  left: `${weekIndex * (14 + 2)}px` /* szerokość kwadratu + gap */,
                }}
              >
                {format(firstDayInWeekWithDate, "MMM", { locale: pl })}
              </div>,
            );
          }
          lastMonth = month;
        }
      }
    }
  });

  return (
    <div className="flex">
      {/* Etykiety dni tygodnia */}
      <div className="flex flex-col space-y-0.5 mr-1.5 sm:mr-2 pt-5">
        {" "}
        {/* pt-5 aby zrównać z miesiącami */}
        {dayLabels.map((label, i) => (
          <div
            key={`daylabel-${i}`}
            className="text-xs text-n-4 h-3 sm:h-3.5 flex items-center"
          >
            {label}
          </div>
        ))}
      </div>
      {/* Siatka aktywności */}
      <div className="relative">
        <div className="flex space-x-0.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-n-5 scrollbar-track-n-7">
          {" "}
          {/* Dodane przewijanie i stylizacja paska */}
          {/* Etykiety miesięcy nad siatką */}
          <div className="absolute -top-5 h-5 left-0 right-0 flex items-center mb-1">
            {monthLabels}
          </div>
          {weeks.map((week, i) => (
            <div key={`week-${i}`} className="flex flex-col space-y-0.5 pt-5">
              {" "}
              {/* pt-5 aby zrobić miejsce na miesiące */}
              {week}
            </div>
          ))}
        </div>
        <div className="flex justify-end items-center mt-2 text-xs text-n-4">
          Mniej
          <ActivitySquare activityLevel={0} />
          <ActivitySquare activityLevel={1} />
          <ActivitySquare activityLevel={2} />
          <ActivitySquare activityLevel={3} />
          Więcej
        </div>
      </div>
    </div>
  );
};

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState(
    my_acc_menu[0]?.activeTab || "dane",
  ); // Bezpieczniejsza inicjalizacja
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);

  const [memberships, setMemberships] = useState([]);
  const [loadingMemberships, setLoadingMemberships] = useState(false);
  const [errorMemberships, setErrorMemberships] = useState(null);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorOrders, setErrorOrders] = useState(null);

  // Endpointy dla "Moje zajęcia"
  const [myClasses, setMyClasses] = useState([]);
  const [loadingMyClasses, setLoadingMyClasses] = useState(false);
  const [errorMyClasses, setErrorMyClasses] = useState(null);
  const [isTrainerForMyClasses, setIsTrainerForMyClasses] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoggedIn()) {
        // Jeśli nie jest zalogowany, nie pobieraj danych
        setLoadingUser(false);
        setErrorUser("Aby zobaczyć tę stronę, musisz być zalogowany.");
        return;
      }
      setLoadingUser(true);
      try {
        const resp = await AxiosInstance.get("clients/me/");
        setUserData(resp.data);
        setIsTrainerForMyClasses(Boolean(resp.data.is_trainer)); // Ustawiamy od razu czy user jest trenerem
      } catch (err) {
        console.error("Błąd podczas pobierania danych użytkownika:", err);
        setErrorUser("Nie udało się pobrać Twoich danych. Spróbuj ponownie.");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (activeTab !== "my_membership" || !isLoggedIn()) return;
    // ... (reszta logiki fetchMemberships bez zmian) ...
    const fetchMemberships = async () => {
      setLoadingMemberships(true);
      setErrorMemberships(null);
      try {
        // Zakładamy, że API zwróci pustą listę lub 401/403 jeśli nie ma uprawnień
        const resp = await AxiosInstance.get("my-memberships/?status=active");
        setMemberships(resp.data.results || resp.data); // Dostosuj do struktury odpowiedzi API (jeśli jest paginacja)
      } catch (err) {
        console.error("Błąd podczas pobierania karnetów:", err);
        setErrorMemberships("Nie udało się pobrać Twoich karnetów.");
      } finally {
        setLoadingMemberships(false);
      }
    };
    fetchMemberships();
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== "my_orders" || !isLoggedIn()) return;
    // ... (reszta logiki fetchOrders bez zmian) ...
    const fetchOrders = async () => {
      setLoadingOrders(true);
      setErrorOrders(null);
      try {
        const resp = await AxiosInstance.get("orders/");
        setOrders(resp.data.results || resp.data); // Dostosuj do struktury odpowiedzi API
      } catch (err) {
        console.error("Błąd podczas pobierania zamówień:", err);
        setErrorOrders("Nie udało się pobrać Twoich zamówień.");
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [activeTab]);

  // Pobieranie "Moich zajęć"
  useEffect(() => {
    if (activeTab !== "my_classes" || !isLoggedIn()) return;

    const fetchMyClasses = async () => {
      setLoadingMyClasses(true);
      setErrorMyClasses(null);
      try {
        // Endpoint zależy od tego, czy użytkownik jest trenerem (pobrane z /clients/me/)
        const url = isTrainerForMyClasses ? "events/own/" : "events/my/";
        const resp = await AxiosInstance.get(url);

        const now = new Date();
        const twentyFourHoursAgo = subHours(now, 24);
        const filteredClasses = (resp.data.results || resp.data)
          .filter((e) => {
            const eventDateTime = parseISO(`${e.date}T${e.time}`);
            return isAfter(eventDateTime, twentyFourHoursAgo);
          })
          .sort((a, b) => {
            const dateA = parseISO(`${a.date}T${a.time}`);
            const dateB = parseISO(`${b.date}T${b.time}`);
            if (isBefore(dateA, now) && isAfter(dateB, now)) return 1;
            if (isAfter(dateA, now) && isBefore(dateB, now)) return -1;
            return dateA - dateB;
          });
        setMyClasses(filteredClasses);
      } catch (err) {
        console.error("Błąd podczas pobierania moich zajęć:", err);
        setErrorMyClasses("Nie udało się pobrać Twoich zajęć.");
      } finally {
        setLoadingMyClasses(false);
      }
    };
    fetchMyClasses();
  }, [activeTab, isTrainerForMyClasses]); // Dodano isTrainerForMyClasses jako zależność

  // Obsługa ładowania / błędów dla danych użytkownika
  if (loadingUser) {
    return (
      <Section customPaddings className="py-10 lg:py-16 xl:py-20">
        <div className="container text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-color-1 mx-auto mb-4"></div>
          <p className="text-n-2 text-lg">Ładowanie danych konta...</p>
        </div>
      </Section>
    );
  }
  if (errorUser || !userData) {
    // Jeśli błąd LUB nie ma userData (np. nie jest zalogowany)
    return (
      <Section customPaddings className="py-10 lg:py-16 xl:py-20">
        <div className="container text-center">
          <Heading title="Moje Konto" className="mb-6" />
          <p className="text-red-400 text-lg mb-8">
            {errorUser || "Musisz być zalogowany, aby zobaczyć tę stronę."}
          </p>
          <Button href="/login" white>
            Przejdź do logowania
          </Button>
        </div>
      </Section>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dane":
        return (
          <div className="space-y-3">
            <h3 className="h3 text-color-1 mb-6">Twoje dane</h3>{" "}
            {/* Użycie .h3 z configu */}
            {[
              { label: "Imię", value: userData.first_name },
              { label: "Nazwisko", value: userData.last_name },
              { label: "Telefon", value: userData.phone_number || "-" },
              { label: "Email", value: userData.email },
              {
                label: "Z nami od",
                value: format(parseISO(userData.date_joined), "dd MMMM yyyy", {
                  locale: pl,
                }),
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col sm:flex-row sm:items-center pb-2 border-b border-n-6 last:border-b-0"
              >
                <span className="font-semibold text-n-3 w-full sm:w-1/3 md:w-1/4 mb-1 sm:mb-0">
                  {item.label}:
                </span>
                <span className="text-n-1">{item.value}</span>
              </div>
            ))}
            <Button
              onClick={() => alert("Edycja danych - do zaimplementowania")}
              className="mt-8"
              white
            >
              Edytuj dane
            </Button>
          </div>
        );
      case "my_membership":
        if (loadingMemberships)
          return (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-color-1 mx-auto"></div>
              <p className="mt-3 text-n-2">Ładowanie karnetów...</p>
            </div>
          );
        if (errorMemberships)
          return <p className="text-red-400 py-4">{errorMemberships}</p>;
        return (
          <div>
            <h3 className="h3 text-color-1 mb-6">Moje Karnety</h3>
            {memberships.length === 0 ? (
              <p className="text-n-3">Nie masz żadnych aktywnych karnetów.</p>
            ) : (
              <ul className="space-y-6">
                {memberships.map((m) => (
                  <li
                    key={m.id}
                    className="bg-n-6 p-5 rounded-lg border border-n-5 shadow-md"
                  >
                    <h4 className="text-xl font-semibold text-purple-400 mb-2">
                      {m.membership_type_details.name}
                    </h4>
                    <p>
                      <span className="font-medium text-n-3">Status:</span>{" "}
                      <span
                        className={`font-bold ${m.status === "active" ? "text-color-4" : "text-n-2"}`}
                      >
                        {m.status}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-n-3">Aktywny od:</span>{" "}
                      <span className="text-n-2">
                        {format(parseISO(m.active_from), "dd.MM.yyyy")}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium text-n-3">Aktywny do:</span>{" "}
                      <span className="text-n-2">
                        {format(parseISO(m.active_to), "dd.MM.yyyy")}
                      </span>
                    </p>
                    {m.membership_type_details.features &&
                      m.membership_type_details.features.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-n-5">
                          <h5 className="text-sm font-semibold text-n-3 mb-1">
                            Dodatkowe korzyści:
                          </h5>
                          <ul className="list-disc list-inside text-n-2 text-sm space-y-0.5">
                            {m.membership_type_details.features.map((f) => (
                              <li key={f.id}>{f.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case "activity":
        return (
          <div>
            <h3 className="h3 text-color-1 mb-6">Twoja Aktywność</h3>
            <p className="text-n-3 mb-6">
              Wizualizacja Twojej aktywności na siłowni w ciągu ostatniego roku.
            </p>
            <ActivityCalendar />
          </div>
        );
      case "my_orders":
        if (loadingOrders)
          return (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-color-1 mx-auto"></div>
              <p className="mt-3 text-n-2">Ładowanie zamówień...</p>
            </div>
          );
        if (errorOrders)
          return <p className="text-red-400 py-4">{errorOrders}</p>;
        const displayableOrders = orders.filter((o) => o.status !== "cart");
        return (
          <div>
            <h3 className="h3 text-color-1 mb-6">Moje Zamówienia</h3>
            {displayableOrders.length === 0 ? (
              <p className="text-n-3">
                Nie masz jeszcze żadnych zrealizowanych zamówień.
              </p>
            ) : (
              <ul className="space-y-6">
                {displayableOrders.map((order) => {
                  const basket = order.basket || { items: [], grand_total: 0 };
                  const grandTotal = parseFloat(basket.grand_total || 0);
                  return (
                    <li
                      key={order.id}
                      className="bg-n-6 p-5 rounded-lg border border-n-5 shadow-md"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-purple-400">
                            Zamówienie #{order.id}
                          </h4>
                          <p className="text-sm text-n-3">
                            Data: {format(parseISO(order.date), "dd.MM.yyyy")}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${order.status === "completed" ? "bg-color-4 text-n-8" : "bg-color-2 text-n-8"}`}
                        >
                          {order.status.replace("_", " ")}
                        </span>
                      </div>
                      {basket.items && basket.items.length > 0 && (
                        <ul className="mb-3 space-y-1 text-sm">
                          {basket.items.map((item) => (
                            <li
                              key={item.id}
                              className="flex justify-between items-center border-b border-n-5 py-1 last:border-b-0"
                            >
                              <span className="text-n-2">
                                {item.product.name} (x{item.quantity})
                              </span>
                              <span className="text-n-1 font-medium">
                                {parseFloat(
                                  item.total_price || 0,
                                ).toLocaleString("pl-PL", {
                                  style: "currency",
                                  currency: "PLN",
                                })}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="text-right font-bold text-lg text-n-1 mt-2">
                        Łącznie:{" "}
                        {grandTotal.toLocaleString("pl-PL", {
                          style: "currency",
                          currency: "PLN",
                        })}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      case "my_classes":
        if (loadingMyClasses)
          return (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-color-1 mx-auto"></div>
              <p className="mt-3 text-n-2">Ładowanie zajęć...</p>
            </div>
          );
        if (errorMyClasses)
          return <p className="text-red-400 py-4">{errorMyClasses}</p>;
        return (
          <div>
            <h3 className="h3 text-color-1 mb-6">
              {isTrainerForMyClasses
                ? "Zajęcia, które prowadzisz"
                : "Zajęcia, na które jesteś zapisany/a"}
            </h3>
            {myClasses.length === 0 ? (
              <p className="text-n-3">
                Brak nadchodzących lub niedawno zakończonych zajęć.
              </p>
            ) : (
              <ul className="space-y-6">
                {myClasses.map((event) => {
                  const eventDateTime = parseISO(`${event.date}T${event.time}`);
                  const isPast = isBefore(eventDateTime, new Date());
                  const cardBgColor = !isPast
                    ? "bg-n-6 hover:bg-n-5"
                    : "bg-n-7 opacity-70 hover:opacity-90";
                  const textColor = !isPast ? "text-n-1" : "text-n-3";
                  const labelColor = !isPast ? "text-purple-300" : "text-n-4";
                  const valueColor = !isPast ? "text-n-1" : "text-n-2";
                  return (
                    <li
                      key={event.id}
                      className={`w-full p-5 sm:p-6 rounded-xl border border-n-5 ${cardBgColor} ${textColor} shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02]`}
                    >
                      <h4
                        className={`font-bold text-xl sm:text-2xl mb-3 ${!isPast ? "text-purple-400" : "text-n-2"}`}
                      >
                        {event.name}
                      </h4>
                      <div className="space-y-2 text-sm sm:text-base">
                        <p>
                          <span className={`font-semibold ${labelColor}`}>
                            Data:
                          </span>{" "}
                          <span className={valueColor}>
                            {format(eventDateTime, "EEEE, dd.MM.yyyy", {
                              locale: pl,
                            })}
                          </span>
                        </p>
                        <p>
                          <span className={`font-semibold ${labelColor}`}>
                            Godzina:
                          </span>{" "}
                          <span className={valueColor}>
                            {format(eventDateTime, "HH:mm")}
                          </span>
                        </p>
                        <p>
                          <span className={`font-semibold ${labelColor}`}>
                            Miejsce:
                          </span>{" "}
                          <span className={valueColor}>{event.place}</span>
                        </p>
                        {isPast && (
                          <p className={`italic mt-2 ${labelColor}`}>
                            Zajęcia odbyły się.
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Section customPaddings className="py-10 lg:py-16 xl:py-20">
      <div className="container">
        <Heading
          className="mb-10 md:mb-12 text-3xl sm:text-4xl text-center"
          title="Moje konto"
        />
        <div className="mx-auto flex flex-col md:flex-row md:h-[calc(100vh-12rem)] min-h-[32rem] w-full max-w-6xl rounded-2xl border-2 border-n-6 bg-n-7 shadow-xl overflow-hidden">
          {/* ====== LEWY PANEL: Menu ====== */}
          <nav className="flex md:h-full md:w-56 lg:w-64 flex-col border-b-2 md:border-b-0 md:border-r-2 border-n-6 bg-n-8 p-2 md:p-0">
            {" "}
            {/* Zmienione tło na ciemniejsze */}
            {my_acc_menu.map((item) => (
              <button
                key={item.activeTab}
                onClick={() => {
                  if (item.activeTab === "LogOut") {
                    logout(); // Przekierowanie w Auth.js
                  } else {
                    setActiveTab(item.activeTab);
                  }
                }}
                className={`
                  flex items-center w-full px-4 py-3 text-left font-medium transition-colors rounded-md
                  text-sm sm:text-base
                  ${
                    item.title === "Log Out"
                      ? "mt-auto text-color-3 hover:bg-red-500/20" // Czerwony z Twojej palety
                      : activeTab === item.activeTab
                        ? "bg-color-1 text-n-1 shadow-sm" // Fiolet z Twojej palety
                        : "text-n-2 hover:bg-n-6 hover:text-n-1"
                  }
                `}
              >
                {/* Można dodać ikonę item.icon jeśli istnieje w my_acc_menu */}
                {item.title}
              </button>
            ))}
          </nav>

          {/* ====== PRAWY PANEL: Treść ====== */}
          <div className="flex-grow p-6 sm:p-8 md:p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-n-5 scrollbar-track-n-7">
            {renderContent()}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default MyAccount;
