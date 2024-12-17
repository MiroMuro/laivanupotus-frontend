import { useNavigate } from "react-router-dom";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div className="flex justify-center items-center flex-col h-1/2 w-1/2 mx-auto bg-battleship-blue-light border-solid border-4 border-gray-400 rounded-xl text-white">
        <h3 className="text-slate-400 italic text-xl">404 - Not found</h3>
        <p className=" text-3xl">
          Sorry captain, the page you are looking for does not exist!
        </p>
        <button
          className="bg-battleship-blue-dark text-white p-2 rounded-xl border-2 border-gray-500 my-4 transition transformation ease-in-out 200ms active:scale-75 hover:scale-105"
          onClick={() => navigate(-1)}
        >
          Go back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
