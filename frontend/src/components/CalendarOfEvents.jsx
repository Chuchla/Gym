import React, { useEffect, useMemo, useState } from "react";
import { startOfWeek, addDays, format, subWeeks, addWeeks } from "date-fns";
import Section from "./Section.jsx";
import Heading from "./Heading.jsx";
import Button from "./Button.jsx";
import Arrow from "../assets/svg/Arrow.jsx";
import AxiosInstance from "./AxiosInstance.jsx";
import { Link } from "react-router-dom";
// import { BottomLine } from "./design/Hero.jsx"; // Jeśli nieużywane, można usunąć

// Zakres godzin od 6:00 do 21:00 (16 wierszy)
const HOURS = Array.from({ length: 16 }, (_, i) => 6 + i);

const CalendarOfEvents = () => {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myEvents, setMyEvents] = useState([]); // Zostawiam, jeśli planujesz użyć

  const prevWeek = () => setWeekStart((ws) => subWeeks(ws, 1));
  const nextWeek = () => setWeekStart((ws) => addWeeks(ws, 1));

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  // Efekt do pobierania "moich wydarzeń" - bez zmian
  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const resp = await AxiosInstance.get("events/my/");
        setMyEvents(resp.data);
      } catch (err) {
        console.error("Blad podczas ladowania moich wydarzeń:", err);
      }
    };
    fetchMyEvents();
  }, []);

  // Efekt do pobierania wszystkich wydarzeń dla bieżącego tygodnia - bez zmian
  useEffect(() => {
    setLoading(true);
    const fetchEvents = async () => {
      try {
        const start = format(weekStart, "yyyy-MM-dd");
        const end = format(addDays(weekStart, 6), "yyyy-MM-dd");
        const resp = await AxiosInstance.get(
          `events/?date__gte=${start}&date__lte=${end}`,
        );
        setEvents(resp.data);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [weekStart]);

  function eventsFor(day) {
    return events.filter((e) => e.date === format(day, "yyyy-MM-dd"));
  }

  // Przykładowe minimalne szerokości dla kolumn dni - dostosuj według potrzeb
  const dayColumnMinWidth = "min-w-[180px] sm:min-w-[200px] lg:min-w-[220px]";
  // Szerokości dla kolumny godzin - dostosuj, ale muszą być spójne
  const timeColumnWidth = "w-12 sm:w-14 md:w-16 lg:w-20";
  // Wysokości komórek - dostosuj, ale muszą być spójne
  const cellHeightHeader = "h-10 sm:h-12 md:h-14";
  const cellHeightBody = "h-10 sm:h-12 md:h-14 lg:h-16"; // Można zwiększyć wysokość komórek ciała

  // Skalowalne rozmiary czcionek
  const hourTextSize = "text-xs sm:text-sm md:text-base";
  const dayHeaderTextDay = "text-sm sm:text-base md:text-lg";
  const dayHeaderTextDate = "text-xs sm:text-sm md:text-base";
  const eventTextSize = "text-[10px] sm:text-xs md:text-sm";

  return (
    <Section id="calendar" crosses customPaddings>
      <Heading
        className="pt-5 mb-6 text-2xl sm:text-3xl font-heading text-center" // Skalowalny tekst nagłówka sekcji
        title="Kalendarz zajęć"
        text="Kliknij w blok, aby zobaczyć szczegóły i zapisać się na zajęcia"
      />
      <div className=" max-w-7xl mx-auto container relative px-6 md:px-10 lg:px-12 xl:px-16">
        {" "}
        {/* Zwiększone max-w i padding */}
        <div className="flex justify-between items-center mb-4 rounded-2xl px-4">
          {" "}
          {/* Zwiększony padding */}
          <Button
            onClick={prevWeek}
            className="transform -scale-x-100 p-2 sm:p-3"
          >
            {" "}
            {/* Większy przycisk */}
            <Arrow className="text-purple-500 w-5 h-5 sm:w-6 sm:h-6" />{" "}
            {/* Większa strzałka */}
          </Button>
          <div className="text-sm sm:text-base lg:text-lg font-medium">
            {" "}
            {/* Skalowalny tekst zakresu dat */}
            {format(days[0], "dd MMM")} - {format(days[6], "dd MMM yyyy")}
          </div>
          <Button onClick={nextWeek} className="p-2 sm:p-3">
            {" "}
            {/* Większy przycisk */}
            <Arrow className="text-purple-500 w-5 h-5 sm:w-6 sm:h-6" />{" "}
            {/* Większa strzałka */}
          </Button>
        </div>
        {/* Główny wrapper z poziomym przewijaniem */}
        <div className="rounded-2xl border-2 border-n-6 overflow-auto relative shadow-lg">
          {" "}
          {/* Dodany cień i kolor ramki */}
          <div className="flex flex-col bg-n-8">
            {" "}
            {/* Kontener dla wierszy, bez min-w-max */}
            {/* A) Wiersz 1: Nagłówki dni + pusta komórka nad godziną */}
            <div className="flex min-w-max">
              {" "}
              {/* Wiersz nagłówka, sam dba o swoją szerokość */}
              {/* 1) Pusta komórka nad godzinami */}
              <div
                className={`
                  sticky left-0 z-20 
                  flex-shrink-0
                  ${timeColumnWidth}
                  ${cellHeightHeader}
                  border-r-2 border-b-2 border-n-6
                  bg-n-7 
                `}
              ></div>
              {/* 2) Dni tygodnia (7 kolumn) */}
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className={`
                    flex-shrink-0
                    ${dayColumnMinWidth}
                    ${cellHeightHeader}
                    border-r-2 border-b-2 border-n-6 
                    bg-n-7 
                    flex flex-col sm:flex-row justify-center items-center p-1 sm:p-2 
                  `}
                >
                  <div
                    className={`${dayHeaderTextDay} font-semibold mr-0 sm:mr-1`}
                  >
                    {" "}
                    {/* Skalowalny tekst dnia tygodnia */}
                    {format(day, "EEE")}
                  </div>
                  <div className={`${dayHeaderTextDate} text-purple-300`}>
                    {" "}
                    {/* Skalowalny tekst daty */}
                    {format(day, "dd.MM")}
                  </div>
                </div>
              ))}
            </div>
            {/* B) Wiersze ciała: kolumna godzin + 7 kolumn „dzień x godzina” */}
            <div className="flex min-w-max">
              {" "}
              {/* Wiersz ciała, sam dba o swoją szerokość */}
              {/* 1) Kolumna z godzinami */}
              <div
                className={`
                  sticky left-0 z-10 
                  flex-shrink-0 flex flex-col text-left
                  bg-n-8 
                `}
              >
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className={`
                      ${timeColumnWidth}
                      ${cellHeightBody}
                      border-r-2 border-b-2 border-n-6
                      bg-n-7 
                      flex items-center justify-center 
                      font-mono whitespace-nowrap 
                      ${hourTextSize} 
                      pr-1 sm:pr-2 
                    `}
                  >
                    {`${h}:00`}
                  </div>
                ))}
              </div>
              {/* 2) Każdy dzień – jako osobna kolumna */}
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className={`
                    flex-shrink-0 flex flex-col
                    ${dayColumnMinWidth}
                  `}
                >
                  {HOURS.map((h) => {
                    const dayEvents = eventsFor(day).filter(
                      (e) => parseInt(e.time.split(":")[0], 10) === h,
                    );
                    return (
                      <div
                        key={`${day.toISOString()}-${h}`}
                        className={`
                          w-full
                          ${cellHeightBody}
                          border-r-2 border-b-2 border-n-6
                          relative cursor-pointer bg-n-3 hover:bg-n-7/50 
                          flex items-center justify-start 
                          overflow-hidden p-0.5 
                        `}
                        onClick={() =>
                          console.log("Kliknięto pustą komórkę:", day, h)
                        } // Akcja dla pustej komórki
                      >
                        {dayEvents.map((ev) => (
                          <Link
                            to={`/events/${ev.id}`}
                            key={ev.id}
                            className="block w-full h-full"
                          >
                            <div
                              className={`
                                absolute inset-0.5 
                                bg-purple-600 hover:bg-purple-500 
                                text-white 
                                rounded-md sm:rounded-lg 
                                flex justify-center items-center 
                                text-center 
                                p-1 
                                ${eventTextSize}
                                leading-tight sm:leading-normal 
                              `}
                              onClick={(e) => {
                                e.stopPropagation(); // Zapobiega kliknięciu na komórkę pod spodem
                                console.log("Event clicked:", ev);
                              }}
                            >
                              <span className="break-words line-clamp-2 sm:line-clamp-3">
                                {ev.name}
                              </span>{" "}
                              {/* Ograniczenie liczby linii */}
                            </div>
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        {loading && (
          <div className="text-center py-4 text-sm text-purple-300">
            Ładowanie...
          </div>
        )}
      </div>
      {/* <BottomLine /> */} {/* Jeśli używane, odkomentuj */}
    </Section>
  );
};

export default CalendarOfEvents;
