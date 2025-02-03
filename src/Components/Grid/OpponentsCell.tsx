import { Move } from "../../Types/interfaces";

interface CellProps {
  id: string;
  isYourTurn: boolean;
  shootAtEnemyCell: (x: number, y: number) => Promise<void>;
  shot: Move;
}
const OpponentsCell = ({
  id,
  isYourTurn,
  shootAtEnemyCell,
  shot,
}: CellProps) => {
  const handleCellClick = async (cellId: string) => {
    let [y, x] = cellId.slice(5).split("-").map(Number);
    shootAtEnemyCell(x, y);
  };
  if (shot) {
    return <ShotCell shot={shot} id={id} />;
  }
  let regex = /^cell-[0-9]-[0-9]$/;
  if (regex.test(id)) {
    return (
      <td
        key={id}
        id={id}
        className={`border-2 border-black w-10 h-10 text-xs ${
          isYourTurn
            ? "cursor-pointer transition transform hover:bg-battleship-blue-lighter"
            : "cursor-not-allowed"
        }`}
        onClick={() => handleCellClick(id)}
      >
        {id}
      </td>
    );
  }
  return (
    <td
      key={id}
      className={`border-2 border-black w-10 h-10 ${
        isYourTurn ? "hover: bg-battleship-blue-light" : "cursor-not-allowed"
      }`}
    >
      Invalid Cell. Check ID!
    </td>
  );
};
const ShotCell = ({ shot, id }: { shot: Move; id: string }) => {
  if (shot.isHit) {
    return (
      <td
        key={id}
        id={id}
        className={`border-2 border-black w-10 h-10 text-xs bg-battleship-blue-lighter cursor-not-allowed`}
      >
        <span>⭕</span>
      </td>
    );
  } else {
    return (
      <td
        key={id}
        id={id}
        className={`border-2 border-black w-10 h-10 text-xs bg-battleship-blue-lighter cursor-not-allowed`}
      >
        <span className="flex items-center justify-center text-xl">❌</span>
      </td>
    );
  }
};
export default OpponentsCell;
