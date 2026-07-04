import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Loader from "../loader/Loader.jsx";

function ProtectedRoute({ children }) {
  const { user, authLoading } = useAuth();

  // Wait for Firebase auth to resolve before deciding
  if (authLoading) return <Loader />;

  // Use Navigate (declarative) — never call navigate() during render
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
