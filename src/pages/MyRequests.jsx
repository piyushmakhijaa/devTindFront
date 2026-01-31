import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Card from "../components/Card";
import { cn } from "../utils/cn";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/requests`, {
        withCredentials: true,
      });

      const cleanData = res.data.data.map((req) => {
        const u = req.fromUserId;
        return {
          _id: u._id,
          firstName: u.firstName,
          lastName: u.lastName,
          age: u.age,
          gender: u.gender,
          photoUrl: u.photoUrl,
          about: u.about,
          reqId: req._id,
        };
      });

      setRequests(cleanData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50/50 to-fuchsia-50">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-600">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50/50 to-fuchsia-50">
        <div className="text-center animate-fade-in-up space-y-4">
          <div className="text-6xl animate-float">📭</div>
          <h2 className="text-2xl font-bold text-slate-800">No pending requests</h2>
          <p className="text-slate-600">New requests will appear here!</p>
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
            Connection Requests
          </h1>
          <p className="text-slate-600 text-lg animate-fade-in-down opacity-0" style={{ animationDelay: "0.1s" }}>
            {requests.length} pending {requests.length === 1 ? "request" : "requests"}
          </p>
        </div>

        {/* Requests Grid */}
        <div className="flex flex-wrap gap-8 justify-center">
          {requests.map((user, index) => (
            <Card key={user.reqId} u={user} fetchRequests={fetchRequests} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyRequests;
