import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import socket from "../utils/socket";

function Chat() {
  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const {_id} = useSelector((state) => state.user);

 

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


useEffect(() => {
  const joinChat = () => {
    socket.emit("joinChat", { _id, targetUserId });
  };

  if (socket.connected) {
    joinChat();
  } else {
    socket.on("connect", joinChat);
  }

  const onReceiveMessage = (messageData) => {
    //console.log(messageData);
    setMessages((prev) => [...prev, messageData]);
  };

  socket.on("receive-message", onReceiveMessage);

  return () => {
    socket.off("connect", joinChat);
    socket.off("receive-message", onReceiveMessage);
  };
}, [_id, targetUserId]);


useEffect(()=>{
  const fetchMessages = async()=>{

    try{
     
      const msgs = await axios.get(`${BASE_URL}/user/chat/${targetUserId}`,{withCredentials : true});
//console.log(msgs);
      if(msgs.data.length!=0)
      {
        setMessages((prev) => [...prev, ...msgs.data]);
      }
    }catch(err){
      console.log(err);
    }
  }
  fetchMessages();
},[targetUserId])


  // Fetch target user info
  useEffect(() => {
    const fetchTargetUser = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/connections`, {
          withCredentials: true,
        });
        const foundUser = res.data.data.find((u) => u._id === targetUserId);
        if (foundUser) {
          setTargetUser(foundUser);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTargetUser();
  }, [targetUserId]);

  // TODO: Add your socket connection logic here

  // Handle sending message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: user._id,
      receiverId: targetUserId,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    // TODO: Emit message via socket here
    socket.emit("message", messageData);

    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto bg-base-100 shadow-2xl rounded-2xl overflow-hidden m-4">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4 flex items-center gap-4 shadow-lg">
        <button
          onClick={() => navigate("/myConnections")}
          className="btn btn-ghost btn-circle text-white hover:bg-white/20"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        
        <div className="avatar">
          <div className="w-12 h-12 rounded-full ring ring-white ring-offset-base-100 ring-offset-2">
            <img
              src={targetUser?.photoUrl || "https://via.placeholder.com/100"}
              alt={targetUser?.firstName || "User"}
            />
          </div>
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">
            {targetUser?.firstName} {targetUser?.lastName}
          </h2>
        </div>
        
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle text-white hover:bg-white/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-2"
          >
            <li>
              <a>View Profile</a>
            </li>
            <li>
              <a className="text-error">Block User</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-base-200/50 to-base-100">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-base-content/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-20 w-20 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-lg">No messages yet</p>
            <p className="text-sm">Say hello to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.senderId === user._id;
            return (
              <div
                key={index}
                className={`chat ${isOwnMessage ? "chat-end" : "chat-start"}`}
              >
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full shadow-md">
                    <img
                      src={
                        isOwnMessage
                          ? user.photoUrl
                          : targetUser?.photoUrl || "https://via.placeholder.com/100"
                      }
                      alt="avatar"
                    />
                  </div>
                </div>
                <div
                  className={`chat-bubble shadow-md ${
                    isOwnMessage
                      ? "bg-gradient-to-r from-primary to-primary/80 text-primary-content"
                      : "bg-base-200 text-base-content"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="chat-footer opacity-50 text-xs mt-1">
                  {formatTime(msg.timestamp || msg.sentAt)}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-base-100 border-t border-base-300"
      >
        <div className="flex gap-3 items-center">
          <button
            type="button"
            className="btn btn-ghost btn-circle hover:bg-primary/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input input-bordered flex-1 focus:input-primary bg-base-200/50 rounded-full px-6"
          />
          
          <button
            type="button"
            className="btn btn-ghost btn-circle hover:bg-primary/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="btn btn-primary btn-circle shadow-lg hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
