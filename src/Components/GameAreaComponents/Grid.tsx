import Cell from "./Cell";
import { DraggableShip, Move } from "../../Types/interfaces";
interface GridProps {
  label: string;
  placedShips: DraggableShip[];
  opponentsShotsAtYourBoard: Move[];
}
const Grid = ({ label, placedShips, opponentsShotsAtYourBoard }: GridProps) => {
  const grid = Array.from({ length: 10 }, (_, rowIndex) =>
    Array.from({ length: 10 }, (_, colIndex) => {
      const index = rowIndex * 10 + colIndex;
      return opponentsShotsAtYourBoard[index];
    })
  );
  console.log("Opponents shots at your board", opponentsShotsAtYourBoard);
  return (
    <div>
      <label className="block text-center text-xl">{label}</label>
      <table className="border-4 relative w-auto h-auto border-gray-400 ">
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((shot, colIndex) => (
                <Cell
                  key={colIndex + rowIndex}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  placedShips={placedShips}
                  shot={shot}
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
