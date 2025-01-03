import { useAuth } from "../../Utils/Authprovider";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useGame from "../../Utils/useGame";
const CreateGame = () => {
  const { createGame, currentGame, creatingGameLoading } = useGame();
  const { currentUserInformation } = useAuth();
  const playerId = currentUserInformation?.id;
  const navigate = useNavigate();
  if (!playerId) {
    return <div>Couldn't fetch player Id, please login and try again.</div>;
  }

  const handleCreateGame = () => {
    createGame(playerId);
  };

  useEffect(() => {
    if (currentGame && currentGame.status === "PLACING_SHIPS") {
      navigate(`/play/game/${currentGame.id}`);
    }
  }, [currentGame?.status, navigate]);

  console.log("CurrentGame", currentGame);
  return (
    <div className="h-3/4 w-1/4 border-4 border-gray-400 bg-battleship-blue-light text-white rounded-xl">
      <button onClick={() => handleCreateGame()}>Create a game</button>
      <h1>{creatingGameLoading ? <div>Creating game...</div> : <></>}</h1>
      <h2>
        {!!currentGame && currentGame.status === "WAITING_FOR_PLAYER" && (
          <div>Game creation successful! Waiting for player 2...</div>
        )}
      </h2>
    </div>
  );
};
export default CreateGame;
