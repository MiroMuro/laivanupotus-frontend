import { useAuth } from "./Authprovider";
import AlreadyAuthenticated from "../Pages/AlreadyAuthenticated";
const AlreadyAuthenticatedRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <AlreadyAuthenticated /> : children;
};
export default AlreadyAuthenticatedRoute;
