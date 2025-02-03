import Grid from "../Components/Grid/Grid";
import OpponentsGrid from "../Components/Grid/OpponentsGrid";
import Ships from "../Components/Grid/Ships";
import useShip from "../Utils/UseShip";
import { closestCorners, DndContext } from "@dnd-kit/core";
import {
  Ship,
  ShipType,
  DraggableShip,
  GameStartOrEnd,
  matchStatus,
  Move,
} from "../Types/interfaces";
import { useEffect, useState } from "react";
import { useWebSocket } from "../Utils/WebSocketProvider";
import useGame from "../Utils/useGame";

interface GameBoardProps {
  gameId: string;
  playerId: string;
}

const GameBoard = ({ gameId, playerId }: GameBoardProps) => {
  const context = useWebSocket();

  const [shotsAtOpponent, setShotsAtOpponent] = useState<Move[]>(
    Array(100).fill(null)
  );
  const [opponenstShotsAtYourBoard, setOpponentShotsAtYourBoard] = useState<
    Move[]
  >(Array(100).fill(null));
  const [shipsPlaced, setShipsPlaced] = useState<boolean>(false);
  const [infoMessage, setInfoMessage] = useState<string>("Place your ships!");
  const [isYourTurn, setIsYourTurn] = useState<boolean>(false);
  const [gameStartOrEndData, setGameStartOrEndData] =
    useState<GameStartOrEnd | null>(null);
  const { disconnect, subscribeToGameEvent, connected } = context;

  useEffect(() => {
    if (!connected) return;

    const handleGameEvent = (data: any) => {
      console.log("Game event", data);

      setGameStartOrEndData(data);

      if (data.status === matchStatus.IN_PROGRESS) {
        setInfoMessage("Game started!");
        const isCurrentPlayerTurn = data.player.id === Number(playerId);

        setIsYourTurn(isCurrentPlayerTurn);
      }

      if (data.status === matchStatus.FINISHED) {
        setInfoMessage("Game finished!");
      }
    };

    const handleMove = (data: any) => {
      const isCurrentPlayerTurn =
        data.playerBehindTheMoveId !== Number(playerId);

      if (isCurrentPlayerTurn) {
        updateShotsAtYourBoard(data);
      }

      setIsYourTurn(isCurrentPlayerTurn);
    };

    subscribeToGameEvent(Number(gameId), "game", handleGameEvent);
    subscribeToGameEvent(Number(gameId), "move", handleMove);

    return () => {
      disconnect();
    };
  }, [subscribeToGameEvent, gameId, playerId]);

  let updateShotsAtYourBoard = (move: Move) => {
    setOpponentShotsAtYourBoard((prev) => {
      const updatedShots = [...prev];
      updatedShots[move.y * 10 + move.x] = move;
      return updatedShots;
    });
  };

  useEffect(() => {
    if (!connected) {
      setInfoMessage("Disconnected from game.");
    }
  }, [connected]);
  //Debug render to verify state updates
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
  const { placeShips, makeMove } = useGame();
  const [placedShips, setPlacedShips] = useState<DraggableShip[]>([]);
  const initialShipsState: Ship[] = [
    {
      id: "ship-1x5",
      type: ShipType.CARRIER,
      coordinates: [],
      direction: "vertical",
      isSunk: false,
    },
    {
      id: "ship-1x4",
      type: ShipType.BATTLESHIP,
      coordinates: [],
      direction: "vertical",
      isSunk: false,
    },
    {
      id: "ship-1x3",
      type: ShipType.CRUISER,
      coordinates: [],
      direction: "vertical",
      isSunk: false,
    },

    {
      id: "ship-1x2",
      type: ShipType.DESTROYER,
      coordinates: [],
      direction: "vertical",
      isSunk: false,
    },
    {
      id: "ship-1x1",
      type: ShipType.WARBOAT,
      coordinates: [],
      direction: "vertical",
      isSunk: false,
    },
  ];
  const [ships, setShips] = useState<Ship[]>(initialShipsState);
  const {
    getShipStartingCellCoords,
    getShipCoords,
    doesShipCollideWithPlacedShips,
  } = useShip();

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
    setPlacedShips([]);
    setShips(initialShipsState);
  };

  const confirmShips = async (
    matchId: string,
    playerId: string,
    placedShips: DraggableShip[]
  ) => {
    verifyAllShipsPlaced();
    verifyShipsNotAlreadyPlaced();

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

  const verifyAllShipsPlaced = () => {
    if (placedShips.length !== initialShipsState.length) {
      setInfoMessage("Place all ships before confirming");
      return;
    }
  };

  const verifyShipsNotAlreadyPlaced = () => {
    if (shipsPlaced) {
      setInfoMessage("Ships already placed");
      return;
    }
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
      <header className="w-2/3 flex ml-12 flex-row justify-normal text-center">
        <p className="flex-[1_1_0%] text-xl">{infoMessage}</p>
        <p className="flex-[2_1_0%] text-xl">
          {gameStartOrEndData && (
            <>Turn: {isYourTurn ? "Your turn" : "Opponents turn"}</>
          )}
        </p>
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
      <div className="w-80 h-1/6  rounded-xl flex flex-row justify-start ml-14 gap-4">
        <div className="bg-battleship-blue-light flex flex-col justify-end border-2 border-gray-400 rounded-xl h-5/6 w-1/4 mx-4 transition transform hover:scale-105 active:scale-75">
          <button
            className="w-full rounded-xl  h-3/4  bg-battleship-blue p-1 relative"
            onClick={() => resetShips()}
          >
            <p className="text-lg text-white absolute -top-3 left-1/2 -translate-x-1/2">
              Reset ships
            </p>
          </button>
        </div>

        <div className="bg-battleship-blue-light flex flex-col justify-end border-2 border-gray-400 rounded-xl h-5/6 w-1/4 mx-4 transition transform hover:scale-105 active:scale-75">
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
      </div>
    </div>
  );
};
export default GameBoard;
