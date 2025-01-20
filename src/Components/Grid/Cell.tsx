interface CellProps {
  id: string;
  placedShips: Ship[];
}
import { useDroppable } from "@dnd-kit/core";
import { Ship } from "../../Types/interfaces";
const Cell = ({ id, placedShips }: CellProps) => {
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
        {/* {placedShips.length != 0 &&
        placedShips.map((ship)=>{

        })} */}
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
