import useGame from "../../Utils/useGame";
import { useAuth } from "../../Utils/Authprovider";

import { useEffect } from "react";
const JoinGame = () => {
  const { games, fetchGames } = useGame();
  useEffect(() => {
    fetchGames();
  }, []);
  return (
    <div className="h-3/4 w-1/4 bg-battleship-blue-light text-white rounded-xl flex flex-col justify-start items-center border-4 border-gray-400">
      <h1 className="text-3xl border-b-4 border-gray-400 text-center w-full py-4">
        Available games
      </h1>
      {!games.length && <p>No games available</p>}
      {games.map((game) => (
        <div>
          <p>game</p>
          <button>Join</button>
        </div>
      ))}
    </div>
  );
};

export default JoinGame;
