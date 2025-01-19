import type { Ship as ShipType } from "../../Types/interfaces";
import Ship from "./Ship";
import { useState } from "react";
const Ships = ({ ships }: { ships: ShipType[] }) => {
  const [shipsOrientation, setShipsOrientation] = useState<
    "horizontal" | "vertical"
  >("horizontal");
  const [rotatableShips, setRotatableShips] = useState<ShipType[]>(ships);

  const rotateShips = () => {
    setShipsOrientation(
      shipsOrientation === "vertical" ? "horizontal" : "vertical"
    );
    setRotatableShips(
      rotatableShips.map((ship) => ({ ...ship, direction: shipsOrientation }))
    );
  };

  console.log("Rotatable ships", rotatableShips);
  console.log("Ships orientation", shipsOrientation);
  return (
    <div className="rounded-md w-80 border-4 h-full border-gray-400 flex flex-col">
      <button
        className="w-5/6 mt-2 rounded-md mx-5 h-12  border-4 border-gray-400"
        onClick={rotateShips}
      >
        Rotate ships
      </button>
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
