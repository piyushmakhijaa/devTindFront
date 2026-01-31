import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { cn } from "../utils/cn";

function Profile() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getUser = async () => {
    try {
      if (!user || Object.keys(user).length === 0) {
        setIsLoading(true);
        const res = await axios.get(`${BASE_URL}/profile/view`, {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      getUser();
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    let updated;
    const parts = data.name.split(" ");
    
    if (parts[1]) {
      const { name, ...rest } = data;
      updated = { ...rest, firstName: parts[0], lastName: parts[1] };
    } else {
      const { name, ...rest } = data;
      updated = { ...rest, firstName: parts[0] };
    }

    try {
      const res = await axios.patch(`${BASE_URL}/user`, updated, { withCredentials: true });
      dispatch(addUser(res.data));
      setIsEditing(false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4 flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50/50 to-fuchsia-50">
      {/* Profile Card */}
      <div className="w-full max-w-md glass-card overflow-hidden animate-scale-in opacity-0">
        {/* Profile Header with Gradient */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-500/30 via-purple-500/20 to-blue-500/30" />
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-xl animate-fade-in">
              <img
                src={user.photoUrl || "/placeholder.svg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-20 pb-8 px-6 text-center">
          <h2 
            className="text-2xl font-bold text-slate-900 animate-fade-in-up opacity-0" 
            style={{ animationDelay: "0.2s" }}
          >
            {user.firstName} {user.lastName}
            {user.age && <span className="font-normal text-lg text-slate-600">, {user.age}</span>}
          </h2>
          
          {user.gender && (
            <p 
              className="text-sm text-slate-600 mt-1 animate-fade-in-up opacity-0" 
              style={{ animationDelay: "0.3s" }}
            >
              {user.gender}
            </p>
          )}

          {user.about && (
            <p 
              className="text-slate-600 mt-4 animate-fade-in-up opacity-0" 
              style={{ animationDelay: "0.4s" }}
            >
              {user.about}
            </p>
          )}

          {user.skills && user.skills.length > 0 && (
            <div 
              className="flex flex-wrap gap-2 mt-4 justify-center animate-fade-in-up opacity-0" 
              style={{ animationDelay: "0.5s" }}
            >
              {user.skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 rounded-full text-sm border border-slate-300 text-slate-700 bg-white/50 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsEditing(true)}
            className={cn(
              "mt-6 px-6 py-3 rounded-lg font-medium",
              "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
              "hover:from-blue-700 hover:to-blue-800",
              "shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30",
              "transition-all duration-300 hover:scale-105",
              "animate-fade-in-up opacity-0 flex items-center gap-2 mx-auto"
            )}
            style={{ animationDelay: "0.6s" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsEditing(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg glass-card p-6 animate-scale-in z-10">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl transition-colors"
              onClick={() => setIsEditing(false)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Edit Profile
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Name</label>
                <input
                  name="name"
                  type="text"
                  defaultValue={`${user.firstName} ${user.lastName || ""}`}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  name="emailId"
                  defaultValue={user.emailId}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-slate-100/50 text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Skills</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="Enter skills separated by ','"
                  defaultValue={user.skills?.join(", ")}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">About</label>
                <textarea
                  rows="4"
                  name="about"
                  defaultValue={user.about}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 resize-none"
                />
              </div>

              <button
                type="submit"
                className={cn(
                  "w-full py-3 rounded-lg font-semibold text-white mt-4",
                  "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
                  "btn-premium transition-all duration-300",
                  "shadow-lg shadow-blue-500/25",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
