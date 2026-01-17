import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

function Profile() {
  const user1 = useSelector((state) => state.user);
  //console.log(user1);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const getUser = async () => {
    try {
      if (!user1 || Object.keys(user1).length === 0) {
        const user = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        });
        dispatch(addUser(user.data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!user1 || Object.keys(user1).length === 0) {
      getUser();
    }
  }, []);


async  function  handleSubmit(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    let updated;
      const parts = data.name.split(" ");
      if(parts[1]){
        const {name, ...rest} = data;
        updated = {...rest, firstName:parts[0], lastName:parts[1]}
      }
    //console.log(updated);
    try{
  const res = await axios.patch(`${BASE_URL}/user`,updated,{withCredentials:true});
  dispatch(addUser(res.data));
    setIsEditing(false);
    }catch(err)
    {
      console.log(err);
    }
  }


  return (
    <>
      {user1 && (
        <>
          {/* PROFILE CARD */}
          <div className="card bg-base-100 w-96 shadow-xl mx-auto mt-10">
            <figure className="px-10 pt-10">
              <img
                src={user1.photoUrl}
                alt="profile"
                className="rounded-xl h-40 w-40 object-cover"
              />
            </figure>

            <div className="card-body items-center text-center">
              <h2 className="card-title">
                {user1.firstName} {user1.lastName}, {user1.age}{" "}
                {user1.gender}
              </h2>

              <p className="text-sm text-gray-600">{user1.about}</p>

              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {user1.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="badge badge-outline badge-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <button
                className="btn btn-primary mt-4"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>

          {/* MODAL */}
          {isEditing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* BLURRED BACKGROUND */}
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setIsEditing(false)}
              ></div>

              {/* MODAL BOX */}
              <div className="relative bg-slate-50
 rounded-xl shadow-2xl w-[90%] max-w-lg p-6 animate-fadeIn">
                {/* CLOSE BUTTON */}
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
                  onClick={() => setIsEditing(false)}
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                  Edit Profile
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="text-sm font-medium text-slate-700
 block mb-1">
                      Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      defaultValue={`${user1.firstName} ${user1.lastName?user1.lastName:""}`}
                      className="w-full px-4 py-2 rounded-md bg-white border border-slate-300
focus:border-slate-900
placeholder:text-slate-400
text-slate-900
 focus:border-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700
 block mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="emailId"
                      defaultValue={user1.emailId}
                      disabled
                      className="w-full px-4 py-2 rounded-md bg-white border border-slate-300
focus:border-slate-900
placeholder:text-slate-400
text-slate-900
 focus:border-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700
 block mb-1">
                      Skills
                    </label>
                    <input
                      type="text"
                      name="skills"
                      placeholder="Enter Skills seperated by ','"
                      defaultValue={`${user1.skills}`}
                      className="w-full px-4 py-2 rounded-md bg-white border border-slate-300
focus:border-slate-900
placeholder:text-slate-400
text-slate-900
 focus:border-slate-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700
 block mb-1">
                      About
                    </label>
                    <textarea
                      rows="4"
                      name="about"
                      defaultValue={user1.about}
                      className="w-full px-4 py-2 rounded-md bg-white border border-slate-300
focus:border-slate-900
placeholder:text-slate-400
text-slate-900
 focus:border-slate-900 outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-2 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Profile;
