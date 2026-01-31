import { useState, useRef } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";

function Card({ u, removeFromFeed, fetchRequests, fetchConnections, index = 0 }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDirection, setExitDirection] = useState(null);
  const navigate = useNavigate();

  // 3D Tilt effect on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  const handleAction = async (action, callback) => {
    setExitDirection(action === "interested" || action === "accept" ? "right" : "left");
    setIsExiting(true);
    
    setTimeout(() => {
      callback();
    }, 300);
  };

  const handleInterested = async () => {
    try {
      await axios.post(`${BASE_URL}/request/send/interested/${u._id}`, {}, { withCredentials: true });
      if (removeFromFeed) removeFromFeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleIgnore = () => {
    if (removeFromFeed) removeFromFeed();
  };

  const handleAccept = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/request/review/accepted/${u.reqId}`, {}, { withCredentials: true });
      alert(res.data.message);
      if (fetchRequests) fetchRequests();
    } catch (err) {
      console.log(err);
    }
  };

  const handleReject = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/request/review/rejected/${u.reqId}`, {}, { withCredentials: true });
      alert(res.data.message);
      if (fetchRequests) fetchRequests();
    } catch (err) {
      console.log(err);
    }
  };

  const handleChat = () => {
    navigate(`/chat/${u._id}`);
  };

  return (
    <div
      className={cn(
        "animate-fade-in-up opacity-0",
        isExiting && exitDirection === "left" && "!opacity-0 -translate-x-full rotate-[-15deg] transition-all duration-300",
        isExiting && exitDirection === "right" && "!opacity-0 translate-x-full rotate-[15deg] transition-all duration-300"
      )}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        perspective: "1000px"
      }}
    >
      <div
        ref={cardRef}
        className={cn(
          "w-80 overflow-hidden cursor-pointer transition-all duration-300 ease-out rounded-2xl",
          "bg-white/90 backdrop-blur-sm border border-slate-200/50",
          isHovered && "shadow-xl shadow-blue-500/10"
        )}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovered ? 1.02 : 1})`,
          transition: "transform 0.1s ease-out, box-shadow 0.3s ease",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image container with zoom effect */}
        <div className="relative overflow-hidden aspect-[4/5]">
          <img
            src={u.photoUrl || "/placeholder.svg"}
            alt={`${u.firstName}'s profile`}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500",
              isHovered && "scale-110"
            )}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
          
          {/* Shine effect on hover */}
          <div 
            className={cn(
              "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent",
              "translate-x-[-100%] transition-transform duration-700",
              isHovered && "translate-x-[100%]"
            )}
          />

          {/* User info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold text-white">
              {u.firstName} {u.lastName}
              {u.age && <span className="font-normal text-lg">, {u.age}</span>}
            </h3>
            {u.gender && (
              <p className="text-sm text-slate-300">{u.gender}</p>
            )}
          </div>
        </div>

        {/* Card content */}
        <div className="p-4">
          {u.about && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-4">
              {u.about}
            </p>
          )}

          {/* Action buttons based on mode */}
          <div className="flex justify-center gap-3">
            {/* Feed mode - Like/Pass buttons */}
            {removeFromFeed && (
              <>
                <button
                  onClick={() => handleAction("ignore", handleIgnore)}
                  className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center",
                    "border-2 border-slate-300 bg-white",
                    "transition-all duration-300",
                    "hover:bg-red-500 hover:text-white hover:border-red-500",
                    "hover:scale-110 hover:shadow-lg hover:shadow-red-500/25"
                  )}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button
                  onClick={() => handleAction("interested", handleInterested)}
                  className={cn(
                    "h-14 w-14 rounded-full flex items-center justify-center",
                    "bg-gradient-to-r from-pink-500 to-rose-500 text-white",
                    "transition-all duration-300",
                    "hover:from-pink-600 hover:to-rose-600",
                    "hover:scale-110 hover:shadow-lg hover:shadow-rose-500/40",
                    "animate-pulse-glow"
                  )}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </button>
              </>
            )}

            {/* Requests mode - Accept/Reject buttons */}
            {fetchRequests && (
              <>
                <button
                  onClick={() => handleAction("reject", handleReject)}
                  className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center",
                    "border-2 border-slate-300 bg-white",
                    "transition-all duration-300",
                    "hover:bg-red-500 hover:text-white hover:border-red-500",
                    "hover:scale-110 hover:shadow-lg"
                  )}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button
                  onClick={() => handleAction("accept", handleAccept)}
                  className={cn(
                    "h-14 w-14 rounded-full flex items-center justify-center",
                    "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
                    "transition-all duration-300",
                    "hover:from-green-600 hover:to-emerald-600",
                    "hover:scale-110 hover:shadow-lg hover:shadow-green-500/40"
                  )}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Connections mode - Chat button */}
            {fetchConnections && (
              <button
                onClick={handleChat}
                className={cn(
                  "rounded-full px-6 py-3 flex items-center gap-2",
                  "bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium",
                  "transition-all duration-300",
                  "hover:from-blue-700 hover:to-blue-800",
                  "hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
                )}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Chat
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;