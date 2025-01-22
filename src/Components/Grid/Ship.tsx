import type { Ship } from "../../Types/interfaces";
import { useDraggable } from "@dnd-kit/core";
interface ShipProps {
  battleship: Ship;
}
const Ship = ({ battleship }: ShipProps) => {
  const { id, type, coordinates, direction, isSunk } = battleship;
  console.log("direction", direction);
  let height, width;

  if (direction === "vertical") {
    width = 1;
    height = type;
  } else {
    width = type;
    height = 1;
  }

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: {
      ...battleship,
      height: height,
      width: width,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`bg-green-400 border-2 border-black z-10 `}
      style={{ ...style, height: `${height * 40}px`, width: `${width * 40}px` }}
    ></div>
  );
};

export default Ship;
