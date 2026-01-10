import axios from "axios"
import { BASE_URL } from "../utils/constants";
function Card({u, getFeed, MyRequests}){
   
  const handleInterested = async()=>{
    try{
      console.log(u._id);
     const res = await axios.post(`${BASE_URL}` + `/request/send/interested/${u._id}`,{},{withCredentials:true});
      
     //alert(`${res.data.message}`);
     console.log(`${res.data.message}`);

     if(getFeed)
      getFeed();

    }catch(err){
      console.log(err);
    }
  }


  const handleAccept = async()=>{
    let res;
    try{
      res = await axios.post(`${BASE_URL}` + `/request/review/accepted/${u.reqId}`,{withCredentials:true});
    }catch(err){
      console.log(err);
    }
     alert(res.data.message);
    }

  const handleReject = async()=>{

  }


    return(
                <div className="card bg-base-100 w-96 shadow-sm">
  <figure className="px-10 pt-10">
    <img
      src={u.photoUrl}
      alt="Shoes"
      className="rounded-xl" />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">{u.firstName} {u.lastName}, {u.age}  {u.gender}</h2>
    <p>{u.about}</p>
    {/*u.skills.map((e,idx) => (<p key={idx} >{e} </p>))*/}
    {getFeed && <div className="card-actions">
      <button className="btn btn-secondary" onClick={handleInterested} >INTERESTED</button>
      <button className="btn btn-primary">IGNORE</button>
    </div>}

    { MyRequests &&
      <div className="card-actions">
      <button className="btn btn-secondary" onClick={handleAccept} >ACCEPT</button>
      <button className="btn btn-primary" onClick={handleReject} >REJECT</button>
    </div>

    }
  </div>
</div>
    )
}


export default Card;