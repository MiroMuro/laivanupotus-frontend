interface CellProps {
  placedShips: DraggableShip[];
  rowIndex: number;
  colIndex: number;
}
import { useDroppable } from "@dnd-kit/core";
import { DraggableShip } from "../../Types/interfaces";
const Cell = ({ placedShips, rowIndex, colIndex }: CellProps) => {
  let id = `cell-${rowIndex}-${colIndex}`;
  const { setNodeRef } = useDroppable({ id: id });
  let regex = /^cell-[0-9]-[0-9]$/;
  if (regex.test(id)) {
    return (
      <td
        id={id}
        ref={setNodeRef}
        className="border-2 border-black w-10 h-10 text-xs relative"
      >
        <span className="absolute inset-0 flex items-center justify-center text-xs opacity-50">
          {id}
        </span>

        {placedShips.length != 0 &&
          placedShips.map((ship) => {
            {
              /* mx-5 my-4 flex gap-2 flex-col justify-center items-start 
              All ships in the placedShips array have coordinates and dimesions mapped to them */
            }
            if (
              ship.coordinates![0].y === rowIndex &&
              ship.coordinates![0].x === colIndex
            ) {
              return (
                <div
                  key={ship.id}
                  className="bg-green-400 absolute top-0 left-0 transition-all duration-200 z-10 rounded-sm hover:brightness-110"
                  style={{
                    height: `${ship.height! * 40}px`,
                    width: `${ship.width! * 40}px`,
                    transform: `translate(0, 0)`,
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
