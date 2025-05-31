import React, { useEffect, useMemo, useState } from "react";
import { startOfWeek, addDays, format, subWeeks, addWeeks } from "date-fns";
import Section from "./Section.jsx";
import Heading from "./Heading.jsx";
import Button from "./Button.jsx";
import Arrow from "../assets/svg/Arrow.jsx";
import AxiosInstance from "./AxiosInstance.jsx";
import { Link } from "react-router-dom";

// Zakres godzin od 6:00 do 21:00 (16 wierszy)
const HOURS = Array.from({ length: 16 }, (_, i) => 6 + i);

const CalendarOfEvents = () => {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const prevWeek = () => setWeekStart((ws) => subWeeks(ws, 1));
  const nextWeek = () => setWeekStart((ws) => addWeeks(ws, 1));

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

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

  return (
    <Section id="calendar" className="px-4 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Nagłówek i nawigacja tygodniem */}
        <Heading
          className="mb-6 text-3xl font-heading text-center"
          title="Kalendarz zajęć"
          text="Kliknij w blok, aby zobaczyć szczegóły i zapisać się na zajęcia"
        />
        <div className="flex justify-between items-center mb-4 rounded-2xl px-4 md:px-15">
          <Button onClick={prevWeek} className="transform -scale-x-100">
            <Arrow className="text-purple-500" />
          </Button>
          <div className="text-lg font-medium">
            {format(days[0], "dd MMM")} - {format(days[6], "dd MMM yyyy")}
          </div>
          <Button onClick={nextWeek}>
            <Arrow className="text-purple-500" />
          </Button>
        </div>

        {/* Główny wrapper z poziomym przewijaniem */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-400 via-purple-800 to-transparent mx-4">
          <div className="rounded-2xl bg-n-8 overflow-x-auto">
            {/*
              Zawartość kalendarza:
              inline-flex flex-col => header i body skrolują razem
            */}
            <div className="inline-flex flex-col min-w-max rounded-xl bg-n-8">
              {/*
                =======================================================
                A) Wiersz 1: Nagłówki dni + pusta komórka nad godziną
                =======================================================
              */}
              <div className="flex">
                {/* 1) Pusta komórka nad godzinami (musi mieć identyczną szerokość jak godziny w body) */}
                <div
                  className="
                    flex-shrink-0
                    w-8 sm:w-12 md:w-16 lg:w-20 xl:w-24 2xl:w-28
                    h-10 sm:h-12 md:h-16 lg:h-20 xl:h-24 2xl:h-28
                    border-r-2 border-b-2
                    bg-n-9
                  "
                ></div>

                {/* 2) Dni tygodnia (7 kolumn) */}
                {days.map((day) => (
                  <div
                    key={day}
                    className="
                      flex-shrink-0
                      w-full
                      md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/4
                      h-10 sm:h-12 md:h-16 lg:h-20 xl:h-24 2xl:h-28
                      border-r-2 border-b-2
                      bg-n-9
                      flex flex-col justify-center items-center
                    "
                  >
                    <div className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg">
                      {format(day, "EEE")}
                    </div>
                    <div className="text-[8px] sm:text-[9px] md:text-xs lg:text-sm xl:text-base text-purple-300">
                      {format(day, "dd.MM")}
                    </div>
                  </div>
                ))}
              </div>

              {/*
                ============================================================
                B) Wiersze ciała: kolumna godzin + 7 kolumn „dzień x godzina”
                ============================================================
              */}
              <div className="flex">
                {/* 1) Kolumna z godzinami */}
                <div className="flex-shrink-0 flex flex-col">
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      className="
                        w-8 sm:w-12 md:w-16 lg:w-20 xl:w-24 2xl:w-28
                        h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 2xl:h-40
                        border-r-2 border-b-2
                        bg-n-9
                        flex items-center justify-end
                        pr-2
                        font-mono
                        text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg
                        whitespace-nowrap
                      "
                    >
                      {`${h}:00`}
                    </div>
                  ))}
                </div>

                {/* 2) Każdy dzień – jako osobna kolumna */}
                {days.map((day) => (
                  <div
                    key={day}
                    className="
                      flex-shrink-0 flex flex-col
                      w-full
                      md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/4
                    "
                  >
                    {HOURS.map((h) => {
                      const dayEvents = eventsFor(day).filter(
                        (e) => parseInt(e.time.split(":"), 10) === h,
                      );
                      return (
                        <div
                          key={`${day}-${h}`}
                          className="
                            w-full
                            h-20 sm:h-24 md:h-28 lg:h-32 xl:h-36 2xl:h-40
                            border-r-2 border-b-2
                            relative
                            cursor-pointer
                            hover:bg-n-7
                            flex items-center justify-center
                            overflow-hidden
                          "
                          onClick={() => console.log("Kliknięto:", day, h)}
                        >
                          {dayEvents.map((ev) => (
                            <div
                              key={ev.id}
                              className="
                                absolute inset-1
                                bg-purple-600
                                text-white
                                text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl
                                rounded-2xl
                                flex justify-center items-center
                                text-center
                                px-1
                              "
                              onClick={(e) => {
                                e.stopPropagation();

                                console.log("Event clicked:", ev);
                              }}
                            >
                              <Link to={`/events/${ev.id}`}>
                                <span className="break-words">{ev.name}</span>
                              </Link>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-4 text-sm text-purple-300">
            Ładowanie...
          </div>
        )}
      </div>
    </Section>
  );
};

export default CalendarOfEvents;
