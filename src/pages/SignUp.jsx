import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function SignUp(){

    const navigate = useNavigate();
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const onSignUp = async(e)=>{
      e.preventDefault();
             await axios.post("/api/signup")   
    }

    return(
       <div className="card card-bordered bg-base-300 w-96 my-5 mx-auto border-black-500">
    <div className="card-body">
      <h2 className="card-title mx-37">SignUp</h2>
<form onSubmit={onSignUp}>
       <fieldset className="fieldset">
        <label className="fieldset-legend" htmlFor="name">Name</label>
        <input
        id="name"
          type="text"
          className="input input-bordered w-full"
          placeholder="Enter Your Name"
          value={name}
          onChange={(e)=> setName(e.target.value)}
          required
        />
      </fieldset>



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

        <div className="tooltip w-full">
            <div className="tooltip-content">
              { name && password && email && <div className="animate-bounce text-red-400 -rotate-10 text-2xl font-black">YAYY!!</div>}
                 </div>
        <button className="btn btn-primary w-full"  disabled={!email || !password || !name }     >Register!</button>
        </div>
        
        <p>Already Have An Account? <a onClick={()=> navigate("/login")} className="cursor-pointer "  >LogIn</a>  </p>
        
      </div>
      </form>
    </div>
  </div>
    )
}

export default SignUp;