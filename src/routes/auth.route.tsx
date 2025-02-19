import { DashboardSkeleton } from "@/components/skeleton-loaders/dashboard-skeleton";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthRoute } from "./common/routePaths";

const AuthRoute = () => {
  const location = useLocation();

  // Get user from local storage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const _isAuthRoute = isAuthRoute(location.pathname);

  if (!user && !_isAuthRoute) return <DashboardSkeleton />;

  if (!user) return <Outlet />;

  return <Navigate to={`workspace/${user.currentWorkspace}`} replace />;
};

export default AuthRoute;

