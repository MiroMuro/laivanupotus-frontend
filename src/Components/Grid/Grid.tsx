import Cell from "./Cell";
import { DraggableShip } from "../../Types/interfaces";
interface GridProps {
  label: string;
  placedShips: DraggableShip[];
}
const Grid = ({ label, placedShips }: GridProps) => {
  const rows = Array(10).fill(null);
  const cols = Array(10).fill(null);

  return (
    <div>
      <label className="block text-center text-xl">{label}</label>
      <table className="border-4 relative w-auto h-auto border-gray-400 ">
        <tbody>
          {rows.map((_, rowIndex) => (
            <tr key={rowIndex}>
              {cols.map((_, colIndex) => (
                <Cell
                  key={colIndex + rowIndex}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  placedShips={placedShips}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grid;
