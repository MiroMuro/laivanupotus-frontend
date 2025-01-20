import OpponentsCell from "./OpponentsCell";

interface GridProps {
  label: string;
}
const OpponentsGrid = ({ label }: GridProps) => {
  const rows = Array(10).fill(null);
  const cols = Array(10).fill(null);

  return (
    <div>
      <label className="block text-center text-xl">{label}</label>
      <table className="border-4 relative w-auto h-auto border-gray-400 ">
        {rows.map((row, rowIndex) => (
          <tr>
            {cols.map((col, colIndex) => {
              const id = `cell-${rowIndex}-${colIndex}`;
              return <OpponentsCell id={id} />;
            })}
          </tr>
        ))}
      </table>
    </div>
  );
};

export default OpponentsGrid;
