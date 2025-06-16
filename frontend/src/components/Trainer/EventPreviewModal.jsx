import React from "react";
import styles from "../trainer-styles/EventModal.module.css";

const EventPreviewModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2 className={styles.previewTitle}>Event Preview</h2>

        <div className={styles.previewField}>
          <strong>Name:</strong>
          <span className={styles.previewValue}>{event.name}</span>
        </div>
        <div className={styles.previewField}>
          <strong>Date:</strong>
          <span className={styles.previewValue}>{event.date}</span>
        </div>
        <div className={styles.previewField}>
          <strong>Time:</strong>
          <span className={styles.previewValue}>{event.time}</span>
        </div>
        <div className={styles.previewField}>
          <strong>Location:</strong>
          <span className={styles.previewValue}>{event.place}</span>
        </div>
        {event.description && (
          <div className={styles.previewField}>
            <strong>Description:</strong>
            <span className={styles.previewValue}>{event.description}</span>
          </div>
        )}
        <div className={styles.previewField}>
          <strong>Capacity:</strong>
          <span className={styles.previewValue}>{event.capacity}</span>
        </div>
        <div className={styles.previewField}>
          <strong>Remaining spots:</strong>
          <span className={styles.previewValue}>{event.remaining_spots}</span>
        </div>

        <div className={styles.modalButtons}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default EventPreviewModal;
