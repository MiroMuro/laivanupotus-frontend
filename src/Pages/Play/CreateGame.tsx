import { useAuth } from "../../Utils/Authprovider";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useWebSocket from "../../Utils/useWebSocket";
import useGame from "../../Utils/useGame";
const CreateGame = () => {
  const { createGame, currentGame, setCurrentGame, creatingGameLoading } =
    useGame();
  const { currentUserInformation } = useAuth();
  const {
    subscribeToGameEvent,
    connected,
    unsubscribeFromSingleGameEvent,
    unsubscribeFromAllGameEvents,
  } = useWebSocket();
  const playerId = currentUserInformation?.id;
  const navigate = useNavigate();

  if (!playerId) {
    return <div>Couldn't fetch player Id, please login and try again.</div>;
  }

  const handleCreateGame = () => {
    createGame(playerId);
  };

  useEffect(() => {
    if (currentGame?.id) {
      subscribeToGameEvent(currentGame.id, "playerJoined", (data) => {
        console.log("Player joined", data);

        if (data.messageStatus === true) {
          delete data.messageStatus;
          delete data.message;
          setCurrentGame(data);

          subscribeToGameEvent(currentGame.id, "game", (data) => {
            console.log("Game", data);
          });

          subscribeToGameEvent(currentGame.id, "move", (data) => {
            console.log("Move", data);
          });
        }
      });
    }
  }, [currentGame?.id]);

  useEffect(() => {
    navigateToPlay();
  }, [currentGame?.status]);

  const navigateToPlay = () => {
    if (currentGame && currentGame.status === "PLACING_SHIPS") {
      setTimeout(() => {
        navigate("/play/game/" + currentGame.id);
      }, 4000);
    }
  };

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
      <h2>
        {!!currentGame && currentGame.status === "PLACING_SHIPS" && (
          <>
            <h2>Opponent found! Loading the board</h2>{" "}
            <div className="loading-dots">
              Loading
              <span></span>
              <span></span>
              <span></span>
            </div>
          </>
        )}
      </h2>
    </div>
  );
};
export default CreateGame;
