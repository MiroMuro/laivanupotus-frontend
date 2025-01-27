interface CellProps {
  id: string;
}
const OpponentsCell = ({ id }: CellProps) => {
  let regex = /^cell-[0-9]-[0-9]$/;
  if (regex.test(id)) {
    return (
      <td key={id} id={id} className="border-2 border-black w-10 h-10 text-xs">
        {id}
      </td>
    );
  }
  return (
    <td key={id} className="border-2 border-black w-10 h-10">
      Invalid Cell. Check ID!
    </td>
  );
};

export default OpponentsCell;
