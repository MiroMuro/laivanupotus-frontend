import { MouseEventHandler } from "react";
import { DraggableShip } from "../../Types/interfaces";

interface GameBoardButtonProps {
  shipsPlaced: boolean;
  onButtonClick: () => void;
  label: string;
}
const GameBoardButton = (props: GameBoardButtonProps) => {
  const { shipsPlaced, onButtonClick, label } = props;
  return (
    <div
      className={`bg-battleship-blue-light flex flex-col justify-end border-2 border-gray-400 rounded-xl h-5/6 w-1/4 ${
        shipsPlaced
          ? ""
          : "transition transform hover:scale-105 active:scale-75"
      }`}
    >
      <button
        className={`w-full rounded-xl  h-3/4  bg-battleship-blue p-1 relative ${
          shipsPlaced ? "cursor-not-allowed disabled" : "cursor-pointer"
        }`}
        onClick={() => onButtonClick()}
      >
        <p className="text-lg text-white absolute -top-3 left-1/2 -translate-x-1/2">
          {label}
        </p>
      </button>
    </div>
  );
};

export default GameBoardButton;
