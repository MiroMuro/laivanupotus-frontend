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
  ConnectionEvent,
} from "../Types/interfaces";
import GameBoardButton from "../Components/Grid/GameBoardButton";
import { useEffect, useState } from "react";
import initialShipsStateArray from "../Utils/InitialShipsState";
import { useWebSocket } from "../Utils/WebSocketProvider";
import useGame from "../Utils/useGame";
import { useRef } from "react";
interface GameBoardProps {
  gameId: string;
  playerId: string;
}

const GameBoard = ({ gameId, playerId }: GameBoardProps) => {
  const userHasRefreshedPage = useRef(false);
  const context = useWebSocket();
  const { disconnect, subscribeToGameEvent, connected, connect } = context;
  const { placeShips, makeMove } = useGame();
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
    useState<ConnectionEvent>();
  const [isYourTurn, setIsYourTurn] = useState<boolean>(false);
  const [shotMessage, setShotMessage] = useState<string>("");
  const [gameStartOrEndData, setGameStartOrEndData] =
    useState<GameStartOrEnd | null>(null);

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

      const handleConnectionEvent = (data: ConnectionEvent) => {
        console.log("In connection EVENT");
        console.log("Connection event data: ", data);
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
      connect(Number(gameId));
    } else {
      setupSubscriptions();
    }

    if (userHasRefreshedPage.current) {
      //Implement gamestate fetch function.
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
    opponenstShotsAtYourBoard,
    shotsAtOpponent,
  ]);

  useEffect(() => {
    console.log(
      "Shots updated:",
      opponenstShotsAtYourBoard.filter((shot) => shot !== null)
    );
  }, [opponenstShotsAtYourBoard]);

  useEffect(() => {}, [connected, gameId]);

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
      let prevInfoMessage = infoMessage;
      setInfoMessage("You can't reset ships after placing them");
      setTimeout(() => setInfoMessage(prevInfoMessage), 6000);
      return;
    }
    setPlacedShips([]);
    setShips(initialShipsStateArray);
  };

  const confirmShips = async () => {
    if (!shipsVerified()) {
      return;
    }

    let shipsWithLongId: DraggableShip[] = placedShips.map((ship) => ({
      ...ship,
      id: ship.id.slice(-1),
    }));
    let success = await placeShips(
      Number(gameId),
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
          <GameBoardButton
            shipsPlaced={shipsPlaced}
            label="Reset ships"
            onButtonClick={resetShips}
          />
          <GameBoardButton
            shipsPlaced={shipsPlaced}
            label="Confirm ships"
            onButtonClick={confirmShips}
          />
          <GameBoardButton
            shipsPlaced={false}
            label="Connect to chat"
            onButtonClick={() => {
              console.log("Chat opened");
            }}
          />
        </div>
        <div className="flex-[2_1_0%] flex bg-white justify-center items-center text-xl gap-8"></div>
      </footer>
    </div>
  );
};
export default GameBoard;
