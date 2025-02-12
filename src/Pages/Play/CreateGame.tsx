import { useAuth } from "../../Utils/Authprovider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useGame from "../../Utils/useGame";
import { useWebSocket } from "../../Utils/WebSocketProvider";
import { CurrentGame } from "../../Types/interfaces";
const CreateGame = () => {
  const { createGame, currentGame, setCurrentGame, creatingGameLoading } =
    useGame();
  const { currentUserInformation } = useAuth();
  const [infoMessage, setInfoMessage] = useState("");
  const [shouldShowInfoMessage, setShouldShowInfoMessage] = useState(false);
  const context = useWebSocket();
  const { connect, subscribeToGameEvent, unsubscribeFromSingleGameEvent } =
    context;
  const playerId = currentUserInformation?.id;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  if (!playerId) {
    return <div>Couldn't fetch player Id, please login and try again.</div>;
  }

  const handleCreateGame = async () => {
    if (creatingGameLoading) {
      setShouldShowInfoMessage(true);
      setInfoMessage("Game creation already in progress... please wait...");
      return;
    }
    if (!matchIsAlreadyCreating()) {
      try {
        setShouldShowInfoMessage(false);
        const game = await createGame(playerId);
        connect();
      } catch (error) {
        if (error instanceof Error) {
          console.log("THe error is", { error });
          setShouldShowInfoMessage(false);
          displayErrorMessageFor10Seconds(error.message);
          return;
        }
      }
    } else {
      setMatchAlreadyCreatedInfoMessage();
    }
  };

  const matchIsAlreadyCreating = () => {
    if (
      (currentGame && currentGame.status === "WAITING_FOR_PLAYER") ||
      (currentGame && currentGame.status === "PLACING_SHIPS")
    ) {
      return true;
    }
    return false;
  };

  const setMatchAlreadyCreatedInfoMessage = () => {
    setShouldShowInfoMessage(true);
    setInfoMessage("Match already created.");
    setTimeout(() => {
      setShouldShowInfoMessage(false);
    }, 5000);

    return;
  };

  const displayErrorMessageFor10Seconds = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage("");
    }, 10000);
  };

  useEffect(() => {});

  useEffect(() => {
    if (currentGame?.id) {
      subscribeToGameEvent(currentGame.id, "playerJoined", (data) => {
        console.log("Player joined", data);

        if (data.messageStatus === true) {
          delete data.messageStatus;
          delete data.message;
          setCurrentGame(data);
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
        unsubscribeFromSingleGameEvent(currentGame.id, "playerJoined");
        navigate("/play/game/" + currentGame.id + "/" + playerId);
      }, 4000);
    }
  };

  console.log("CurrentGame", currentGame);
  return (
    <div className="h-1/3 w-1/4 border-4 flex flex-col justify-center relative items-center text-2xl border-gray-400 bg-battleship-blue-light text-white rounded-xl">
      <label
        className={`absolute -top-16 text-center bg-red-500 border-4 rounded-md border-gray-400 w-full h-14 text-base transition-opacity ease-in duration-700 ${
          errorMessage ? "opacity-100" : "opacity-0"
        }`}
      >
        {errorMessage}
      </label>
      <label className="absolute top-3 text-xl">
        {shouldShowInfoMessage ? <p>{infoMessage} </p> : ""}
      </label>

      <div className=" flex flex-col h-1/2 w-2/5 bg-battleship-blue-light justify-end my-auto border-2 rounded-xl mx-2  border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75 hover:scale-105">
        <button
          className="h-3/4 w-full bg-battleship-blue rounded-xl p-1 relative text-xl"
          onClick={() => handleCreateGame()}
        >
          <h1>
            {creatingGameLoading ? (
              <div className="loading-dots">
                Creating game
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              <>Create a game</>
            )}
          </h1>
        </button>
      </div>

      <h2>
        {!!currentGame && currentGame.status === "WAITING_FOR_PLAYER" && (
          <div>Game creation successful! Waiting for player 2...</div>
        )}
      </h2>
      <h2>
        {!!currentGame && currentGame.status === "PLACING_SHIPS" && (
          <>
            <h2 className="flex flex-row gap-4">
              Opponent found!{" "}
              <div className="loading-dots">
                Loading game
                <span></span>
                <span></span>
                <span></span>
              </div>{" "}
            </h2>{" "}
          </>
        )}
      </h2>
    </div>
  );
};
export default CreateGame;
