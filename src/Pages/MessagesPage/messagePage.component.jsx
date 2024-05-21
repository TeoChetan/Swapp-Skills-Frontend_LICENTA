import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineSend } from 'react-icons/ai';
import { fetchUserData } from '../../utils/fetchUserData.component';
import webSocketService from '../../Services/webSocketService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import format from 'date-fns/format';

const MessagesPage = () => {
  const { chatUserId } = useParams();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await fetchUserData(user.uid);
          setCurrentUser(userData);
          setCurrentUserId(userData.uid);
        } catch (error) {
          console.error('Failed to fetch user details:', error);
          setError('Failed to fetch user details');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      const fetchChats = async () => {
        try {
          const response = await fetch(`http://localhost:8080/users/${currentUserId}/chats`);
          if (!response.ok) {
            throw new Error('Failed to fetch chats');
          }
          const chatList = await response.json();
          setChats(chatList);
        } catch (error) {
          console.error('Error fetching chats:', error);
          setError('Error fetching chats');
        }
      };

      fetchChats();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId || !chatUserId) return;

    const fetchMessageHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8080/messages/history/${currentUserId}/${chatUserId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch message history');
        }
        const messageHistory = await response.json();
        setMessages(messageHistory);
      } catch (error) {
        console.error('Error fetching message history:', error);
        setError('Error fetching message history');
      }
    };

    fetchMessageHistory();

    const fetchChatUser = async () => {
      try {
        const response = await fetchUserData(chatUserId);
        setChatUser(response);
      } catch (error) {
        console.error('Failed to fetch chat user details:', error);
        setError('Failed to fetch chat user details');
      }
    };

    fetchChatUser();

    webSocketService.connect((newMessage) => {
      if (
        (newMessage.sender.uid === currentUserId && newMessage.receiver.uid === chatUserId) ||
        (newMessage.sender.uid === chatUserId && newMessage.receiver.uid === currentUserId)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      webSocketService.disconnect();
    };
  }, [currentUserId, chatUserId]);

  const sendMessage = () => {
    if (message.trim() !== '') {
      webSocketService.sendMessage(currentUserId, chatUserId, message);
      setMessage('');
    }
  };

  const handleChatClick = (userId) => {
    navigate(`/messages/${userId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-200 p-4">
        <h2 className="text-xl font-semibold">Chats</h2>
        <ul>
          {chats.map((chat) => (
            <li key={chat.uid} className="cursor-pointer p-2" onClick={() => handleChatClick(chat.uid)}>
              {chat.fullName}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="flex items-center p-4 bg-blue-500 text-white">
          <h2 className="text-xl font-semibold">Chat with {chatUser?.fullName}</h2>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.sender.uid === currentUserId ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-2 rounded ${msg.sender.uid === currentUserId ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                {msg.content}
                <div className="text-xs text-gray-500 mt-1">
                  {format(new Date(msg.timestamp), 'MMM d-h:mm a')}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center p-4 bg-white border-t">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-grow p-2 border rounded"
          />
          <button onClick={sendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded">
            <AiOutlineSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
