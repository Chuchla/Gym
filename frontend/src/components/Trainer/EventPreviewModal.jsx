import React from "react";
import axios from "axios";
import "../trainer-styles/EventModal.css";

const API_URL = "http://localhost:8000";

const EventPreviewModal = ({ event, onClose }) => {
  if (!event) return null;

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    const token = localStorage.getItem("accessToken");

    try {
      await axios.delete(`${API_URL}/api/events/${event.id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Event has been deleted.");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete the event.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Event Preview</h2>

        <div className="event-preview-field">
          <strong>Name:</strong> {event.name}
        </div>
        <div className="event-preview-field">
          <strong>Date:</strong> {event.date}
        </div>
        <div className="event-preview-field">
          <strong>Time:</strong> {event.time}
        </div>
        <div className="event-preview-field">
          <strong>Location:</strong> {event.place}
        </div>
        {event.description && (
          <div className="event-preview-field">
            <strong>Description:</strong> {event.description}
          </div>
        )}
        <div className="event-preview-field">
          <strong>Capacity:</strong> {event.capacity}
        </div>
        <div className="event-preview-field">
          <strong>Remaining spots:</strong> {event.remaining_spots}
        </div>

        <div className="modal-buttons">
          <button onClick={onClose}>Close</button>
          <button onClick={handleDelete} className="delete-btn">
            Delete Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventPreviewModal;
