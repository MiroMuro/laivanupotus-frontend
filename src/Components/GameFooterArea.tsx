import { DraggableShip, Ship } from "../Types/interfaces";
import GameBoardButton from "./Grid/GameBoardButton";
import useGame from "../Utils/useGame";
import { useState } from "react";
interface gameFooterAreaProps {
  placedShips: DraggableShip[];
  setPlacedShips: React.Dispatch<React.SetStateAction<DraggableShip[]>>;

  gameId: string;
  playerId: string;
  setInfoMessage: React.Dispatch<React.SetStateAction<string>>;
  setShips: React.Dispatch<React.SetStateAction<Ship[]>>;
  initialShipsStateArray: Ship[];
  infoMessage: string;
}

const GameFooterArea = (props: gameFooterAreaProps) => {
  const {
    placedShips,
    setPlacedShips,

    gameId,
    playerId,
    setInfoMessage,
    setShips,
    initialShipsStateArray,
    infoMessage,
  } = props;
  const [shipsPlaced, setShipsPlaced] = useState<boolean>(false);

  const { placeShips } = useGame();
  const confirmShips = async () => {
    if (!shipsVerified()) {
      return;
    }

    let shipsWithLongId: DraggableShip[] = placedShips.map((ship) => ({
      ...ship,
      id: ship.id.slice(-1),
    }));
    let success = await placeShips(
      Number(gameId),
      Number(playerId),
      shipsWithLongId
    );

    if (success) {
      setShipsPlaced(true);
      setInfoMessage(
        "Ships placed succesfully. Waiting for opponent to place ships"
      );
    } else {
      setInfoMessage("Error placing ships. Try again");
    }
  };

  const shipsVerified = () => {
    return verifyAllShipsPlaced() && verifyShipsNotAlreadyPlaced();
  };

  const verifyAllShipsPlaced = () => {
    if (placedShips.length !== initialShipsStateArray.length) {
      console.log("Placed ships length:", placedShips.length);
      console.log("Initial ships length:", initialShipsStateArray.length);
      setInfoMessage("Place all ships before confirming");
      return false;
    }
    return true;
  };

  const verifyShipsNotAlreadyPlaced = () => {
    if (shipsPlaced) {
      setInfoMessage("Ships already placed");
      return false;
    }
    return true;
  };

  const resetShips = () => {
    if (shipsPlaced) {
      let prevInfoMessage = infoMessage;
      setInfoMessage("You can't reset ships after placing them");
      setTimeout(() => setInfoMessage(prevInfoMessage), 6000);
      return;
    }
    setPlacedShips([]);
    setShips(initialShipsStateArray);
  };
  return (
    <footer className="w-full h-1/6 flex justify-around text-center">
      <div className="flex-[1_1_0%] flex justify-around items-center text-xl gap-8">
        <GameBoardButton
          shipsPlaced={shipsPlaced}
          label="Reset ships"
          onButtonClick={resetShips}
        />
        <GameBoardButton
          shipsPlaced={shipsPlaced}
          label="Confirm ships"
          onButtonClick={confirmShips}
        />
        <GameBoardButton
          shipsPlaced={false}
          label="Connect to chat"
          onButtonClick={() => {
            console.log("Chat opened");
          }}
        />
      </div>
      <div className="flex-[2_1_0%] flex bg-white justify-center items-center text-xl gap-8"></div>
    </footer>
  );
};
export default GameFooterArea;
