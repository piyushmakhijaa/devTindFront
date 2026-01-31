import axios from "axios";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { cn } from "../utils/cn";

function Feed() {
  const [feedUsers, setFeedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function getFeed() {
    setIsLoading(true);
    try {
      const feedData = await axios.get(`${BASE_URL}/user/feed`, {
        withCredentials: true,
      });
      setFeedUsers(feedData.data.users || []);
    } catch (err) {
      console.log(err);
      dispatch(removeUser());
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }

  // Optimistically remove user from feed without full refresh
  const removeUserFromFeed = (userId) => {
    setFeedUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
  };

  useEffect(() => {
    if (feedUsers.length === 0) {
      getFeed();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50/50 to-fuchsia-50">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          {/* Animated Loading */}
          <div className="text-6xl animate-float">👨‍💻</div>
          
          {/* Spinner */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          
          <p className="text-slate-600 font-medium text-lg animate-pulse">
            Finding your perfect match...
          </p>
        </div>
      </div>
    );
  }

  if (feedUsers.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50/50 to-fuchsia-50">
        <div className="text-center animate-fade-in-up space-y-4">
          <div className="text-6xl animate-float">💔</div>
          <h2 className="text-2xl font-bold text-slate-800">No more profiles</h2>
          <p className="text-slate-600">Check back later for new matches!</p>
          <button
            onClick={getFeed}
            className={cn(
              "mt-4 px-6 py-3 rounded-full font-medium",
              "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
              "hover:from-blue-700 hover:to-blue-800",
              "shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30",
              "transition-all duration-300 flex items-center gap-2 mx-auto"
            )}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4 bg-gradient-to-br from-rose-50 via-pink-50/50 to-fuchsia-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Discover Your Match
          </h1>
          <p className="text-slate-600 text-lg">
            Swipe right to connect, left to pass
          </p>
        </div>

        {/* Cards Grid */}
        <div className="flex flex-wrap gap-8 justify-center">
          {feedUsers.map((user, idx) => (
            <Card key={user._id || idx} u={user} removeFromFeed={() => removeUserFromFeed(user._id)} index={idx} />
          ))}
        </div>

        {/* Floating Action Hint */}
        <div 
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg border border-slate-200/50 animate-fade-in-up opacity-0"
          style={{ animationDelay: "1s" }}
        >
          <div className="flex items-center gap-4 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-white text-xs">✕</span>
              </div>
              <span>Pass</span>
            </div>
            <div className="w-px h-4 bg-slate-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                <span className="text-white text-xs">❤</span>
              </div>
              <span>Like</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;