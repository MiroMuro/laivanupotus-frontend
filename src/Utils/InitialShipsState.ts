import { Ship, ShipType } from "../Types/interfaces";
const initialShipsStateArray: Ship[] = [
  {
    id: "ship-1x5",
    type: ShipType.CARRIER,
    coordinates: [],
    direction: "vertical",
    isSunk: false,
  },
  {
    id: "ship-1x4",
    type: ShipType.BATTLESHIP,
    coordinates: [],
    direction: "vertical",
    isSunk: false,
  },
  {
    id: "ship-1x3",
    type: ShipType.CRUISER,
    coordinates: [],
    direction: "vertical",
    isSunk: false,
  },

  {
    id: "ship-1x2",
    type: ShipType.DESTROYER,
    coordinates: [],
    direction: "vertical",
    isSunk: false,
  },
  {
    id: "ship-1x1",
    type: ShipType.WARBOAT,
    coordinates: [],
    direction: "vertical",
    isSunk: false,
  },
];

export default initialShipsStateArray;
