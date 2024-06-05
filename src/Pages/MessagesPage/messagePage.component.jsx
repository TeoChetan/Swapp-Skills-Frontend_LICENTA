import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AiOutlineSend, AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { fetchUserData } from '../../utils/fetchUserData.component';
import webSocketService from '../../Services/webSocketService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import format from 'date-fns/format';

const Card = ({ user, onClick, currentUserId }) => (
  <div className="cursor-pointer p-2 flex items-center border border-gray-200 rounded m-2" onClick={onClick}>
    <img src={user.profilePictureUrl} alt={user.fullName} className="w-10 h-10 rounded-full mr-3" />
    <div>
      <div className="font-semibold">{user.uid === currentUserId ? 'Me' : user.fullName}</div>
    </div>
  </div>
);

const MessagesPage = () => {
  const { chatUserId } = useParams();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChatListVisible, setIsChatListVisible] = useState(false);

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
          let chatList = await response.json();

          const chatListWithLastMessage = await Promise.all(chatList.map(async (chat) => {
            try {
              const lastMessageResponse = await fetch(`http://localhost:8080/messages/last/${currentUserId}/${chat.uid}`);
              if (!lastMessageResponse.ok) {
                throw new Error('Failed to fetch last message');
              }
              const lastMessageText = await lastMessageResponse.text();
              const lastMessage = lastMessageText ? JSON.parse(lastMessageText) : null;
              return {
                ...chat,
                lastMessageTimestamp: lastMessage ? new Date(lastMessage.timestamp) : new Date(0) // Default timestamp if no last message
              };
            } catch (error) {
              console.error('Error fetching last message:', error);
              return {
                ...chat,
                lastMessageTimestamp: new Date(0) // Default timestamp if error occurs
              };
            }
          }));

          chatListWithLastMessage.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);

          setChats(chatListWithLastMessage);
          setFilteredChats(chatListWithLastMessage); // Initialize filtered chats
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
      console.log('New message received:', newMessage);
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
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: { uid: currentUserId }, receiver: { uid: chatUserId }, content: message, timestamp: new Date() },
      ]);
      setMessage('');
    }
  };

  const handleChatClick = (userId) => {
    navigate(`/messages/${userId}`);
    setIsChatListVisible(false);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredChats(chats.filter(chat => chat.fullName.toLowerCase().includes(query)));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <div className="lg:hidden flex justify-between items-center p-4 bg-white border border-black text-white">
        <h2 className="text-xl font-semibold">Messages</h2>
        <button onClick={() => setIsChatListVisible(!isChatListVisible)} className="text-white">
          {isChatListVisible ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
        </button>
      </div>
      <div className={`lg:w-1/4 bg-blue-navy text-white p-4 lg:block ${isChatListVisible ? 'block' : 'hidden'} border-r border-black`}>
        <h2 className="text-xl font-semibold">Chats</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search"
          className="w-full p-2 mb-4 mt-2 border border-gray-500 rounded text-black"
        />
        <ul>
          {filteredChats.map((chat) => (
            <li key={chat.uid}>
              <Card user={chat} currentUserId={currentUserId} onClick={() => handleChatClick(chat.uid)} />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 flex flex-col relative">
        <div className="absolute inset-0 flex-1 flex flex-col bg-chat-background bg-opacity-50">
          <div className="flex items-center p-4 bg-white text-blue-navy shadow-xl border border-black">
            <h2 className="text-xl font-semibold">Chat with {chatUser?.fullName}</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.sender.uid === currentUserId ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-2 rounded ${msg.sender.uid === currentUserId ? 'bg-light-green text-black shadow-2xl' : 'bg-white text-black shadow-2xl'}`}>
                  {msg.content}
                  <div className="text-xs text-gray-500 mt-1">
                    {format(new Date(msg.timestamp), 'MMM d-h:mm a')}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center p-4 bg-white border-t border-black">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-grow p-2 border border-gray-500 rounded"
            />
            <button onClick={sendMessage} className="ml-2 p-2 bg-light-green border border-black text-black rounded">
              <AiOutlineSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
