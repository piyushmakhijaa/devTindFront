import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Card from "../components/Card";
import { cn } from "../utils/cn";

function MyConnections() {
  const [connections, setConnections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      setConnections(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50/50 to-fuchsia-50">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-600">Loading connections...</p>
        </div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50/50 to-fuchsia-50">
        <div className="text-center animate-fade-in-up space-y-4">
          <div className="text-6xl animate-float">🤝</div>
          <h2 className="text-2xl font-bold text-slate-800">No connections yet</h2>
          <p className="text-slate-600">Start swiping to make connections!</p>
          <button
            onClick={() => navigate("/feed")}
            className={cn(
              "mt-4 px-6 py-3 rounded-full font-medium",
              "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
              "hover:from-blue-700 hover:to-blue-800",
              "shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30",
              "transition-all duration-300"
            )}
          >
            Go to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4 bg-gradient-to-br from-rose-50 via-pink-50/50 to-fuchsia-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3 animate-fade-in-down">
            Your Connections
          </h1>
          <p className="text-slate-600 text-lg animate-fade-in-down opacity-0" style={{ animationDelay: "0.1s" }}>
            {connections.length} {connections.length === 1 ? "connection" : "connections"} and counting
          </p>
        </div>

        {/* Connections Grid */}
        <div className="flex flex-wrap gap-8 justify-center">
          {connections.map((user, index) => (
            <Card key={user._id} u={user} fetchConnections={fetchConnections} index={index} />
          ))}
        </div>

        {/* Connection Stats */}
        <div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-fade-in-up opacity-0"
          style={{ animationDelay: "0.5s" }}
        >
          {[
            { icon: "💬", label: "Total Chats", value: connections.length },
            { icon: "⭐", label: "Active Today", value: Math.floor(connections.length * 0.7) },
            { icon: "🎯", label: "Match Rate", value: "85%" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={cn(
                "bg-white/80 backdrop-blur-xl rounded-2xl p-6 text-center shadow-lg border border-slate-200/50",
                "hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              )}
            >
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {stat.value}
              </div>
              <div className="text-slate-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyConnections;
