import HeaderBar from "./Components/Header/HeaderBar.tsx";
import BackgroundImage from "./Components/BackgroundImage.tsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Play from "./Pages/Play.tsx";
import Login from "./Pages/Login.tsx";
import Leaderboards from "./Pages/Leaderboards.tsx";
import Register from "./Pages/Register.tsx";
import axios from "axios";
import { AuthProvider } from "./Utils/Authprovider.tsx";
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
  console.log(import.meta.env.VITE_BACKEND_BASE_URL);
  axios.interceptors.request.use((config) => {
    console.log("The config url", config.url);
    console.log("The config baseUrl,", config.baseURL);
    return config;
  });
  return (
    <AuthProvider>
      <div className="h-screen w-full">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
}

export default App;
