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
      { path: "leaderboards", element: <Leaderboards /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);

function App() {
  return (
    <div className="h-screen w-full">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
