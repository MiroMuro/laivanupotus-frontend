import Grid from "../Components/Grid/Grid";
import OpponentsGrid from "../Components/Grid/OpponentsGrid";
import Ships from "../Components/Grid/Ships";
import useShip from "../Utils/UseShip";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { Ship, ShipType } from "../Types/interfaces";
import { useState } from "react";
const GameBoard = () => {
  const [placedShips, setPlacedShips] = useState<Ship[]>([]);
  const [ships, setShips] = useState<Ship[]>([
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
  ]);
  const { getOffsetCoords } = useShip();
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    console.log("Active", active);
    console.log("Over", over);

    if (!over) return;

    let { direction, id, height, width } = active.data.current;
    let draggedShip = ships.find((ship) => ship.id === id);

    if (!draggedShip) return;

    let { row, col } = getOffsetCoords(direction, over.id, height, width);

    return true;
  };

  return (
    <div className="bg-battleship-blue-light h-5/6 py-4 my-6 w-5/6 border-4 border-gray-400 rounded-xl text-white flex flex-col justify-between">
      <header className="w-full flex flex-row justify-center text-center">
        <p className="text-xl">Place your ships!</p>
      </header>
      <div className="flex  flex-row justify-around align-middle">
        <DndContext
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <Ships ships={ships} />
          <Grid label="Your board" placedShips={placedShips} />
          <OpponentsGrid label="Opponents board" />
        </DndContext>
      </div>
      <div className="w-1/4 h-1/6  rounded-xl flex-row">
        <button className="bg-battleship-blue-dark">Reset ships</button>
        <button className="bg-battleship-blue-dark">Confirm ships</button>
      </div>
    </div>
  );
};
export default GameBoard;
