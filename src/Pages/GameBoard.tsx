import Grid from "../Components/Grid/Grid";
import Ships from "../Components/Grid/Ships";
const GameBoard = () => {
  return (
    <div className="bg-battleship-blue-light h-5/6 py-4 my-6 w-5/6 border-4 border-gray-400 rounded-xl text-white flex flex-col justify-between">
      <header className="w-full flex flex-row justify-center text-center">
        <p className="text-xl">Place your ships!</p>
      </header>
      <div className="flex  flex-row justify-around align-middle">
        <Ships />
        <Grid />
        <Grid />
      </div>
      <div className="w-1/4 h-1/4  rounded-xl flex-row">
        <button className="bg-battleship-blue-dark">Reset ships</button>
        <button className="bg-battleship-blue-dark">Confirm ships</button>
      </div>
    </div>
  );
};
export default GameBoard;
