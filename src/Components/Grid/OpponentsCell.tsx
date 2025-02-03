interface CellProps {
  id: string;
  isYourTurn: boolean;
  shootAtEnemyCell: (x: number, y: number) => Promise<void>;
}
const OpponentsCell = ({ id, isYourTurn, shootAtEnemyCell }: CellProps) => {
  const handleCellClick = async (cellId: string) => {
    let [y, x] = cellId.slice(5).split("-").map(Number);
    shootAtEnemyCell(x, y);
  };

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

export default OpponentsCell;
