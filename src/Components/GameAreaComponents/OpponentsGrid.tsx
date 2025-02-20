import { Move } from "../../Types/interfaces";
import OpponentsCell from "./OpponentsCell";
interface GridProps {
  label: string;
  isYourTurn: boolean;
  shootAtEnemyCell: (x: number, y: number) => Promise<void>;
  shotsAtOpponent: Move[];
}
const OpponentsGrid = ({
  label,
  isYourTurn,
  shootAtEnemyCell,
  shotsAtOpponent,
}: GridProps) => {
  const grid = Array.from({ length: 10 }, (_, rowIndex) =>
    Array.from({ length: 10 }, (_, colIndex) => {
      const index = rowIndex * 10 + colIndex;
      return shotsAtOpponent[index];
    })
  );

  return (
    <div>
      <label className="block text-center text-xl">{label}</label>
      <table className="border-4 relative w-auto h-auto border-gray-400 ">
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((shot, colIndex) => {
                const id = `cell-${rowIndex}-${colIndex}`;
                return (
                  <OpponentsCell
                    key={id}
                    id={id}
                    isYourTurn={isYourTurn}
                    shootAtEnemyCell={shootAtEnemyCell}
                    shot={shot}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OpponentsGrid;
