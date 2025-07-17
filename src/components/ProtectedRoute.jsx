import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();

  return user?.isLoggedIn ? children : <Navigate to="/auth" />;
}

export default ProtectedRoute;
