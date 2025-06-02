import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./design/UserSearchPanel.module.css"; // ✅ poprawiony import

const UserSearchPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(() => {
      axios
        .get(`http://localhost:8000/api/clients/?q=${searchTerm}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setSearchResults(res.data))
        .catch(() => setSearchResults([]));
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm, token]);

  return (
    <div className={styles.userSearchPanel}>
      <h2>Szukaj użytkownika</h2>
      <input
        type="text"
        placeholder="Wpisz imię lub nazwisko..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={`${styles.searchInput} ${styles.darkInput}`}
      />

      {searchTerm.trim() && (
        <ul className={styles.searchDropdown}>
          {searchResults.length > 0 ? (
            searchResults.map((user) => (
              <li key={user.id} className={styles.dropdownItem}>
                <Link
                  to={`/messages/${user.id}`}
                  className={styles.dropdownLink}
                >
                  {user.first_name} {user.last_name}
                </Link>
              </li>
            ))
          ) : (
            <li className={styles.noResults}>Brak wyników.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default UserSearchPanel;
