import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import Button from '@mui/material/Button'
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

function Navbar() {

    const user1 = useSelector((state=> state.user));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
  
console.log(user1);
   
    const handleLogOut = async()=>{
      try{
        const res = await axios.post(`${BASE_URL}` + `/logout`,{},{withCredentials : true});
        if(res){
          dispatch(removeUser());
          navigate("/login")
        }

        console.log(res);
      }catch(err){
        console.log(err);
      }
    }

  return (
    <div className="navbar bg-base-300 shadow-sm"> 
      <div className="flex-1">
        <Link to="/feed" className="btn btn-ghost text-xl font-roboto">👨‍💻devTinder</Link>
      </div>
        {user1._id && <Link to="/myConnections"><Button>My Connections</Button></Link>}
        {user1._id && <Link to="/myRequests"><Button>My Requests</Button></Link>}
      {user1._id && <span className="mx-2 font-roboto">{user1.firstName}</span>}

      {user1._id && <div className="flex gap-2">
      
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
          <div className="w-10 rounded-full ">
              <img
                alt="user"
                src={user1.photoUrl}
              />
            </div> 
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link to="/profile" className="justify-between">
                Profile
              </Link>
            </li>
            <li>
              <Link to="/premium" className="justify-between">
                Premiums
              </Link>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <button  onClick={handleLogOut} >Logout</button>
            </li>
          </ul>
        </div>
      </div> }
    </div>
  );
}

export default Navbar;
