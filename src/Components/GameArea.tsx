import { DndContext, closestCorners } from "@dnd-kit/core";
import Grid from "./GameAreaComponents/Grid";
import OpponentsGrid from "./GameAreaComponents/OpponentsGrid";
import Ships from "./GameAreaComponents/Ships";
import useShip from "../Utils/UseShip";
import { DraggableShip, Move, Ship } from "../Types/interfaces";
import { useState } from "react";
import useGame from "../Utils/useGame";
interface GameAreaProps {
  ships: Ship[];
  placedShips: DraggableShip[];
  setPlacedShips: React.Dispatch<React.SetStateAction<DraggableShip[]>>;
  shotsAtOpponent: Move[];
  setShotsAtOpponent: React.Dispatch<React.SetStateAction<Move[]>>;
  playerId: string;
  gameId: string;
  setInfoMessage: React.Dispatch<React.SetStateAction<string>>;
  setShips: React.Dispatch<React.SetStateAction<Ship[]>>;
  opponentsShotsAtYourBoard: Move[];
  isYourTurn: boolean;
}
const GameArea = (props: GameAreaProps) => {
  const { makeMove } = useGame();
  const {
    ships,
    placedShips,
    setPlacedShips,
    shotsAtOpponent,
    setShotsAtOpponent,
    playerId,
    gameId,
    setInfoMessage,
    setShips,
    opponentsShotsAtYourBoard,
    isYourTurn,
  } = props;

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

  return (
    <div className="flex  flex-row justify-around align-middle">
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <Ships ships={ships} />
        <Grid
          label="Your board"
          placedShips={placedShips}
          opponentsShotsAtYourBoard={opponentsShotsAtYourBoard}
        />
        <OpponentsGrid
          label="Opponents board"
          isYourTurn={isYourTurn}
          shootAtEnemyCell={shootAtEnemyCell}
          shotsAtOpponent={shotsAtOpponent}
        />
      </DndContext>
    </div>
  );
};

export default GameArea;
