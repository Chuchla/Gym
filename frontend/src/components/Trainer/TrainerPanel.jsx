import { useEffect, useState } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import "../trainer-styles/TrainerClasses.module.css";
import EventModal from "./EventModal";
import PersonalTrainingModal from "./PersonalTrainingModal";
import ArticleModal from "./ArticleModal";
import EventPreviewModal from "./EventPreviewModal";

const API_URL = "http://localhost:8000";

const TrainerClasses = () => {
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_URL}/api/trainer/trainerPanel/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const formatted = res.data.map((ev) => ({
          id: ev.id,
          title: ev.name,
          start: `${ev.date}T${ev.time}`,
          backgroundColor: "#555",
          borderColor: "#444",
          textColor: "#fff",
          extendedProps: ev,
        }));
        setEvents(formatted);
      })
      .catch((err) => {
        console.error("Error fetching events:", err);
      });
  }, [token]);

  const handleSearch = () => {
    const results = events
      .map((ev) => ev.extendedProps)
      .filter((ev) => {
        const matchName = ev.name
          .toLowerCase()
          .includes(searchName.toLowerCase());
        const matchUser = ev.clients?.some((client) =>
          `${client.first_name} ${client.last_name}`
            .toLowerCase()
            .includes(searchUser.toLowerCase()),
        );
        return (
          (searchName ? matchName : true) && (searchUser ? matchUser : true)
        );
      });
    setFilteredList(results);
  };

  return (
    <div className="trainer-classes">
      <div className="calendar-header">
        <h2 className="calendar-title">My Classes</h2>
        <div className="button-group">
          <button
            onClick={() => setShowEventModal(true)}
            className="add-event-btn"
          >
            Add Event
          </button>
          <button
            onClick={() => setShowPersonalModal(true)}
            className="add-event-btn"
          >
            Add Personal Training
          </button>
          <button
            onClick={() => setShowArticleModal(true)}
            className="add-event-btn"
          >
            Add Article
          </button>
        </div>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={(info) => {
          const ev = info.event.extendedProps;
          setSelectedEvent(ev);
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        height="auto"
      />

      {/* Search Panel */}
      <div className="search-panel">
        <h3>Search Events</h3>
        <div className="search-fields">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Search by client..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="search-input"
          />
          <button onClick={handleSearch} className="add-event-btn">
            Search
          </button>
        </div>

        {filteredList.length > 0 && (
          <ul className="search-results-list">
            {filteredList.map((event) => (
              <li
                key={event.id}
                className="search-result-item"
                onClick={() => setSelectedEvent(event)}
                style={{ cursor: "pointer" }}
              >
                <strong>{event.name}</strong> — {event.date} at {event.time}
                {event.clients && event.clients.length > 0 && (
                  <div style={{ fontSize: "14px", marginTop: "4px" }}>
                    Clients:{" "}
                    {event.clients
                      .map((c) => `${c.first_name} ${c.last_name}`)
                      .join(", ")}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <EventModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
      />
      <PersonalTrainingModal
        isOpen={showPersonalModal}
        onClose={() => setShowPersonalModal(false)}
      />
      <ArticleModal
        isOpen={showArticleModal}
        onClose={() => setShowArticleModal(false)}
      />
      <EventPreviewModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};

export default TrainerClasses;
