import Grid from "../Components/Grid/Grid";
import OpponentsGrid from "../Components/Grid/OpponentsGrid";
import Ships from "../Components/Grid/Ships";
import useShip from "../Utils/UseShip";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { Ship, ShipType, DraggableShip } from "../Types/interfaces";
import { useState } from "react";
const GameBoard = () => {
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

      console.log("Doe this collide?: ", doesCollide);
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

  const confirmShips = () => {};

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
          <button className="w-full rounded-xl  h-3/4  bg-battleship-blue p-1 relative ">
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
