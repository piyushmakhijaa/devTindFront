import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { cn } from "../utils/cn";

function SignUp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = name && email && password && phone && age && gender;

  const onSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const parts = name.split(" ");
    const payload = {
      firstName: parts[0],
      emailId: email,
      password: password,
      phone: phone,
      age: age,
      gender: gender
    };

    if (parts[1]) {
      payload.lastName = parts[1];
    }

    try {
      await axios.post(`${BASE_URL}/signup`, payload, { withCredentials: true });

      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId: email, password: password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    { id: "name", label: "Full Name", type: "text", value: name, setter: setName, placeholder: "Enter your full name" },
    { id: "email", label: "Email", type: "email", value: email, setter: setEmail, placeholder: "Enter your email" },
    { id: "phone", label: "Phone", type: "tel", value: phone, setter: setPhone, placeholder: "Enter your phone number" },
    { id: "age", label: "Age", type: "number", value: age, setter: (v) => setAge(v < 0 ? 0 : v), placeholder: "Enter your age" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-pink-50/50 to-fuchsia-50 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-400/15 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-400/10 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      {/* SignUp Card */}
      <div className="w-full max-w-md glass-card p-8 animate-scale-in opacity-0 relative z-10 my-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2
            className="text-2xl font-bold text-foreground animate-fade-in-down opacity-0"
            style={{ animationDelay: "0.2s" }}
          >
            Create Account
          </h2>
          <p
            className="text-sm text-muted-foreground mt-2 animate-fade-in-down opacity-0"
            style={{ animationDelay: "0.3s" }}
          >
            Join devTinder and start connecting
          </p>
        </div>

        <form onSubmit={onSignUp} className="space-y-4">
          {inputFields.map((field, index) => (
            <div
              key={field.id}
              className="space-y-2 animate-fade-in-up opacity-0"
              style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            >
              <label
                htmlFor={field.id}
                className={cn(
                  "text-sm font-medium transition-colors duration-200",
                  focusedField === field.id ? "text-rose-600" : "text-slate-700"
                )}
              >
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                onFocus={() => setFocusedField(field.id)}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  "w-full px-4 py-3 rounded-lg border bg-white/50 text-slate-900 placeholder:text-slate-400",
                  "focus:outline-none transition-all duration-300",
                  focusedField === field.id
                    ? "ring-2 ring-rose-500/50 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                    : "border-rose-200 hover:border-rose-300"
                )}
                required
                min={field.type === "number" ? 0 : undefined}
              />
            </div>
          ))}

          {/* Gender select */}
          <div
            className="space-y-2 animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.7s" }}
          >
            <label
              htmlFor="gender"
              className={cn(
                "text-sm font-medium transition-colors duration-200",
                focusedField === "gender" ? "text-rose-600" : "text-slate-700"
              )}
            >
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              onFocus={() => setFocusedField("gender")}
              onBlur={() => setFocusedField(null)}
              className={cn(
                "w-full px-4 py-3 rounded-lg border bg-white/50 text-slate-900",
                "focus:outline-none transition-all duration-300",
                focusedField === "gender"
                  ? "ring-2 ring-rose-500/50 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  : "border-rose-200 hover:border-rose-300"
              )}
              required
            >
              <option value="" disabled>Select your gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Password field */}
          <div
            className="space-y-2 animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.8s" }}
          >
            <label
              htmlFor="password"
              className={cn(
                "text-sm font-medium transition-colors duration-200",
                focusedField === "password" ? "text-rose-600" : "text-slate-700"
              )}
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  "w-full px-4 py-3 pr-12 rounded-lg border bg-white/50 text-slate-900 placeholder:text-slate-400",
                  "focus:outline-none transition-all duration-300",
                  focusedField === "password"
                    ? "ring-2 ring-rose-500/50 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                    : "border-rose-200 hover:border-rose-300"
                )}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-rose-500 transition-colors duration-200"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="text-sm text-red-500 animate-fade-in text-center py-2">
              {error}
            </div>
          )}

          {/* Submit button */}
          <div className="animate-fade-in-up opacity-0 pt-2" style={{ animationDelay: "0.9s" }}>
            <button
              type="submit"
              className={cn(
                "w-full py-3 rounded-lg font-semibold text-white",
                "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700",
                "btn-premium transition-all duration-300",
                "shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              )}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isFormValid && <span className="text-lg animate-bounce-in">🎉</span>}
                  Create Account
                </span>
              )}
            </button>
          </div>

          {/* Login link */}
          <p
            className="text-center text-sm text-muted-foreground animate-fade-in opacity-0 pt-2"
            style={{ animationDelay: "1s" }}
          >
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-rose-600 hover:text-rose-700 font-medium hover:underline transition-colors duration-200"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;