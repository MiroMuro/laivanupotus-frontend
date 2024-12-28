import { useAuth } from "./Authprovider";
import { useEffect, useState } from "react";
const useGame = () => {
  const { token } = useAuth();
  const [games, setGames] = useState([]);

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

      console.log("response", response);
      let games = await response.json();
      console.log("games", games);
      setGames(games);
    } catch (error) {
      console.error(error);
    }
  };

  return { games, fetchGames };
};
export default useGame;
