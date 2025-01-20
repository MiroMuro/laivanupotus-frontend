const useShip = () => {
  const getOffsetCoords = (
    direction: string,
    cellId: string,
    height: number,
    width: number
  ) => {
    let [row, col] = cellId.slice(5).split("-").map(Number);
    if (direction === "vertical") {
      row = getOffsetRow(height, row);
    } else {
      col = getOffsetCol(width, col);
    }
    return { row, col };
  };
  const getOffsetRow = (height: number, row: number) => {
    let offsetRow = Math.floor((height - 1) / 2);

    return Math.max(0, row - offsetRow);
  };
  const getOffsetCol = (width: number, col: number) => {
    let offsetCol = Math.floor((width - 1) / 2);
    return Math.max(0, col - offsetCol);
  };

  return { getOffsetCoords };
};

export default useShip;
