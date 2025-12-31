import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Card";

function MyRequests() {
  const [feedUsers, setFeedUsers] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/user/requests", {
          withCredentials: true,
        });

        const cleanData = res.data.data.map((req) => {
            const reqId = req._id;
          const u = req.fromUserId;
          return {
            fromUserId: u._id,
            firstName: u.firstName,
            lastName: u.lastName,
            age: u.age,
            gender: u.gender,
            photoUrl: u.photoUrl,
            about: u.about,
            reqId : reqId
          };
        });

        // ✅ Spread cleanData directly, no need for nested array
        setFeedUsers(cleanData);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchRequests();
  }, []);

  console.log(feedUsers);

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {feedUsers.length === 0 ? (
        <p>No requests found</p>
      ) : (
        feedUsers.map((user) => <Card u={user} key={user._id} MyRequests={MyRequests} />)
      )}
    </div>
  );
}

export default MyRequests;
