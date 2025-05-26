import { useState } from "react";
import axios from "axios";
import "../trainer-styles/EventModal.css";

const API_URL = "http://localhost:8000";

const EventModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    place: "",
    capacity: "",
    repeat: false,
    repeat_type: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedData = {
        ...formData,
        capacity: parseInt(formData.capacity, 10),
      };

      if (!parsedData.repeat) {
        delete parsedData.repeat_type;
      }

      await axios.post(`${API_URL}/api/events/`, parsedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Dodano wydarzenie!");
      setFormData({
        name: "",
        description: "",
        date: "",
        time: "",
        place: "",
        capacity: "",
        repeat: false,
        repeat_type: "",
      });
      onClose();
      window.location.reload();
    } catch (err) {
      console.error("Błąd dodawania:", err);
      console.log("Odpowiedź serwera:", err.response?.data);
      alert("Błąd podczas dodawania wydarzenia.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Dodaj wydarzenie</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Nazwa" value={formData.name} onChange={handleChange} required />
          <input name="description" placeholder="Opis" value={formData.description} onChange={handleChange} />
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
          <input name="place" placeholder="Miejsce" value={formData.place} onChange={handleChange} required />
          <input
            type="number"
            name="capacity"
            placeholder="Limit miejsc"
            value={formData.capacity}
            onChange={handleChange}
            required
          />

          <label className="modal-checkbox">
            <input
              type="checkbox"
              name="repeat"
              checked={formData.repeat}
              onChange={handleChange}
            />
            &nbsp; Cykliczne wydarzenie
          </label>

          {formData.repeat && (
            <select
              name="repeat_type"
              value={formData.repeat_type}
              onChange={handleChange}
              required
            >
              <option value="">-- Wybierz częstotliwość --</option>
              <option value="daily">Codziennie</option>
              <option value="weekly">Co tydzień</option>
              <option value="monthly">Co miesiąc</option>
            </select>
          )}

          <div className="modal-buttons">
            <button type="submit">Dodaj</button>
            <button type="button" onClick={onClose}>Anuluj</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
