import useGame from "../../Utils/useGame";
import { useAuth } from "../../Utils/Authprovider";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useWebSocket } from "../../Utils/WebSocketProvider";

const JoinGame = () => {
  const { games, fetchGames, joinGame, currentGame, joiningGameLoading } =
    useGame();
  const context = useWebSocket();
  const { connect } = context;
  const { currentUserInformation } = useAuth();
  const navigate = useNavigate();
  const playerId = currentUserInformation?.id;
  const userName = currentUserInformation?.userName;
  if (!playerId || !userName) {
    return <div>Error loading user data, please logout and login again.</div>;
  }
  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (currentGame && currentGame.status === "PLACING_SHIPS") {
      connect();
      navigate("/play/game/" + currentGame.id + "/" + playerId);
    }
  }, [currentGame?.status, navigate]);

  return (
    <div className="h-3/4 w-1/4 bg-battleship-blue-light text-white rounded-xl flex flex-col justify-start items-center border-4 border-gray-400">
      <h1 className="text-3xl border-b-4 border-gray-400 text-center w-full py-4">
        Available games
      </h1>
      {games.length <= 0 && <p>No games available</p>}
      {games.length > 0 && (
        <table className="w-full">
          <tbody>
            <tr className="border-b-4 border-gray-400 bg-battleship-blue-dark">
              <th>Game Id</th>
              <th>Host username</th>
              <th></th>
            </tr>
            {games
              .filter((game) => game.player1UserName !== userName)
              .map((game) => (
                <tr className="odd:bg-battleship-blue" key={game.id}>
                  <td className="text-center">{game.id}</td>
                  <td className="text-center">{game.player1UserName}</td>
                  <td>
                    <button onClick={() => joinGame(game.id, playerId)}>
                      Join Game
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JoinGame;
