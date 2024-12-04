import HeaderBar from "./Components/Header/HeaderBar.tsx";
import BackgroundImage from "./Components/BackgroundImage.tsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Play from "./Pages/Play.tsx";
import Login from "./Pages/Login.tsx";
import Leaderboards from "./Pages/Leaderboards.tsx";
import Register from "./Pages/Register.tsx";
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
      { path: "play", element: <Play /> },
      { path: "Leaderboards", element: <Leaderboards /> },
      { path: "Login", element: <Login /> },
      { path: "Register", element: <Register /> },
    ],
  },
]);

function App() {
  console.log(import.meta.env.VITE_BACKEND_BASE_URL);
  return (
    <div className="h-screen w-full">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
