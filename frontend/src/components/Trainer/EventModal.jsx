import { useState, useEffect } from "react";
import axios from "axios";
import "../trainer-styles/EventModal.css";

const API_URL = "http://localhost:8000";

const EventModal = ({ isOpen, onClose }) => {
  const [eventType, setEventType] = useState("single");

  const defaultForm = {
    name: "",
    description: "",
    date: "",
    time: "",
    place: "",
    capacity: "",
    repeat_type: "",
    start_repeat: "",
    end_repeat: "",
    day_of_week: "",
  };

  const [formData, setFormData] = useState(defaultForm);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!isOpen) {
      setEventType("single");
      setFormData(defaultForm);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setEventType("single");
    setFormData(defaultForm);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity, 10),
        is_recurring: eventType === "recurring",
      };

      if (eventType === "recurring") {
        delete payload.date;
      } else {
        delete payload.day_of_week;
        delete payload.repeat_type;
        delete payload.start_repeat;
        delete payload.end_repeat;
      }

      const endpoint = eventType === "recurring"
        ? `${API_URL}/api/events-recurring/`
        : `${API_URL}/api/events/`;

      await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Event added!");
      handleClose();
      window.location.reload();
    } catch (err) {
      console.error("Error adding event:", err);
      alert("Failed to add the event.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Event</h2>

        <div
          className="event-type-toggle"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <button
            type="button"
            className={eventType === "single" ? "selected" : ""}
            onClick={() => setEventType("single")}
          >
            Single
          </button>
          <button
            type="button"
            className={eventType === "recurring" ? "selected" : ""}
            onClick={() => setEventType("recurring")}
          >
            Recurring
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input name="description" value={formData.description} onChange={handleChange} />
          </div>

          {eventType === "single" ? (
            <div className="form-group">
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
              <div className="form-group">
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

              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="start_repeat"
                  value={formData.start_repeat}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
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

          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input name="place" value={formData.place} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Capacity</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-buttons">
            <button type="submit">Add</button>
            <button type="button" onClick={handleClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
