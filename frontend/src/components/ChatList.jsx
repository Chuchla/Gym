import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UserSearchPanel from "./UserSearchPanel";
import styles from "./design/ChatList.module.css"; // ✅ poprawiony import

function ChatList() {
  const [chatUsers, setChatUsers] = useState([]);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/chats/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setChatUsers(res.data))
      .catch((err) => {
        console.error("Błąd pobierania konwersacji:", err);
        setChatUsers([]);
      });
  }, [token]);

  return (
    <div className={styles.chatPage}>
      <div className={styles.chatList}>
        <h1 className={styles.title}>Twoje konwersacje</h1>
        <ul className={styles.userList}>
          {chatUsers.length > 0 ? (
            chatUsers.map((user) => (
              <li key={user.id} className={styles.userItem}>
                <Link to={`/messages/${user.id}`} className={styles.userLink}>
                  {user.first_name} {user.last_name}
                </Link>
              </li>
            ))
          ) : (
            <p className={styles.noUsers}>Brak rozmów.</p>
          )}
        </ul>
      </div>

      <UserSearchPanel />
    </div>
  );
}

export default ChatList;
