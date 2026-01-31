import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { cn } from "../utils/cn";

const navLinks = [
  { href: "/feed", label: "Feed", icon: "❤️" },
  { href: "/myConnections", label: "Connections", icon: "👥" },
  { href: "/myRequests", label: "Requests", icon: "📥" },
  { href: "/premium", label: "Premium", icon: "👑" },
];

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogOut = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(removeUser());
      navigate("/login");
    }
  };

  const isActive = (href) => location.pathname === href;

  if (!user || !user._id) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/50 animate-fade-in-down">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/feed" 
            className="flex items-center gap-2 text-xl font-bold text-slate-900 transition-all duration-200 hover:text-blue-600"
          >
            <span className="text-2xl">👨‍💻</span>
            <span className="hidden sm:inline">devTinder</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-slate-100 hover:text-slate-900",
                  isActive(link.href)
                    ? "text-blue-600"
                    : "text-slate-600"
                )}
              >
                <span className="flex items-center gap-2">
                  <span>{link.icon}</span>
                  {link.label}
                </span>
                {/* Active indicator */}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full animate-scale-in" />
                )}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative h-10 w-10 rounded-full p-0 overflow-hidden ring-2 ring-slate-200 hover:ring-blue-500 transition-all duration-200"
              >
                <img
                  src={user.photoUrl || "/placeholder.svg"}
                  alt={user.firstName}
                  className="h-full w-full object-cover"
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-xl z-50 animate-scale-in overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-200/50">
                      <p className="font-medium text-slate-900">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-slate-500 truncate">{user.emailId}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-3"
                      >
                        <span>👤</span>
                        Profile
                      </button>
                      <div className="my-1 border-t border-slate-200/50" />
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogOut();
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                      >
                        <span>🚪</span>
                        Log out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200/50 animate-fade-in-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    "animate-slide-in-right opacity-0",
                    isActive(link.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
