interface CellProps {
  placedShips: DraggableShip[];
  rowIndex: number;
  colIndex: number;
  shot: Move;
}
import { useDroppable } from "@dnd-kit/core";
import { DraggableShip, Move } from "../../Types/interfaces";
const Cell = ({ placedShips, rowIndex, colIndex, shot }: CellProps) => {
  let id = `cell-${rowIndex}-${colIndex}`;
  const { setNodeRef } = useDroppable({ id: id });
  let regex = /^cell-[0-9]-[0-9]$/;
  if (shot) {
    console.log("SHOT HERE", shot);
  }
  if (regex.test(id)) {
    return (
      <td
        id={id}
        ref={setNodeRef}
        className="border-2 border-black w-10 h-10 text-xs relative z-10"
      >
        {shot && (
          <span className="absolute inset-0 flex items-center justify-center text-xl  z-30">
            {shot.isHit ? "⭕" : "❌"}
          </span>
        )}

        {placedShips.length != 0 &&
          placedShips.map((ship) => {
            {
              /*
              All ships in the placedShips array have coordinates and dimesions mapped to them */
            }
            if (
              ship.coordinates![0].y === rowIndex &&
              ship.coordinates![0].x === colIndex
            ) {
              return (
                <div
                  key={ship.id}
                  className="bg-green-400 absolute top-0 left-0 transition-all duration-200 z-20 rounded-sm hover:brightness-110"
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
