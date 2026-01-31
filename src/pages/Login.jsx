import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/constants";
import { cn } from "../utils/cn";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const onLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { emailId: email, password: password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      navigate("/feed");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-pink-50/50 to-fuchsia-50 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-400/15 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md glass-card p-8 animate-scale-in opacity-0 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2
            className="text-2xl font-bold text-foreground animate-fade-in-down opacity-0"
            style={{ animationDelay: "0.2s" }}
          >
            Welcome Back
          </h2>
          <p
            className="text-sm text-muted-foreground mt-2 animate-fade-in-down opacity-0"
            style={{ animationDelay: "0.3s" }}
          >
            Sign in to continue to devTinder
          </p>
        </div>

        <form onSubmit={onLogin} className="space-y-5">
          {/* Email field */}
          <div
            className="space-y-2 animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.4s" }}
          >
            <label
              htmlFor="email"
              className={cn(
                "text-sm font-medium transition-colors duration-200",
                focusedField === "email" ? "text-rose-600" : "text-slate-700"
              )}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className={cn(
                "w-full px-4 py-3 rounded-lg border bg-white/50 text-slate-900 placeholder:text-slate-400",
                "focus:outline-none transition-all duration-300",
                focusedField === "email"
                  ? "ring-2 ring-rose-500/50 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  : "border-rose-200 hover:border-rose-300"
              )}
              required
            />
          </div>

          {/* Password field */}
          <div
            className="space-y-2 animate-fade-in-up opacity-0"
            style={{ animationDelay: "0.5s" }}
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className={cn(
                  "w-full px-4 py-3 pr-12 rounded-lg border bg-white/50 text-slate-900 placeholder:text-slate-400",
                  "focus:outline-none transition-all duration-300",
                  focusedField === "password"
                    ? "ring-2 ring-rose-500/50 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                    : "border-rose-200 hover:border-rose-300",
                  error && "animate-shake border-red-500"
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
          <div className="animate-fade-in-up opacity-0 pt-2" style={{ animationDelay: "0.6s" }}>
            <button
              type="submit"
              className={cn(
                "w-full py-3 rounded-lg font-semibold text-white",
                "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700",
                "btn-premium transition-all duration-300",
                "shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              )}
              disabled={!email || !password || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Sign up link */}
          <p
            className="text-center text-sm text-muted-foreground animate-fade-in opacity-0 pt-4"
            style={{ animationDelay: "0.7s" }}
          >
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-rose-600 hover:text-rose-700 font-medium hover:underline transition-colors duration-200"
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;