import { useAuth } from "../../Utils/Authprovider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useGame from "../../Utils/useGame";
import { useWebSocket } from "../../Utils/WebSocketProvider";
import ErrorLabel from "./CreateGameComponents/ErrorLabel";
import InfoLabel from "./CreateGameComponents/InfoLabel";
import CancelGameCreationButton from "./CreateGameComponents/CancelGameCreationButton";
import CreateGameButton from "./CreateGameComponents/CreateGameButton";
import MatchCreated from "./CreateGameComponents/MatchCreated";
import OpponentFound from "./CreateGameComponents/OpponentFound";
const CreateGame = () => {
  const { createGame, currentGame, setCurrentGame, creatingGameLoading } =
    useGame();
  const { currentUserInformation } = useAuth();
  const [infoMessage, setInfoMessage] = useState("");
  const [shouldShowInfoMessage, setShouldShowInfoMessage] = useState(false);
  const context = useWebSocket();
  const {
    connect,
    connected,
    subscribeToGameEvent,
    unsubscribeFromSingleGameEvent,
    disconnectFromCreateGame,
  } = context;
  const playerId = currentUserInformation?.id;
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isWebSocketConnecting, setIsWebSocketConnecting] = useState(false);

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
        setCurrentGame(game);

        setIsWebSocketConnecting(true);
        await connect(Number(game.id));
        setIsWebSocketConnecting(false);
      } catch (error) {
        if (error instanceof Error) {
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

  useEffect(() => {
    console.log("CurrentGame", currentGame);
    console.log("Connected", connected);
    console.log("IsWebSocketConnecting", isWebSocketConnecting);
    if (currentGame?.id && connected && !isWebSocketConnecting) {
      //console.log("Subscribing to playerJoined event");
      subscribeToGameEvent(currentGame.id, "playerJoined", (data) => {
        console.log("Player joined", data);

        if (data.messageStatus === true) {
          delete data.messageStatus;
          delete data.message;
          setCurrentGame(data);
        }
      });
    }
    return () => {
      // Only disconnect permanently if the navigating away from the page
      //console.log("Location pathname", window.location.pathname);
      if (userIsNavigatingAway()) {
        console.log("SWAG");
        if (currentGame?.id && connected) {
          disconnectFromCreateGame(true);
          //console.log("Disconnecting permanently. Shutting down stomp client");
        }
        //console.log("Navigating away from create game page");
      } else {
        //console.log("Refreshing page");
      }
    };
  }, [currentGame?.status, connected, isWebSocketConnecting]);

  useEffect(() => {
    navigateToPlay();
  }, [currentGame?.status, connected, isWebSocketConnecting]);

  const navigateToPlay = () => {
    if (currentGame && currentGame.status === "PLACING_SHIPS") {
      setTimeout(() => {
        unsubscribeFromSingleGameEvent(currentGame.id, "playerJoined");
        navigate("/play/game/" + currentGame.id + "/" + playerId);
      }, 2000);
    }
  };

  const userIsNavigatingAway = () => {
    return (
      window.location.pathname !== `/play/create` &&
      window.location.pathname !== `/play/game/${currentGame?.id}/${playerId}`
    );
  };
  console.log("CurrentGame", currentGame);
  function cancelMatchCreation() {
    //To-do: Implement cancel match creation
    return;
  }

  return (
    <div className="h-1/3 w-1/4 border-4 flex flex-col justify-center relative items-center text-2xl border-gray-400 bg-battleship-blue-light text-white rounded-xl">
      <ErrorLabel errorMessage={errorMessage} />
      <InfoLabel
        infoMessage={infoMessage}
        shouldShowInfoMessage={shouldShowInfoMessage}
      />
      <CancelGameCreationButton cancelMatchCreation={cancelMatchCreation} />
      <CreateGameButton
        handleCreateGame={handleCreateGame}
        creatingGameLoading={creatingGameLoading}
      />

      <h2>
        {!!currentGame && currentGame.status === "WAITING_FOR_PLAYER" && (
          <MatchCreated />
        )}
      </h2>
      <h2>
        {!!currentGame && currentGame.status === "PLACING_SHIPS" && (
          <OpponentFound opponentUserName={currentGame.player2!.userName} />
        )}
      </h2>
    </div>
  );
};
export default CreateGame;
