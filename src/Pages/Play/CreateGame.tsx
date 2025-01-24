import { useAuth } from "../../Utils/Authprovider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useWebSocket from "../../Utils/useWebSocket";
import useGame from "../../Utils/useGame";
const CreateGame = () => {
  const { createGame, currentGame, setCurrentGame, creatingGameLoading } =
    useGame();
  const { currentUserInformation } = useAuth();
  const [infoMessage, setInfoMessage] = useState("");
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
    if (
      (currentGame && currentGame.status === "WAITING_FOR_PLAYER") ||
      (currentGame && currentGame.status === "PLACING_SHIPS")
    ) {
      setInfoMessage("Match creation already in progress... please wait...");
      setTimeout(() => {
        setInfoMessage("");
      }, 4000);
      return;
    }
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
        navigate("/play/game/" + currentGame.id + "/" + playerId);
      }, 4000);
    }
  };

  console.log("CurrentGame", currentGame);
  return (
    <div className="h-1/3 w-1/4 border-4 flex flex-col justify-center relative items-center text-2xl border-gray-400 bg-battleship-blue-light text-white rounded-xl">
      <label className="absolute top-3 text-xl">{infoMessage}</label>

      <div className=" flex flex-col h-1/2  bg-battleship-blue-light justify-end my-auto border-2 rounded-xl mx-2  border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75 hover:scale-105">
        <button
          className="h-3/4 w-full bg-battleship-blue rounded-xl p-1 relative text-3xl"
          onClick={() => handleCreateGame()}
        >
          Create a game
        </button>
      </div>
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
