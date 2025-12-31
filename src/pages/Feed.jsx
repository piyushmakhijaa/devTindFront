import axios from "axios";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
function Feed(){
//const [number,setNumber]  = useState();
const [feedUsers,setFeedUsers] = useState([]);
const navigate = useNavigate();
const dispatch = useDispatch();

async function getFeed() {

    try{
         await axios.get("/api/user/feed",{withCredentials:true})
         .then((feedData)=>{
          console.log(feedData);
          setFeedUsers(feedData.data.users);
         // setNumber(feedData.data.users.length);
         })
    }catch(err){
      console.log(err);
     dispatch(removeUser());
     navigate("/login");

    }
  
    
}
    useEffect(()=>{

           if(feedUsers.length == 0)
            getFeed();



    },[])





    return(
    <>
<div className="flex flex-wrap gap-4 justify-center">
    {feedUsers.map((user,idx)=>{
      return(
      <Card  u={user} key={idx} getFeed={getFeed} />
      )
    })}
    </div>
 </>
    )
}


export default Feed;