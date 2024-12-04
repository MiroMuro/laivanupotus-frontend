import { Navigate } from "react-router-dom";
import { useAuth } from "./Authprovider";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
};
export default ProtectedRoute;
