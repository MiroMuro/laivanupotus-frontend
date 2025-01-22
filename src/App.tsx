import HeaderBar from "./Components/Header/HeaderBar.tsx";
import BackgroundImage from "./Components/BackgroundImage.tsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import PlayHome from "./Pages/Play/PlayHome.tsx";
import Login from "./Pages/Login.tsx";
import Leaderboards from "./Pages/Leaderboards.tsx";
import Register from "./Pages/Register.tsx";
import NotFound from "./Pages/NotFound.tsx";
import Home from "./Pages/Home.tsx";
import Profile from "./Pages/Profile.tsx";
import Logout from "./Pages/Logout.tsx";
import CreateGame from "./Pages/Play/CreateGame.tsx";
import JoinGame from "./Pages/Play/JoinGame.tsx";
import QuickPlay from "./Pages/Play/QuickPlay.tsx";
import ProtectedGameRoute from "./Utils/ProtectedGameRoute.tsx";
import { useAuth } from "./Utils/Authprovider.tsx";
import ProtectedRoute from "./Utils/ProtectedRoute.tsx";
const Layout = () => (
  <BackgroundImage>
    <HeaderBar />
    <div className="w-full h-full flex justify-center items-center ">
      <Outlet />
    </div>
  </BackgroundImage>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      {
        path: "play",
        element: (
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: "", element: <PlayHome /> },
          { path: "create", element: <CreateGame /> },
          { path: "join", element: <JoinGame /> },
          { path: "quick", element: <QuickPlay /> },
          { path: "game/:gameId/:playerId", element: <ProtectedGameRoute /> },
        ],
      },
      {
        path: "Leaderboards",
        element: (
          <ProtectedRoute>
            {" "}
            <Leaderboards />{" "}
          </ProtectedRoute>
        ),
      },
      {
        path: "Profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: "Login", element: <Login /> },
      {
        path: "Logout",
        element: (
          <ProtectedRoute>
            <Logout />
          </ProtectedRoute>
        ),
      },
      { path: "Register", element: <Register /> },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

function App() {
  const isLoginOrRegisterReq = (resource: RequestInfo | URL) => {
    if (
      !resource.toString().includes("login") ||
      !resource.toString().includes("register")
    ) {
      return true;
    }
    return false;
  };

  const appendAuthHeaders = (
    options: RequestInit | undefined,
    authHeader: Headers
  ) => {
    if (options && options.headers) {
      options = {
        ...options,
        headers: {
          ...options.headers,
          ...authHeader,
        },
      };
    } else {
      options = {
        ...options,
        headers: {
          ...authHeader,
        },
      };
    }

    return options;
  };

  const { fetch: origFetch } = window;
  const { user, token } = useAuth();

  window.fetch = async (...args) => {
    let [resource, options] = args;
    console.log("Options", options);
    const authHeader = new Headers();
    // Only try add headers to routes that aren't login or register.
    if (!isLoginOrRegisterReq(resource)) {
      if (user && token) {
        authHeader.append("Authorization", `Bearer ${token}`);
        options = appendAuthHeaders(options, authHeader);
      } else {
        throw new Error("User not logged in");
      }
    }

    const response = await origFetch(resource, options);

    return response;
  };

  return (
    <div className="h-screen w-full">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
