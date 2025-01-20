import type { Ship as ShipType } from "../../Types/interfaces";
import Ship from "./Ship";
import { useState, useEffect } from "react";
const Ships = ({ ships }: { ships: ShipType[] }) => {
  const [shipsOrientation, setShipsOrientation] = useState<
    "horizontal" | "vertical"
  >("horizontal");

  const [rotatableShips, setRotatableShips] = useState<ShipType[]>(ships);

  useEffect(() => {
    setRotatableShips(ships);
  }, [ships]);

  const rotateShips = () => {
    setShipsOrientation(
      shipsOrientation === "vertical" ? "horizontal" : "vertical"
    );
    setRotatableShips(
      rotatableShips.map((ship) => ({ ...ship, direction: shipsOrientation }))
    );
  };

  return (
    <div className="rounded-md w-80 border-4 h-full border-gray-400 flex flex-col items-center ">
      <div className="flex w-5/6 my-4 flex-col rounded-xl h-12 bg-battleship-blue-light justify-end items-center border-2 border-gray-400  shadow-xl transition transformation ease-in-out 200ms active:scale-75 hover:scale-105">
        <button
          className="w-full rounded-xl mx-5 h-3/4  bg-battleship-blue p-1 relative "
          onClick={rotateShips}
        >
          <p className="text-lg text-white absolute -top-2 left-1/2 -translate-x-1/2">
            Rotate ships
          </p>
        </button>
      </div>

      <div
        className={`mx-5 my-4 flex gap-2 ${
          shipsOrientation === "vertical"
            ? "flex-col justify-center items-start"
            : "flex-row justify-start items-start"
        } `}
      >
        {rotatableShips.map((ship) => (
          <Ship battleship={ship} />
        ))}
      </div>
    </div>
  );
};

export default Ships;
