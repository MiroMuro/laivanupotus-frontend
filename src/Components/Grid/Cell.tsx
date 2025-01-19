interface CellProps {
  id: string;
}
const Cell = ({ id }: CellProps) => {
  console.log(id);
  let regex = /^cell-[0-9]-[0-9]$/;
  if (regex.test(id)) {
    return <td id={id} className="border-2 border-black w-10 h-10"></td>;
  }
  return (
    <td className="border-2 border-black w-10 h-10">Invalid Cell. Check ID!</td>
  );
};

export default Cell;
