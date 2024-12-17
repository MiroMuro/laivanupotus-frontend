const Home = () => {
  return (
    <div className="w-1/2 h-2/3 flex flex-col items-center  text-black rounded-md bg-battleship-blue-light border-4 border-gray-400">
      <h2 className="h-1/5 w-full text-center py-2 text-3xl text-white border-b-4 border-gray-400">
        Welcome aboard the high seas captain!
      </h2>
      <div className="h-2/5 border-b-4 border-gray-400 w-full">
        <h2 className="w-full text-left p-2 text-xl text-white ">
          What is battleships?
        </h2>
        <p className="p-2 text-white text-lg">
          Battleships is a strategy type guessing game for two players. It is
          played on ruled 10x10 grids on which each player's fleet of warships
          are marked. The locations of the fleets are concealed from the other
          player. Players alternate turns calling "shots" at the other player's
          ships, and the objective of the game is to destroy the opposing
          player's fleet.
        </p>
      </div>
      <div className="h-2/5 w-full">
        <h2 className="w-full text-left p-2 text-xl text-white ">
          How to play?
        </h2>
        <p className="p-2 text-white text-lg">
          Create an account or login to an existing account. Once logged in, you
          can create a match and Invite your friends, or join a match that has
          been created by someone else. Once in a match, you can place your
          ships on the board and start playing.
        </p>
      </div>
    </div>
  );
};
export default Home;
