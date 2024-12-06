import HeaderBar from "./Components/Header/HeaderBar.tsx";
import BackgroundImage from "./Components/BackgroundImage.tsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Play from "./Pages/Play.tsx";
import Login from "./Pages/Login.tsx";
import Leaderboards from "./Pages/Leaderboards.tsx";
import Register from "./Pages/Register.tsx";
import { useAuth } from "./Utils/Authprovider.tsx";
import ProtectedRoute from "./Utils/ProtectedRoute.tsx";
const Layout = () => (
  <BackgroundImage>
    <HeaderBar />
    <Outlet />
  </BackgroundImage>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "play",
        element: (
          <ProtectedRoute>
            <Play />{" "}
          </ProtectedRoute>
        ),
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
      { path: "Login", element: <Login /> },
      { path: "Register", element: <Register /> },
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

  console.log("" + import.meta.env.VITE_BACKEND_BASE_URL);
  const { fetch: origFetch } = window;
  const { user, token } = useAuth();
  window.fetch = async (...args) => {
    let [resource, options] = args;
    const authHeader = new Headers();
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
