import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Card";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";

function MyConnections() {
  const [feedUsers, setFeedUsers] = useState([]);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}` + `/user/connections`, {
        withCredentials: true,
      });
      console.log(res.data.data);
      setFeedUsers(res.data.data);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {

    fetchConnections();
   // const socket = createSocketConnection();
   // const user = useSelector((state=> state.user));

   // socket.emit("join",user);

    // return()=>{
    //     socket.disconnect()
    // }

  }, []);

  //console.log(feedUsers);

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {feedUsers.length === 0 ? (
        <p>No connections found</p>
      ) : (
        feedUsers.map((user) => <Card u={user} key={user._id} fetchConnections={fetchConnections} />)
      )}
    </div>
  );
}

export default MyConnections;
