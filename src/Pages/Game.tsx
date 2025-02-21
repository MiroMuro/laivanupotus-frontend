import ConnectionStatusNotification from "../Components/GameAreaComponents/ConnectionStatusNotification";
import OpponentConnectionStatusNotification from "../Components/GameAreaComponents/OpponentConnectionStatusNotification";

import GameFooterArea from "../Components/GameFooterArea";
import GameArea from "../Components/GameArea";
import {
  Ship,
  DraggableShip,
  GameStartOrEnd,
  matchStatus,
  Move,
  WebSocketMoveResponseDto,
  ConnectionEvent,
  MatchStatusResponseDto,
} from "../Types/interfaces";
import { useEffect, useState } from "react";
import initialShipsStateArray from "../Utils/InitialShipsState";
import { useWebSocket } from "../Utils/WebSocketProvider";
import useGame from "../Utils/useGame";
import { useRef } from "react";
interface GameBoardProps {
  gameId: string;
  playerId: string;
}

const Game = ({ gameId, playerId }: GameBoardProps) => {
  const userHasRefreshedPage = useRef(false);
  const context = useWebSocket();

  const { disconnect, subscribeToGameEvent, connected, connect } = context;
  const { getGameStateByUserIdAndMatchId } = useGame();

  const [placedShips, setPlacedShips] = useState<DraggableShip[]>([]);
  const [gameStatePlaceholder, setGameStatePlaceholder] =
    useState<MatchStatusResponseDto>();
  const [shotsAtOpponent, setShotsAtOpponent] = useState<Move[]>(
    Array(100).fill(null)
  );
  const [opponentsShotsAtYourBoard, setOpponentShotsAtYourBoard] = useState<
    Move[]
  >(Array(100).fill(null));
  const [infoMessage, setInfoMessage] = useState<string>(
    `Drag your all of your ships to your board, and then press "Confirm ships"`
  );
  const [opponentConnectionMessage, setOpponentConnectionMessage] =
    useState<ConnectionEvent>();
  const [isYourTurn, setIsYourTurn] = useState<boolean>(false);
  const [shotMessage, setShotMessage] = useState<string>("");
  const [gameStartOrEndData, setGameStartOrEndData] =
    useState<GameStartOrEnd | null>(null);
  const [ships, setShips] = useState<Ship[]>(initialShipsStateArray);

  useEffect(() => {
    const activeSubScriptions: { unsubscribe: () => void }[] = [];

    const setupSubscriptions = () => {
      const handleGameEvent = (data: any) => {
        setGameStartOrEndData(data);

        if (data.status === matchStatus.IN_PROGRESS) {
          console.log("Game started!");
          setInfoMessage("Game started!");
          const isCurrentPlayerTurn = data.player.id === Number(playerId);

          setIsYourTurn(isCurrentPlayerTurn);
        }

        if (data.status === matchStatus.FINISHED) {
          setInfoMessage("Game finished!");
        }
      };

      const handleMove = (data: WebSocketMoveResponseDto) => {
        const isNotCurrentPlayerTurn =
          data.move.playerBehindTheMoveId !== Number(playerId);

        if (isNotCurrentPlayerTurn) {
          updateShotsAtYourBoard(data.move);
        } else {
          setShotMessage(data.message);
        }
        setIsYourTurn(isNotCurrentPlayerTurn);
      };

      const handleConnectionEvent = (data: ConnectionEvent) => {
        setOpponentConnectionMessage(data);
      };
      const gameSub = subscribeToGameEvent(
        Number(gameId),
        "game",
        handleGameEvent
      );
      const moveSub = subscribeToGameEvent(Number(gameId), "move", handleMove);

      const connectionEventSub = subscribeToGameEvent(
        Number(gameId),
        "connectionEvent",
        handleConnectionEvent
      );

      if (gameSub) activeSubScriptions.push(gameSub);
      if (moveSub) activeSubScriptions.push(moveSub);
      if (connectionEventSub) activeSubScriptions.push(connectionEventSub);
    };

    if (!connected) {
      connect(gameId);
    } else {
      setupSubscriptions();
    }
    const fetchGameState = async (matchId: number, playerId: number) => {
      try {
        const gameState = await getGameStateByUserIdAndMatchId(
          matchId,
          playerId
        );
        if (gameState) {
          setGameStateData(gameState);
        }
      } catch (error) {
        console.error("Failed to get game state:", error);
        throw new Error("Failed to get game state");
      }
    };

    if (userHasRefreshedPage.current) {
      fetchGameState(Number(gameId), Number(playerId));

      console.log("THe user has refreshed the page.");
    }
    if (!userHasRefreshedPage.current) {
      console.log("The user has not refreshed the page.");
    }

    return () => {
      //console.log("LEAVING OR REFRESHING PAGE");
      userHasRefreshedPage.current = true;
      activeSubScriptions.forEach((sub) => sub.unsubscribe());
      // // Only disconnect permanently if the navigating away from the page
      if (window.location.pathname !== `/play/game/${gameId}/${playerId}`) {
        disconnect(Number(gameId), true);
        console.log("Leaving page");
      } else {
        console.log("Refreshing page");
      }
    };
    //Disconnect from the game when the component unmounts
  }, [connected, gameId, playerId, connect, disconnect, subscribeToGameEvent]);

  let updateShotsAtYourBoard = (move: Move) => {
    setOpponentShotsAtYourBoard((prev) => {
      const updatedShots = [...prev];
      updatedShots[move.y * 10 + move.x] = move;
      return updatedShots;
    });
  };

  useEffect(() => {
    console.log("Current state:", {
      isYourTurn,
      infoMessage,
      gameStartOrEndData,
    });
  }, [
    isYourTurn,
    infoMessage,
    gameStartOrEndData,
    opponentsShotsAtYourBoard,
    shotsAtOpponent,
  ]);

  useEffect(() => {
    console.log(
      "Shots updated:",
      opponentsShotsAtYourBoard.filter((shot) => shot !== null)
    );
  }, [opponentsShotsAtYourBoard]);

  const setGameStateData = (data: MatchStatusResponseDto) => {
    //Three states. PLACING SHIPS, user has not placed ships. PLACING SHIPS, user has placed ships. IN_PROGRESS, game has started.
    //IN_PROGRESS, game has started.
    console.log("The data in setGameStateData is:", data);
    let player: "player1" | "player2" =
      data.player1.id === Number(playerId) ? "player1" : "player2";
    let playerBoard: "player1Board" | "player2Board" =
      data.player1.id === Number(playerId) ? "player1Board" : "player2Board";

    handlePlacingShipsPhase(data, player, playerBoard);
    // handleGameInProgressPhase(data, player, playerBoard);
  };
  const handlePlacingShipsPhase = (
    data: MatchStatusResponseDto,
    player: "player1" | "player2",
    playerBoard: "player1Board" | "player2Board"
  ) => {
    if (data.status === matchStatus.PLACING_SHIPS) {
      if (data[playerBoard].ships && data[playerBoard].ships.length > 0) {
        setShips([]);
        setPlacedShips(data[playerBoard].ships);
        setInfoMessage(
          "Ships placed succesfully. Waiting for opponent to place ships"
        );
        // Add your logic here
      } else {
        setInfoMessage(
          "Drag your all of your ships to your board, and then press 'Confirm ships'"
        );
      }
    }
  };

  return (
    <div className="bg-battleship-blue-light h-5/6 py-4 my-6 w-5/6 border-4 border-gray-400 rounded-xl text-white flex flex-col justify-between">
      <ConnectionStatusNotification />
      <OpponentConnectionStatusNotification data={opponentConnectionMessage} />
      <header className="w-full flex flex-row justify-around text-center">
        <p className="flex-[1_1_0%] text-xl">{infoMessage}</p>
        <p className="flex-[1_1_0%] text-xl">
          {gameStartOrEndData && (
            <>{isYourTurn ? "Your turn" : "Opponents turn"}</>
          )}
        </p>
        <p className="flex-[1_1_0%] text-xl">{shotMessage}</p>
      </header>

      <GameArea
        ships={ships}
        placedShips={placedShips}
        setPlacedShips={setPlacedShips}
        shotsAtOpponent={shotsAtOpponent}
        setShotsAtOpponent={setShotsAtOpponent}
        playerId={playerId}
        gameId={gameId}
        setInfoMessage={setInfoMessage}
        setShips={setShips}
        opponentsShotsAtYourBoard={opponentsShotsAtYourBoard}
        isYourTurn={isYourTurn}
      />
      <GameFooterArea
        placedShips={placedShips}
        setPlacedShips={setPlacedShips}
        infoMessage={infoMessage}
        setInfoMessage={setInfoMessage}
        setShips={setShips}
        gameId={gameId}
        playerId={playerId}
        initialShipsStateArray={initialShipsStateArray}
      />
    </div>
  );
};
export default Game;
