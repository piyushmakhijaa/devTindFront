import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
function Login()
{
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
            //console.log(user);

            
            const onLogin = async(e)=>{
              
              e.preventDefault();
try {
    const res = await axios.post(
      "/api/login",
      { emailId: email, password: password },
      { withCredentials: true }
    );
    console.log(res.data);
    dispatch(addUser(res.data));
   // console.log(user);
    navigate("/feed");
  } catch (err) {
    console.log(err);
  }
        }

        
        useEffect(()=>{
    if(user && user._id)
      {
        navigate("/feed");
        return;
      }
        },[user])
        

   return (
  <div className="card card-bordered bg-base-300 w-96 my-5 mx-auto border-black-500">
    <div className="card-body">
      <h2 className="card-title mx-37">Login</h2>
<form onSubmit={onLogin}>
      <fieldset className="fieldset">
        <label className="fieldset-legend" htmlFor="email">Email</label>
        <input
        id="email"
          type="email"
          className="input input-bordered w-full"
          placeholder="Enter Email"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          required
        />
      </fieldset>

      <fieldset className="fieldset">
        <label className="fieldset-legend" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="input input-bordered w-full"
          placeholder="Enter Password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          required
        />
      </fieldset>

      <div className="card-actions justify-end">
        <button className="btn btn-primary w-full"  disabled={!email || !password}  >Login</button>
        
        <p>Don't Have An Account? <a onClick={()=> navigate("/signup")} className="cursor-pointer "  >SignUp</a>  </p>
      </div>
      </form>
    </div>
  </div>
);

}

export default Login;