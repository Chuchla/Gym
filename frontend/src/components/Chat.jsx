import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import { useParams, useNavigate } from 'react-router-dom';
import "./design/Chat.css";

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

function Chat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [senderId, setSenderId] = useState(null);
  const [users, setUsers] = useState({});
  const messagesEndRef = useRef(null);
  const token = localStorage.getItem('accessToken');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const pusher = new Pusher('97893798d096f5f036a6', {
      cluster: 'eu',
      encrypted: true,
    });

    const channel = pusher.subscribe('chat');
    channel.bind('message', (data) => {
      if (
        (data.sender === parseInt(userId) && data.receiver === senderId) ||
        (data.sender === senderId && data.receiver === parseInt(userId))
      ) {
        loadMessages(userId);
      }
    });

    fetchCurrentUser();
    if (userId) fetchUserDetails(userId);

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [userId, senderId]);

  useEffect(() => {
    if (senderId && userId) {
      loadMessages(userId);
    }
  }, [senderId, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchCurrentUser = () => {
    axios.get('http://localhost:8000/api/current_user/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setSenderId(res.data.id))
      .catch(err => console.error('Error fetching current user', err));
  };

  const fetchUserDetails = (id) => {
    if (!id) return;
    axios.get(`http://localhost:8000/api/users/${id}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setUsers(prev => ({ ...prev, [id]: res.data.username }));
      })
      .catch(err => console.error('Error fetching user details', err));
  };

  const loadMessages = (receiverId) => {
    axios.get(`http://localhost:8000/api/messages/${receiverId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setMessages(res.data))
      .catch(err => console.error("Error fetching messages", err));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    const csrftoken = getCookie('csrftoken');

    axios.post('http://localhost:8000/api/send/', {
      text: message,
      receiver: parseInt(userId),
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-CSRFToken': csrftoken
      }
    }).catch(err => console.error("Error sending message", err));

    setMessage('');
  };

  return (
    <div className="chatContainer">
      <div className="chatHeaderWrapper">
        <h2 className="chatHeader">Chat with {users[userId] || `User ${userId}`}</h2>
        <button onClick={() => navigate('/messages')} className="backButton">
          ← Back to chat list
        </button>
      </div>

      <div className="messagesList">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`messageItem ${msg.sender === senderId ? 'myMessage' : 'otherMessage'}`}
          >
            <p className="messageText">{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="sendMessageForm">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="messageInput"
        />
        <button type="submit" className="sendButton">Send</button>
      </form>
    </div>
  );
}

export default Chat;
