import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const user = useSelector((state) => state.user);

  if (user && user._id) {
    // already logged in → block access to login/signup
    return <Navigate to="/feed" replace />;
  }

  return children;
}

export default PublicRoute;
