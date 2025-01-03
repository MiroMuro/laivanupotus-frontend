import { useAuth } from "./Authprovider";
import { useEffect, useState } from "react";
import { NotOwnUserProfile, CurrentGame } from "../Types/interfaces";
import { GameDto } from "../Types/interfaces";
const useGame = () => {
  const { token } = useAuth();
  const [games, setGames] = useState<GameDto[]>([]);
  const [currentGame, setCurrentGame] = useState<CurrentGame>();
  const [creatingGameLoading, setCreatingGameLoading] = useState(false);
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

  const createGame = async (playerId: number) => {
    setCreatingGameLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_BASE_URL
        }/api/game/create?userId=${playerId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCreatingGameLoading(false);
      let game = await response.json();
      setCurrentGame(game);
    } catch (error) {
      setCreatingGameLoading(false);
      console.error(error);
    }
  };

  const joinGame = async (matchId: number, playerId: number) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_BASE_URL
        }/api/game/${matchId}/join?userId=${playerId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let activeGame = await response.json();
      setCurrentGame(activeGame);
    } catch (error) {
      console.error(error);
    }
  };
  return {
    games,
    fetchGames,
    fethUsersForLeaderboard,
    leaderboardUsers,
    setLeaderboardUsers,
    createGame,
    currentGame,
    creatingGameLoading,
    joinGame,
  };
};
export default useGame;
