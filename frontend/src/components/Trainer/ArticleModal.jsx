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

  const token = localStorage.getItem("accessToken");

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

      alert("Article has been added!");
      setFormData({ title: "", content: "" });
      onClose();
    } catch (err) {
      console.error("Error adding article:", err);
      alert("Failed to add the article.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Article</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="content"
            placeholder="Content"
            value={formData.content}
            onChange={handleChange}
            className="article-textarea"
            required
          />

          <div className="modal-buttons">
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

export default ArticleModal;
