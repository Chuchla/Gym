import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../design/ChatList.css";

function sChatList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("/api/chats/")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users", error);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Chat with users</h1>
      <ul className={styles.userList}>
        {users.map((user) => (
          <li key={user.id} className={styles.userItem}>
            <Link to={`/chats/${user.id}`} className={styles.userLink}>
              {user.username}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;
