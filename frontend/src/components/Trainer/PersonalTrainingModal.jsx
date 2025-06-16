import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../trainer-styles/EventModal.module.css";

const API_URL = "http://localhost:8000";

const PersonalTrainingModal = ({ isOpen, onClose }) => {
  const [eventType, setEventType] = useState("single");

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    goals: "",
    start_repeat: "",
    end_repeat: "",
    day_of_week: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!isOpen) return;

    // reset when modal opens
    setEventType("single");
    setFormData({
      name: "",
      date: "",
      time: "",
      goals: "",
      start_repeat: "",
      end_repeat: "",
      day_of_week: "",
    });
    setSelectedClients([]);
    setSearchTerm("");
    setSearchResults([]);
  }, [isOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(() => {
      axios
        .get(`${API_URL}/api/clients/?q=${searchTerm}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setSearchResults(res.data))
        .catch(() => setSearchResults([]));
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectClient = (client) => {
    if (!selectedClients.some((c) => c.id === client.id)) {
      setSelectedClients((prev) => [...prev, client]);
    }
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleRemoveClient = (id) => {
    setSelectedClients((prev) => prev.filter((c) => c.id !== id));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    name: formData.name || "Personal Training",
    description: formData.goals,
    time: formData.time,
    place: "To be determined",
    capacity: selectedClients.length || 1,
    is_personal_training: true,
    client_ids: selectedClients.map((c) => c.id),
  };

  if (eventType === "single") {
    payload.date = formData.date;
  } else {
    payload.day_of_week = formData.day_of_week;
    payload.start_repeat = formData.start_repeat;
    payload.end_repeat = formData.end_repeat;
    payload.is_recurring = true;
  }

  try {
    const endpoint =
      eventType === "recurring"
        ? `${API_URL}/api/events-recurring/`
        : `${API_URL}/api/events/`;

    const response = await axios.post(endpoint, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const eventId = response.data.id;

    // automatyczne zapisy dla klientów
    if (eventType === "single" && eventId && selectedClients.length > 0) {
      for (const client of selectedClients) {
        try {
          await axios.post(
            `${API_URL}/api/events/${eventId}/reserve-for/`,
            { user_id: client.id },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (err) {
          console.warn(
            `Failed to reserve ${client.first_name} ${client.last_name}:`,
            err.response?.data || err.message
          );
        }
      }
    }

    alert("Personal training has been scheduled!");
    onClose();
    window.location.reload();
  } catch (err) {
    console.error("Error adding training:", err);
    alert("Failed to schedule personal training.");
  }
};



  if (!isOpen) return null;

 return (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h2>Schedule Personal Training</h2>

      <div className={styles.eventTypeToggle}>
        <button
          type="button"
          className={eventType === "single" ? styles.selected : ""}
          onClick={() => setEventType("single")}
        >
          One-time
        </button>
        <button
          type="button"
          className={eventType === "recurring" ? styles.selected : ""}
          onClick={() => setEventType("recurring")}
        >
          Recurring
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Training Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {eventType === "single" ? (
          <div className={styles.formGroup}>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        ) : (
          <>
            <div className={styles.formGroup}>
              <label>Day of the Week</label>
              <select
                name="day_of_week"
                value={formData.day_of_week}
                onChange={handleChange}
                required
              >
                <option value="">-- Select a day --</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Start Date</label>
              <input
                type="date"
                name="start_repeat"
                value={formData.start_repeat}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>End Date</label>
              <input
                type="date"
                name="end_repeat"
                value={formData.end_repeat}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        <div className={styles.formGroup}>
          <label>Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Training Goals</label>
          <textarea
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            rows={3}
            className={styles.textarea}
          />
        </div>

        <div className={styles.formGroup} style={{ position: "relative" }}>
          <label>Search for a Client</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter name or email"
          />

          {searchResults.length > 0 && (
            <ul className={styles.searchResults}>
              {searchResults.map((client) => (
                <li
                  key={client.id}
                  onClick={() => handleSelectClient(client)}
                >
                  {client.first_name} {client.last_name} ({client.email})
                </li>
              ))}
            </ul>
          )}
        </div>

        {selectedClients.length > 0 && (
          <div className={styles.selectedClients}>
            <p>Selected Clients:</p>
            {selectedClients.map((c) => (
              <span key={c.id} onClick={() => handleRemoveClient(c.id)}>
                {c.first_name} {c.last_name} ✕
              </span>
            ))}
          </div>
        )}

        <div className={styles.modalButtons}>
          <button type="submit">Add</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);

};

export default PersonalTrainingModal;
