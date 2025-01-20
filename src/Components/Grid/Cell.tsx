interface CellProps {
  placedShips: Ship[];
  rowIndex: number;
  colIndex: number;
}
import { useDroppable } from "@dnd-kit/core";
import { Ship } from "../../Types/interfaces";
const Cell = ({ placedShips, rowIndex, colIndex }: CellProps) => {
  let id = `cell-${rowIndex}-${colIndex}`;
  const { setNodeRef } = useDroppable({ id: id });
  let regex = /^cell-[0-9]-[0-9]$/;
  if (regex.test(id)) {
    return (
      <td
        id={id}
        ref={setNodeRef}
        className="border-2 border-black w-10 h-10 text-xs"
      >
        {id}
        {placedShips.length != 0 &&
          placedShips.map((ship) => {
            {
              /*All ships in the placedShips array have coordinates and dimesions mapped to them */
            }
            if (
              ship.coordinates![0].y === rowIndex &&
              ship.coordinates![0].x === colIndex
            ) {
              return (
                <div
                  key={ship.id}
                  className="bg-green-400 absolute"
                  style={{
                    height: `${ship.height! * 40}px`,
                    width: `${ship.width! * 40}px`,
                  }}
                ></div>
              );
            }
          })}
      </td>
    );
  }
  return (
    <td key={id} ref={setNodeRef} className="border-2 border-black w-10 h-10">
      Invalid Cell. Check ID!
    </td>
  );
};

export default Cell;
