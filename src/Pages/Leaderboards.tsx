import { useEffect, useState } from "react";
import { NotOwnUserProfile } from "../Types/interfaces";
import useGame from "../Utils/useGame";
const Leaderboards = () => {
  const { fethUsersForLeaderboard, leaderboardUsers } = useGame();
  useEffect(() => {
    fethUsersForLeaderboard();
  }, []);

  const convertIsoDateToTime = (isoDate: Date) => {
    return new Date(isoDate).toDateString();
  };
  console.log(leaderboardUsers);
  return (
    <div className="h-2/3 w-1/3 bg-battleship-blue-light text-white rounded-lg border-4 border-gray-400 flex flex-col items-center">
      <h1 className="text-3xl w-full text-center py-4 border-b-4 border-gray-400">
        Battleships leaderboards
      </h1>
      {leaderboardUsers.length === 0 && <p>No players found</p>}
      {leaderboardUsers.length > 0 && (
        <table className="w-full">
          {" "}
          <tr className="w-full text-xl bg-battleship-blue-dark border-b-4 border-gray-400">
            <th>Username</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Winrate</th>
            <th>Last online</th>
          </tr>
          {leaderboardUsers.map((user: NotOwnUserProfile) => (
            <tr>
              <th>{user.userName}</th>
              <th>{user.gamesWon}</th>
              <th>{user.gamesLost}</th>
              <th>
                {Math.floor(user.gamesWon / (user.gamesLost + user.gamesWon))}%
              </th>
              <th>
                {user.lastLogin
                  ? convertIsoDateToTime(user.lastLogin)
                  : "Never played"}
              </th>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
};
export default Leaderboards;
