import { Coordinate } from "../Types/interfaces";
const useShip = () => {
  const getShipStartingCellCoords = (
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

  const getShipCoords = (
    direction: string,
    startingCol: number,
    startingRow: number,
    height: number,
    width: number
  ): Coordinate[] => {
    let coords = [];

    if (direction === "vertical") {
      for (let i = startingRow; i < startingRow + height; i++) {
        coords.push({ y: i, x: startingCol });
      }
    } else {
      for (let i = startingCol; i < startingCol + width; i++) {
        coords.push({ y: startingRow, x: i });
      }
    }

    return coords;
  };
  return { getShipStartingCellCoords, getShipCoords };
};

export default useShip;
