import type { Ship } from "../../Types/interfaces";
interface ShipProps {
  battleship: Ship;
}
const Ship = ({ battleship }: ShipProps) => {
  const { type, coordinates, direction, isSunk } = battleship;
  let height, width;

  if (direction === "vertical") {
    width = 1;
    height = type;
  } else {
    width = type;
    height = 1;
  }

  return (
    <div
      className={`bg-green-400 border-2 border-black `}
      style={{ height: `${height * 40}px`, width: `${width * 40}px` }}
    ></div>
  );
};

export default Ship;
