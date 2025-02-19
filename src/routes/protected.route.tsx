import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Prevent infinite re-renders: only navigate if user doesn't exist
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;

