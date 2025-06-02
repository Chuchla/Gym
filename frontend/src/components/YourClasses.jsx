// YourClasses.jsx
import React, { useEffect, useState } from "react";
import { parseISO, isBefore, isAfter, subHours, format } from "date-fns"; // isAfter nie było używane, usunąłem
import Section from "./Section.jsx";
import Heading from "./Heading.jsx";
import AxiosInstance from "./AxiosInstance.jsx"; // Założenie: AxiosInstance jest poprawnie skonfigurowany

const YourClasses = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [isTrainer, setIsTrainer] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const userResp = await AxiosInstance.get("clients/me/");
        const user = userResp.data;
        const trainerFlag = Boolean(user.is_trainer);
        setIsTrainer(trainerFlag);

        const url = trainerFlag ? "events/own/" : "events/my/";
        const resp = await AxiosInstance.get(url);
        setEvents(resp.data);
      } catch (err) {
        console.error("Błąd podczas pobierania zajęć:", err);
        setError(
          "Nie udało się załadować Twoich zajęć. Spróbuj ponownie później.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return (
      <Section customPaddings className="py-8 sm:py-10 lg:py-12">
        {" "}
        {/* Dopasowany padding sekcji */}
        <Heading title="Twoje zajęcia" text="Ładowanie..." />
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section customPaddings className="py-8 sm:py-10 lg:py-12">
        <Heading title="Twoje zajęcia" text="" />
        <div className="text-center py-10">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      </Section>
    );
  }

  const now = new Date();
  const twentyFourHoursAgo = subHours(now, 24);

  const upcomingOrRecent = events
    .filter((e) => {
      const eventDateTime = parseISO(`${e.date}T${e.time}`);
      // Chcemy zajęcia przyszłe LUB te, które zakończyły się nie dalej niż 24h temu
      // isAfter(eventDateTime, twentyFourHoursAgo) obejmuje oba przypadki
      return isAfter(eventDateTime, twentyFourHoursAgo);
    })
    .sort((a, b) => {
      // Sortowanie: najpierw przyszłe, potem te co były, wg daty
      const dateA = parseISO(`${a.date}T${a.time}`);
      const dateB = parseISO(`${b.date}T${b.time}`);
      if (isBefore(dateA, now) && isAfter(dateB, now)) return 1; // A w przeszłości, B w przyszłości -> B pierwsze
      if (isAfter(dateA, now) && isBefore(dateB, now)) return -1; // A w przyszłości, B w przeszłości -> A pierwsze
      return dateA - dateB; // W obrębie tej samej kategorii (przeszłe/przyszłe) sortuj chronologicznie
    });

  const headingText = isTrainer
    ? "Lista zajęć, które prowadzisz"
    : "Lista zajęć, na które jesteś zapisany/a";

  return (
    <Section customPaddings className="py-8 sm:py-10 lg:py-12 z-10">
      {" "}
      {/* Dodane z-10 jeśli jest pod spodem coś z wyższym z-index */}
      <Heading
        title="Twoje zajęcia"
        text={headingText}
        className="text-2xl sm:text-3xl mb-8 sm:mb-12" // Dopasowanie rozmiaru i marginesu
      />
      {upcomingOrRecent.length === 0 ? (
        <div className="text-center py-10 px-6 rounded-lg bg-n-7 border border-n-6 shadow-md">
          <p className="text-n-3 text-lg">
            {" "}
            {/* Zwiększony tekst */}
            {isTrainer
              ? "Nie masz żadnych prowadzonych zajęć w ciągu ostatnich 24h ani w przyszłości."
              : "Nie masz żadnych zajęć w ciągu ostatnich 24h ani w przyszłości."}
          </p>
        </div>
      ) : (
        <ul className="space-y-6">
          {" "}
          {/* Zwiększony odstęp między elementami */}
          {upcomingOrRecent.map((e) => {
            const eventDateTime = parseISO(`${e.date}T${e.time}`);
            const isPastWithin24h = isBefore(eventDateTime, now);
            const isUpcoming = isAfter(eventDateTime, now);

            // Stylizacja bazująca na tym, czy zajęcia są nadchodzące czy archiwalne
            const cardBgColor = isUpcoming
              ? "bg-n-6 hover:bg-n-5"
              : "bg-n-7 opacity-70 hover:opacity-90";
            const textColor = isUpcoming ? "text-n-1" : "text-n-3";
            const labelColor = isUpcoming ? "text-purple-300" : "text-n-4";
            const valueColor = isUpcoming ? "text-n-1" : "text-n-2";

            return (
              <li
                key={e.id}
                className={`
                  w-full max-w-3xl mx-auto p-5 sm:p-6 rounded-xl border border-n-5 
                  ${cardBgColor} 
                  ${textColor} 
                  shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] mb-4
                `}
              >
                <h4
                  className={`font-bold text-xl sm:text-2xl mb-3 ${isUpcoming ? "text-purple-400" : "text-n-2"}`}
                >
                  {" "}
                  {/* Większa i pogrubiona nazwa zajęć */}
                  {e.name}
                </h4>
                <div className="space-y-2 text-sm sm:text-base">
                  {" "}
                  {/* Lepsze odstępy i skalowalny tekst */}
                  <p>
                    <span className={`font-semibold ${labelColor}`}>Data:</span>{" "}
                    <span className={valueColor}>
                      {format(eventDateTime, "EEEE, dd.MM.yyyy")}
                    </span>{" "}
                    {/* Pełniejszy format daty */}
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
                    <span className={valueColor}>{e.place}</span>
                  </p>
                  {isPastWithin24h && (
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
    </Section>
  );
};

export default YourClasses;
