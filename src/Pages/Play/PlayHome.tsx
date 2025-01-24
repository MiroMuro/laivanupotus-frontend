import { useNavigate } from "react-router";
const PlayHome = () => {
  const navigate = useNavigate();
  return (
    <div className="h-2/3 w-1/4 flex flex-col bg-battleship-blue-light rounded-md border-gray-400 border-4  text-white">
      <h1 className="text-4xl text-white w-full text-center">
        Play battleships!
      </h1>
      <div className="flex flex-row justify-evenly w-full h-1/6 px-2">
        <div className="flex-1 flex flex-col h-full  bg-battleship-blue-light justify-end my-auto border-2 rounded-xl mx-2  border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75 hover:scale-105">
          <button
            className="h-3/4 w-full bg-battleship-blue rounded-xl p-1 relative text-3xl"
            onClick={() => navigate("/play/create")}
          >
            New game
          </button>
        </div>
        <div className="flex-1 flex flex-col h-full  bg-battleship-blue-light justify-end my-auto border-2 rounded-xl mx-2  border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75 hover:scale-105">
          <button
            className="h-3/4 w-full bg-battleship-blue rounded-xl p-1 relative text-3xl"
            onClick={() => navigate("/play/join")}
          >
            Join a game
          </button>
        </div>
      </div>
      <div className="flex flex-row justify-evenly w-full h-1/6 p-2">
        <div className="flex-1 flex flex-col h-full  bg-battleship-blue-light justify-end my-auto border-2 rounded-xl mx-2  border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75 hover:scale-105">
          <button
            className="h-3/4 w-full bg-battleship-blue rounded-xl p-1 relative text-3xl"
            onClick={() => navigate("/play/quick")}
          >
            Quick play
          </button>
        </div>
      </div>
    </div>
  );
};
export default PlayHome;
