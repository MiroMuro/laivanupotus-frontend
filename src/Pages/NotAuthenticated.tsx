import { useNavigate } from "react-router-dom";

const NotAuthenticated = () => {
  const navigate = useNavigate();
  return (
    <div className="w-96 h-36 flex flex-col items-center justify-center  text-black rounded-md bg-battleship-blue-light border-4 border-gray-400">
      <h2 className="text-xl text-white">
        You need to be logged in to view this page!
      </h2>
      <button
        className="bg-battleship-blue-dark text-white p-2 rounded-xl border-2 border-gray-500 my-4 transition transformation ease-in-out 200ms active:scale-75 hover:scale-105"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </div>
  );
};

export default NotAuthenticated;
