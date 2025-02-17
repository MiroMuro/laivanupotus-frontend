import Grid from "../Components/Grid/Grid";
import OpponentsGrid from "../Components/Grid/OpponentsGrid";
import ConnectionStatusNotification from "../Components/Grid/ConnectionStatusNotification";
import OpponentConnectionStatusNotification from "../Components/Grid/OpponentConnectionStatusNotification";
import Ships from "../Components/Grid/Ships";
import useShip from "../Utils/UseShip";
import { closestCorners, DndContext } from "@dnd-kit/core";
import {
  Ship,
  DraggableShip,
  GameStartOrEnd,
  matchStatus,
  Move,
  WebSocketMoveResponseDto,
  GameStatus,
} from "../Types/interfaces";
import { useEffect, useState } from "react";
import initialShipsStateArray from "../Utils/InitialShipsState";
import { useWebSocket } from "../Utils/WebSocketProvider";
import useGame from "../Utils/useGame";
import { useLocation, useBeforeUnload } from "react-router";
interface GameBoardProps {
  gameId: string;
  playerId: string;
}

const GameBoard = ({ gameId, playerId }: GameBoardProps) => {
  const location = useLocation();
  const context = useWebSocket();
  const { placeShips, makeMove, getGameState } = useGame();
  const [placedShips, setPlacedShips] = useState<DraggableShip[]>([]);
  const [shotsAtOpponent, setShotsAtOpponent] = useState<Move[]>(
    Array(100).fill(null)
  );
  const [opponenstShotsAtYourBoard, setOpponentShotsAtYourBoard] = useState<
    Move[]
  >(Array(100).fill(null));
  const [shipsPlaced, setShipsPlaced] = useState<boolean>(false);
  const [infoMessage, setInfoMessage] = useState<string>(
    `Drag your all of your ships to your board, and then press "Confirm ships"`
  );
  const [opponentConnectionMessage, setOpponentConnectionMessage] =
    useState<string>("");
  const [isYourTurn, setIsYourTurn] = useState<boolean>(false);
  const [shotMessage, setShotMessage] = useState<string>("");
  const [gameStartOrEndData, setGameStartOrEndData] =
    useState<GameStartOrEnd | null>(null);
  const { disconnect, subscribeToGameEvent, connected, connect } = context;
  const [ships, setShips] = useState<Ship[]>(initialShipsStateArray);
  const {
    getShipStartingCellCoords,
    getShipCoords,
    doesShipCollideWithPlacedShips,
  } = useShip();

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
        const isCurrentPlayerTurn =
          data.move.playerBehindTheMoveId !== Number(playerId);

        if (isCurrentPlayerTurn) {
          updateShotsAtYourBoard(data.move);
        } else {
          setShotMessage(data.message);
        }
        setIsYourTurn(isCurrentPlayerTurn);
      };

      const handleOpponentDisconnected = (data: any) => {
        setInfoMessage("Opponent disconnected");
        console.log("Opponent disconnected", data);
        setOpponentConnectionMessage(data.message);
      };

      const handleConnectionEvent = (data: any) => {
        console.log("In connection EVENT");
        console.log("Connection event data: ", data);
      };
      const gameSub = subscribeToGameEvent(
        Number(gameId),
        "game",
        handleGameEvent
      );
      const moveSub = subscribeToGameEvent(Number(gameId), "move", handleMove);
      const opponentDisconnectedSub = subscribeToGameEvent(
        Number(gameId),
        "opponentDisconnected",
        handleOpponentDisconnected
      );

      const connectionEventSub = subscribeToGameEvent(
        Number(gameId),
        "connectionEvent",
        handleConnectionEvent
      );

      if (gameSub) activeSubScriptions.push(gameSub);
      if (moveSub) activeSubScriptions.push(moveSub);
      if (opponentDisconnectedSub)
        activeSubScriptions.push(opponentDisconnectedSub);
      if (connectionEventSub) activeSubScriptions.push(connectionEventSub);
    };

    if (!connected) {
      connect(Number(gameId));
    } else {
      setupSubscriptions();
    }

    return () => {
      //console.log("LEAVING OR REFRESHING PAGE");

      // window.removeEventListener("beforeunload", handleBeforeUnload);

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
    opponenstShotsAtYourBoard,
    shotsAtOpponent,
  ]);

  useEffect(() => {
    console.log(
      "Shots updated:",
      opponenstShotsAtYourBoard.filter((shot) => shot !== null)
    );
  }, [opponenstShotsAtYourBoard]);

  // useBeforeUnload((e) => {
  //   if (connected) {
  //     sendPageRefreshMessageThroughWebSocket(Number(gameId));
  //   }
  // });

  useEffect(() => {
    // const handleUnload = () =>{
    //   if(connected){
    //     const data = JSON.stringify({
    //       type: "LEAVE",
    //       timestamp: new Date().toISOString()
    //     });
    //     const blob = new Blob([data], {type: "application/json"});
    //     navigator.sendBeacon(`/api/game/${gameId}/leave`, blob);
    //   }
    // };
    // window.addEventListener("unload", handleUnload);
    // return () => window.removeEventListener("unload", handleUnload);
  }, [connected, gameId]);
  // useEffect(() => {
  //   const onBeforeUnload = (e: BeforeUnloadEvent) => {
  //     console.log("Im in onBeforeUnload");

  //     e.preventDefault();

  //     return "Are you sure you want to leave?";
  //   };

  //   window.addEventListener("beforeunload", onBeforeUnload);

  //   async function fetchData(
  //     matchId: number,
  //     playerId: number,
  //     gameStatus: GameStatus
  //   ) {
  //     const response = await getGameState(
  //       Number(matchId),
  //       Number(playerId),
  //       gameStatus
  //     );
  //     console.log("THe response of the game state is:", response);
  //   }

  //   fetchData(Number(gameId), Number(playerId), "PLACING_SHIPS");

  //   return () => {
  //     window.removeEventListener("beforeunload", onBeforeUnload);
  //   };
  // }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    let { direction, id, height, width } = active.data.current;
    let draggedShip = ships.find((ship) => ship.id === id);

    if (!draggedShip) return;

    let { row, col } = getShipStartingCellCoords(
      direction,
      over.id,
      height,
      width
    );

    if (draggedShip) {
      let coordinates = getShipCoords(direction, col, row, height, width);
      let placedShipsCoords = placedShips.map((ship) => ship.coordinates);

      let doesCollide = doesShipCollideWithPlacedShips(
        coordinates,
        placedShipsCoords
      );

      if (row + height <= 10 && col + width <= 10 && !doesCollide) {
        const newShip = {
          ...draggedShip,
          height,
          width,
          coordinates,
        };
        setPlacedShips((prev) => [...prev, newShip]);
        setShips((prev) => prev.filter((ship) => ship.id !== active.id));
      } else {
        console.log("The ship doesnt fit!");
      }
    }
  };

  const resetShips = () => {
    if (shipsPlaced) {
      setInfoMessage("You can't reset ships after placing them");
      return;
    }
    setPlacedShips([]);
    setShips(initialShipsStateArray);
  };

  const confirmShips = async (
    matchId: string,
    playerId: string,
    placedShips: DraggableShip[]
  ) => {
    if (!shipsVerified()) {
      return;
    }

    let shipsWithLongId: DraggableShip[] = placedShips.map((ship) => ({
      ...ship,
      id: ship.id.slice(-1),
    }));
    let success = await placeShips(
      Number(matchId),
      Number(playerId),
      shipsWithLongId
    );

    if (success) {
      setShipsPlaced(true);
      setInfoMessage(
        "Ships placed succesfully. Waiting for opponent to place ships"
      );
    } else {
      setInfoMessage("Error placing ships. Try again");
    }
  };

  const shipsVerified = () => {
    return verifyAllShipsPlaced() && verifyShipsNotAlreadyPlaced();
  };

  const verifyAllShipsPlaced = () => {
    if (placedShips.length !== initialShipsStateArray.length) {
      console.log("Placed ships length:", placedShips.length);
      console.log("Initial ships length:", initialShipsStateArray.length);
      setInfoMessage("Place all ships before confirming");
      return false;
    }
    return true;
  };

  const verifyShipsNotAlreadyPlaced = () => {
    if (shipsPlaced) {
      setInfoMessage("Ships already placed");
      return false;
    }
    return true;
  };

  const shootAtEnemyCell = async (x: number, y: number) => {
    const newMove: Move = {
      x: x,
      y: y,
      playerBehindTheMoveId: Number(playerId),
      isHit: false,
    };

    try {
      let validatedMove = await makeMove(
        Number(gameId),
        Number(playerId),
        newMove
      );
      if (validatedMove) {
        updateShotsAtOpponents(validatedMove);
      }
      console.log("THe response of the move is:", validatedMove);
    } catch (error) {
      setTimeout(
        () =>
          setInfoMessage(
            "An error occured while shooting at the opponent. Please try again"
          ),
        6000
      );
    }
  };

  let updateShotsAtOpponents = (move: Move) => {
    const updatedShots = [...shotsAtOpponent];
    updatedShots[move.y * 10 + move.x] = move;
    setShotsAtOpponent(updatedShots);
  };

  return (
    <div className="bg-battleship-blue-light h-5/6 py-4 my-6 w-5/6 border-4 border-gray-400 rounded-xl text-white flex flex-col justify-between">
      <ConnectionStatusNotification />
      <OpponentConnectionStatusNotification
        message={opponentConnectionMessage}
      />
      <header className="w-full flex flex-row justify-around text-center">
        <p className="flex-[1_1_0%] text-xl">{infoMessage}</p>
        <p className="flex-[1_1_0%] text-xl">
          {gameStartOrEndData && (
            <>{isYourTurn ? "Your turn" : "Opponents turn"}</>
          )}
        </p>
        <p className="flex-[1_1_0%] text-xl">{shotMessage}</p>
      </header>
      <div className="flex  flex-row justify-around align-middle">
        <DndContext
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <Ships ships={ships} />
          <Grid
            label="Your board"
            placedShips={placedShips}
            opponentsShotsAtYourBoard={opponenstShotsAtYourBoard}
          />
          <OpponentsGrid
            label="Opponents board"
            isYourTurn={isYourTurn}
            shootAtEnemyCell={shootAtEnemyCell}
            shotsAtOpponent={shotsAtOpponent}
          />
        </DndContext>
      </div>
      <footer className="w-full h-1/6 flex justify-around text-center">
        <div className="flex-[1_1_0%] flex justify-around items-center text-xl gap-8">
          <div
            className={`bg-battleship-blue-light flex flex-col justify-end border-2 border-gray-400 rounded-xl h-5/6 w-1/4 ${
              shipsPlaced
                ? ""
                : "transition transform hover:scale-105 active:scale-75"
            }`}
          >
            <button
              className={`w-full rounded-xl  h-3/4  bg-battleship-blue p-1 relative ${
                shipsPlaced ? "cursor-not-allowed disabled" : "cursor-pointer"
              }`}
              onClick={() => resetShips()}
            >
              <p className="text-lg text-white absolute -top-3 left-1/2 -translate-x-1/2">
                Reset ships
              </p>
            </button>
          </div>

          <div
            className={`bg-battleship-blue-light flex flex-col justify-end border-2 border-gray-400 rounded-xl h-5/6 w-1/4  ${
              shipsPlaced
                ? ""
                : "transition transform hover:scale-105 active:scale-75"
            }`}
          >
            <button
              className={`w-full rounded-xl  h-3/4  bg-battleship-blue p-1 relative ${
                shipsPlaced ? "cursor-not-allowed disabled" : "cursor-pointer"
              }`}
              onClick={() => confirmShips(gameId, playerId, placedShips)}
            >
              <p className="text-lg text-white absolute -top-3 left-1/2 -translate-x-1/2">
                Confirm ships
              </p>
            </button>
          </div>

          <div
            className={`bg-battleship-blue-light flex flex-col justify-end border-2 border-gray-400 rounded-xl h-5/6 w-1/4  ${
              shipsPlaced
                ? ""
                : "transition transform hover:scale-105 active:scale-75"
            }`}
          >
            <button
              className="w-full rounded-xl  h-3/4  bg-battleship-blue p-1 relative 
                cursor-pointer"
            >
              <p className="text-lg text-white absolute -top-3 left-1/2 -translate-x-1/2">
                Connect to chat
              </p>
            </button>
          </div>
        </div>
        <div className="flex-[2_1_0%] flex bg-white justify-center items-center text-xl gap-8"></div>
      </footer>
    </div>
  );
};
export default GameBoard;
