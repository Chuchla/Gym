import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import { useParams } from 'react-router-dom';
import styles from '../design/Chat.css';

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function Chats() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [senderId, setSenderId] = useState('');
  const [users, setUsers] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    const pusher = new Pusher('134af4bb28d2464c405e', {
      cluster: 'eu',
      encrypted: true,
    });

    const channel = pusher.subscribe('chat');
    channel.bind('message', (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
      scrollToBottom();
    });

    fetchCurrentUser();
    fetchUserDetails(userId);

    return () => {
      channel.unbind();
      pusher.unsubscribe('chat');
    };
  }, [userId]);

  const fetchCurrentUser = () => {
    axios.get('/api/current_user/', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
    .then(response => {
      setSenderId(response.data.id);
      fetchUserDetails(response.data.id);
    })
    .catch(error => {
      console.error('Error fetching current user', error);
    });
  };

  const fetchUserDetails = (userId) => {
    if (!userId) return;

    axios.get(`/api/users/${userId}/`)
      .then(response => {
        setUsers(prevUsers => ({
          ...prevUsers,
          [userId]: response.data.username
        }));
      })
      .catch(error => {
        console.error('Error fetching user details', error);
      });
  };

  const loadMessages = (receiverId) => {
    axios.get(`/api/messages/${receiverId}/`)
      .then(response => {
        setMessages(response.data);
        scrollToBottom();
      })
      .catch(error => {
        console.error("Error fetching messages", error);
      });
  };

  useEffect(() => {
    if (senderId) {
      loadMessages(userId);
    }
  }, [senderId, userId]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
    loadMessages(userId);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    const csrftoken = getCookie('csrftoken');

    axios.post('/api/send/', { text: message, receiver: userId }, {
      headers: {
        'X-CSRFToken': csrftoken
      }
    })
    .then(response => {
      setMessage('');
      loadMessages(userId);
    })
    .catch(error => {
      console.error("Error sending message", error);
    });
  };

  return (
    <div className={styles.chatContainer}>
      <h2 className={styles.chatHeader}>Chat with {users[userId] || `User ID: ${userId}`}</h2>
      <div className={styles.messagesList}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.messageItem} ${msg.sender === senderId ? styles.myMessage : styles.otherMessage}`}
          >
            <div>
              <p className={styles.messageText}>{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className={styles.sendMessageForm}>
        <input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={handleMessageChange}
          required
          className={styles.messageInput}
        />
        <button type="submit" className={styles.sendButton}>Send</button>
      </form>
    </div>
  );
}

export default Chats;