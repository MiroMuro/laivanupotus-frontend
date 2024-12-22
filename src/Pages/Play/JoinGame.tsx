import useGame from "../../Utils/UseGame";
import { useAuth } from "../../Utils/Authprovider";

import { useEffect } from "react";
const JoinGame = () => {
  const { user } = useAuth();
  console.log("The user is", user);
  const { games, fetchGames } = useGame();
  useEffect(() => {
    fetchGames();
  }, []);
  return (
    <div>
      <h1>Join Game</h1>
    </div>
  );
};

export default JoinGame;
