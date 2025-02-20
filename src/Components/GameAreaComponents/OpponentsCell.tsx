import { Move } from "../../Types/interfaces";
import Miss from "../../assets/Miss.png";
import Hit from "../../assets/Hit.png";
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

  let regex = /^cell-[0-9]-[0-9]$/;
  if (regex.test(id) && shot) {
    return <ShotCell shot={shot} id={id} />;
  } else if (regex.test(id)) {
    return (
      <NormalCell
        id={id}
        isYourTurn={isYourTurn}
        handleCellClick={handleCellClick}
      />
    );
  } else {
    return <InvalidCell id={id} />;
  }
};

const ShotCell = ({ shot, id }: { shot: Move; id: string }) => {
  return (
    <td
      key={id}
      id={id}
      className={`border-2 border-black w-10 h-10 text-xs bg-battleship-blue-lighter cursor-not-allowed`}
    >
      <span className="flex items-center justify-center text-xl">
        {shot.isHit ? (
          <div>
            <img src={Hit} />
          </div>
        ) : (
          <div>
            <img src={Miss} />
          </div>
        )}
      </span>
    </td>
  );
};
const NormalCell = ({
  id,
  isYourTurn,
  handleCellClick,
}: {
  id: string;
  isYourTurn: boolean;
  handleCellClick: (cellId: string) => void;
}) => {
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
};

const InvalidCell = ({ id }: { id: string }) => {
  return (
    <td
      key={id}
      className={`border-2 border-black w-10 h-10 bg-battleship-blue-light cursor-not-allowed`}
    >
      Invalid Cell. Check the cells ID!
    </td>
  );
};
export default OpponentsCell;
