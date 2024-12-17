import { useAuth } from "./Authprovider";
import NotAuthenticated from "../Pages/NotAuthenticated";
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <NotAuthenticated />;
};
export default ProtectedRoute;
