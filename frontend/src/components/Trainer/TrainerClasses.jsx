import { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import "../trainer-styles/TrainerClasses.css";
import EventModal from "./EventModal";
import PersonalTrainingModal from "./PersonalTrainingModal";

const API_URL = "http://localhost:8000";

const TrainerClasses = () => {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_URL}/api/trainer/myclasses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const formatted = res.data.map((ev) => ({
          id: ev.id,
          title: ev.name,
          date: ev.date,
          extendedProps: ev,
        }));
        setEvents(formatted);
      })
      .catch((err) => {
        console.error("Błąd pobierania wydarzeń:", err);
      });
  }, [token]);

  return (
    <div className="trainer-classes">
      <div className="calendar-header">
        <h2 className="calendar-title">Moje zajęcia</h2>
        <div className="button-group">
          <button onClick={() => setShowEventModal(true)} className="add-event-btn">
            Dodaj wydarzenie
          </button>
          <button onClick={() => setShowPersonalModal(true)} className="add-event-btn">
            Umów trening personalny
          </button>
        </div>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={(info) => {
          const ev = info.event.extendedProps;
          alert(`Zajęcia: ${info.event.title}\nGodzina: ${ev.time}\nSala: ${ev.place}`);
        }}
        height="auto"
      />

      <EventModal isOpen={showEventModal} onClose={() => setShowEventModal(false)} />
      <PersonalTrainingModal isOpen={showPersonalModal} onClose={() => setShowPersonalModal(false)} />
    </div>
  );
};

export default TrainerClasses;
