const Grid = () => {
  const rows = Array(10).fill(null);
  const cols = Array(10).fill(null);

  return (
    <table className="border-4 w-auto h-auto border-gray-400 ">
      {rows.map((row, rowIndex) => (
        <tr>
          {cols.map((col, colIndex) => (
            <td className="w-10 h-10 border-red-600 border-2"></td>
          ))}
        </tr>
      ))}
    </table>
  );
};

export default Grid;
