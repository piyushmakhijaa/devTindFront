import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addUser } from "../utils/userSlice";
function Profile(){
    const user1 = useSelector((state=> state.user));
     const dispatch = useDispatch();


    const getUser = async()=>{
      try{
        if(!user1 || Object.keys(user1).length === 0){
       const user =  await axios.get("/api/profile/view",{withCredentials: true});
       dispatch(addUser(user.data));
console.log(user);
        }
      }catch(err){
        console.log(err);
      }
    }
 

    useEffect(()=>{
        if(!user1)
        getUser();
    },[])
   

return(
   <>
   { user1 && <div className="card bg-base-100 w-96 shadow-sm">
  <figure className="px-10 pt-10">
    <img
      src={user1.photoUrl}
      alt="Shoes"
      className="rounded-xl" />
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">{user1.firstName} {user1.lastName}, {user1.age}  {user1.gender}</h2>
    <p>{user1.about}</p>
    {user1.skills.map((e,idx) => (<p key={idx} >{e} </p>))}
    <div className="card-actions">
    </div>
  </div>
</div> }
</>
)

}

export default Profile;