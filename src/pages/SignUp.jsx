import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
function SignUp(){

    const navigate = useNavigate();
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [phone,setPhone] = useState("");
    const [password,setPassword] = useState("");
    const [age,setAge] = useState();
    const [gender,setGender] = useState("");
    const dispatch = useDispatch();
    const onSignUp = async(e)=>{

     const parts = name.split(" ");

      e.preventDefault();
const payload = {
  firstName: parts[0],
  emailId: email,
  password: password,
  phone : phone,
  age : age,
  gender : gender
};

if (parts[1]) {
  payload.lastName = parts[1];
}

await axios.post(`${BASE_URL}` + `/signup`, payload, { withCredentials: true });

try {
    const res = await axios.post(
      `${BASE_URL}` + `/login`,
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
          placeholder="Enter Your Full Name"
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
        <label className="fieldset-legend" htmlFor="phone">Phone</label>
        <input
        id="phone"
          type="tel"
          className="input input-bordered w-full"
          placeholder="Enter Phone Number"
          value={phone}
          onChange={(e)=> setPhone(e.target.value)}
          required
        />
      </fieldset>

          <fieldset className="fieldset">
        <label className="fieldset-legend" htmlFor="age">Age</label>
        <input
        id="age"
          type="number"
          className="input input-bordered w-full"
          placeholder="Enter Your Age"
          value={age<0?0:age}
          onChange={(e)=> setAge(e.target.value)}
          required
        />
      </fieldset>
      
          <fieldset className="fieldset">
        <label className="fieldset-legend" htmlFor="age">Gender</label>
        <input
        id="gender"
          type="text"
          className="input input-bordered w-full"
          placeholder="Enter Your Gender"
          value={gender}
          onChange={(e)=> setGender(e.target.value)}
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