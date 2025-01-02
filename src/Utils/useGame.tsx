import { useAuth } from "./Authprovider";
import { useEffect, useState } from "react";
import { NotOwnUserProfile } from "../Types/interfaces";
const useGame = () => {
  const { token } = useAuth();
  const [games, setGames] = useState([]);
  const [leaderboardUsers, setLeaderboardUsers] = useState<NotOwnUserProfile[]>(
    []
  );
  const fetchGames = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/game/available`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let games = await response.json();
      setGames(games);
    } catch (error) {
      console.error(error);
    }
  };

  const fethUsersForLeaderboard = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/leaderboard`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let users = await response.json();
      setLeaderboardUsers(users);
    } catch (error) {
      console.error(error);
    }
  };

  return { games, fetchGames, fethUsersForLeaderboard, leaderboardUsers };
};
export default useGame;
