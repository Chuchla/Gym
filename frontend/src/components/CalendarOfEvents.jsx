import React, { useEffect, useMemo, useState } from "react";
import { startOfWeek, addDays, format, subWeeks, addWeeks } from "date-fns";
import Section from "./Section.jsx";
import Heading from "./Heading.jsx";
import Button from "./Button.jsx";
import Arrow from "../assets/svg/Arrow.jsx";
import AxiosInstance from "./AxiosInstance.jsx";

const HOURS = Array.from({ length: 16 }, (_, i) => 6 + i); // 6:00–21:00

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
        {/* Nagłówek */}
        <Heading
          className="mb-6 text-3xl font-heading text-center"
          title="Kalendarz zajęć"
          text="Kliknij w blok, aby zobaczyć szczegóły i zapisać się na zajęcia"
        />
        <div
          className={
            "flex justify-between items-center mb-4 rounded-2xl px-4 md:px-15"
          }
        >
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
        {/* Gradientowa ramka */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-400 via-purple-800 to-transparent p-2 mx-4">
          <div className="rounded-2xl bg-n-8 overflow-hidden">
            <div className="border-n-8 rounded-xl">
              {/* nagłówki dni */}
              <div className="grid grid-cols-8 grid-rows-[auto_repeat(16, _minmax(1rem,_0.75fr))] border-color-1 text-base text-center font-serif">
                <div className="border-r-2 border-b-2 bg-n-9"></div>
                {days.map((day) => (
                  <div
                    key={day}
                    className="border-r-2 border-b-2 py-3 bg-n-9 font-medium text-center"
                  >
                    <div className="text-lg">{format(day, "EEE")}</div>
                    <div className="text-sm text-purple-300">
                      {format(day, "dd.MM")}
                    </div>
                  </div>
                ))}
              </div>
              {/* siatka godzin x dni */}
              <div className="grid grid-cols-8">
                {HOURS.map((h) => (
                  <React.Fragment key={h}>
                    {/* etykieta godziny */}
                    <div className="border-r-2 border-b-2 px-2 text-sm text-right pr-3 bg-n-9 font-mono">
                      {`${h}:00`}
                    </div>
                    {/* komórki dnia */}
                    {days.map((day) => {
                      const dayEvents = eventsFor(day).filter(
                        (e) => parseInt(e.time.split(":"), 10) === h,
                      );
                      return (
                        <div
                          key={`${day}-${h}`}
                          className="border-r-2 border-b-2 relative hover:bg-n-7 cursor-pointer"
                          onClick={() => console.log("Kliknięto:", day, h)}
                        >
                          {dayEvents.map((ev) => (
                            <div
                              key={ev.id}
                              className="absolute inset-0.5 bg-purple-600 text-white text-xs rounded-2xl flex justify-center items-center text-center px-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Event clicked:", ev);
                              }}
                            >
                              <span className={"justify-center  "}>
                                {ev.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default CalendarOfEvents;
