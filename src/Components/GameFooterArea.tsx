const GameFooterArea = () => {
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
