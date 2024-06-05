import React, { useState, useEffect } from 'react';
import webSocketService from '../Services/webSocketService';

const ChatComponent = ({ userId, chatUserId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleMessage = (newMessage) => {
      if (
        (newMessage.sender.uid === userId && newMessage.receiver.uid === chatUserId) ||
        (newMessage.sender.uid === chatUserId && newMessage.receiver.uid === userId)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    webSocketService.connect(handleMessage);

    return () => {
      webSocketService.disconnect();
    };
  }, [userId, chatUserId]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      webSocketService.sendMessage(userId, chatUserId, message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: { uid: userId }, receiver: { uid: chatUserId }, content: message, timestamp: new Date() },
      ]);
      setMessage('');
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender.uid === userId ? 'sent' : 'received'}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatComponent;
