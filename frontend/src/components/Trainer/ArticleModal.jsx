import { useState } from "react";
import axios from "axios";
import "../trainer-styles/EventModal.css";
import "../trainer-styles/ArticleModal.css";

const API_URL = "http://localhost:8000";

const ArticleModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/api/articles/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Artykuł został dodany!");
      setFormData({ title: "", content: "" });
      onClose();
    } catch (err) {
      console.error("Błąd dodawania artykułu:", err);
      alert("Nie udało się dodać artykułu.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Dodaj artykuł</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Tytuł"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="content"
            placeholder="Treść"
            value={formData.content}
            onChange={handleChange}
            className="article-textarea"
            required
          />

          <div className="modal-buttons">
            <button type="submit">Dodaj</button>
            <button type="button" onClick={onClose}>
              Anuluj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleModal;
