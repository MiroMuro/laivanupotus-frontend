import Cell from "./Cell";
import { Ship } from "../../Types/interfaces";
interface GridProps {
  label: string;
  placedShips: Ship[];
}
const Grid = ({ label, placedShips }: GridProps) => {
  const rows = Array(10).fill(null);
  const cols = Array(10).fill(null);

  return (
    <div>
      <label className="block text-center text-xl">{label}</label>
      <table className="border-4 relative w-auto h-auto border-gray-400 ">
        {rows.map((_, rowIndex) => (
          <tr>
            {cols.map((_, colIndex) => (
              <Cell
                rowIndex={rowIndex}
                colIndex={colIndex}
                placedShips={placedShips}
              />
            ))}
          </tr>
        ))}
      </table>
    </div>
  );
};

export default Grid;
