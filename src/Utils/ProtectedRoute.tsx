import { useAuth } from "./Authprovider";
import NotAuthenticated from "../Pages/NotAuthenticated";
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, decodedUser, currentUserInformation } =
    useAuth();
  console.log("Isauthenticated", isAuthenticated);
  console.log("Decodeduser", decodedUser);
  console.log("currentuserInfo", currentUserInformation);
  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? children : <NotAuthenticated />;
};
export default ProtectedRoute;
