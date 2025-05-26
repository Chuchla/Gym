import { useEffect, useState } from "react";
import axios from "axios";
import "../trainer-styles/EventModal.css";

const API_URL = "http://localhost:8000";

const PersonalTrainingModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    goals: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

    try {
      await axios.post(`${API_URL}/api/events/`, {
        name: formData.name || "Trening personalny",
        description: formData.goals,
        date: formData.date,
        time: formData.time,
        place: "Do ustalenia",
        capacity: selectedClients.length || 1,
        is_personal_training: true,
        client_ids: selectedClients.map((c) => c.id),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Trening personalny został umówiony!");
      setFormData({ name: "", date: "", time: "", goals: "" });
      setSelectedClients([]);
      onClose();
    } catch (err) {
      console.error("Błąd dodawania:", err);
      alert("Nie udało się umówić treningu.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Umów trening personalny</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Nazwa treningu" value={formData.name} onChange={handleChange} required />
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
          <textarea
            name="goals"
            placeholder="Cele treningu"
            value={formData.goals}
            onChange={handleChange}
            rows={3}
            style={{
              marginTop: "10px",
              width: "100%",
              background: "#333",
              color: "#fff",
              borderRadius: "4px",
              border: "1px solid #555",
              padding: "8px",
            }}
          />

          <input
            type="text"
            placeholder="Szukaj klienta"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginTop: "10px" }}
          />

          {searchResults.length > 0 && (
            <ul className="search-results">
              {searchResults.map((client) => (
                <li key={client.id} onClick={() => handleSelectClient(client)}>
                  {client.first_name} {client.last_name} ({client.email})
                </li>
              ))}
            </ul>
          )}

          {selectedClients.length > 0 && (
            <div className="selected-clients">
              <p>Wybrani klienci:</p>
              {selectedClients.map((c) => (
                <span key={c.id} onClick={() => handleRemoveClient(c.id)}>
                  {c.first_name} {c.last_name} ✕
                </span>
              ))}
            </div>
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

export default PersonalTrainingModal;
