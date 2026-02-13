import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import socket from "../utils/socket";
import { cn } from "../utils/cn";
import VideoCallIcon from '@mui/icons-material/VideoCall';
function Chat() {
  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesContainerRef = useRef(null);
  const { _id } = useSelector((state) => state.user);
  const fromUserId = _id;
  const peerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Socket connection
  useEffect(() => {
    if (!_id || !targetUserId) return;

    const joinChat = () => {
      socket.emit("joinChat", { _id, targetUserId });
    };

    if (socket.connected) {
      joinChat();
    } else {
      socket.on("connect", joinChat);
    }

    const onReceiveMessage = (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    };
    
    socket.on("receive-message", onReceiveMessage);

    return () => {
      socket.off("connect", joinChat);
      socket.off("receive-message", onReceiveMessage);
     // socket.off("joined-user", handleCall);
    };
  }, [_id, targetUserId]);

  // Fetch existing messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const msgs = await axios.get(`${BASE_URL}/user/chat/${targetUserId}`, {
          withCredentials: true,
        });
        if (msgs.data.length !== 0) {
          setMessages(msgs.data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchMessages();
  }, [targetUserId]);

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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user._id) return;

    setIsSending(true);
    const messageData = {
      senderId: user._id,
      receiverId: targetUserId,
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    socket.emit("message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");

    setTimeout(() => setIsSending(false), 300);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden m-4 animate-scale-in opacity-0">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center gap-4 shadow-lg animate-fade-in-down">
        <button
          onClick={() => navigate("/myConnections")}
          className="p-2 rounded-full text-white/80 hover:bg-white/20 transition-all duration-200"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="relative">
          <div className="w-12 h-12 rounded-full ring-2 ring-white ring-offset-2 ring-offset-blue-600 overflow-hidden">
            <img
              src={targetUser?.photoUrl || "/placeholder.svg"}
              alt={targetUser?.firstName || "User"}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-blue-600 animate-pulse" />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">
            {targetUser?.firstName} {targetUser?.lastName}
          </h2>
          <p className="text-sm text-white/70">Online</p>
        </div>

        <button
  type="button"
  onClick={() => navigate("videochat")}
  className="p-2 rounded-full text-white/80 hover:bg-white/20 hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
>
  <VideoCallIcon className="h-6 w-6" />
</button>


        <button className="p-2 rounded-full text-white/80 hover:bg-white/20 transition-colors">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-100/50 to-white"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-fade-in">
            <div className="text-6xl mb-4 animate-float">💬</div>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Say hello to start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.senderId === user._id;
            return (
              <div
                key={index}
                className={cn(
                  "flex items-end gap-2 animate-message-in opacity-0",
                  isOwnMessage ? "justify-end" : "justify-start"
                )}
                style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
              >
                {!isOwnMessage && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={targetUser?.photoUrl || "/placeholder.svg"}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[70%] px-4 py-2 rounded-2xl shadow-sm",
                    isOwnMessage
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md"
                      : "bg-white text-slate-800 rounded-bl-md border border-slate-200"
                  )}
                >
                  <p className="break-words">{msg.text}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      isOwnMessage ? "text-white/70" : "text-slate-500"
                    )}
                  >
                    {formatTime(msg.timestamp || msg.sentAt)}
                  </p>
                </div>

                {isOwnMessage && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={user?.photoUrl || "/placeholder.svg"}
                      alt="You"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-white border-t border-slate-200 animate-fade-in-up"
      >
        <div className="flex gap-3 items-center">
          <button
            type="button"
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-6 py-3 rounded-full bg-slate-100/50 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
          />

          <button
            type="button"
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <button
            type="submit"
            disabled={!newMessage.trim()}
            className={cn(
              "p-3 rounded-full transition-all duration-300",
              "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "hover:shadow-lg hover:shadow-blue-500/30",
              isSending && "scale-90"
            )}
          >
            <svg
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                isSending && "translate-x-1 -translate-y-1"
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
