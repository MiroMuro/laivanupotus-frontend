import { useAuth } from "./Authprovider";
import { useEffect, useState } from "react";
const useGame = () => {
  const { token } = useAuth();
  const [games, setGames] = useState([]);
  const { user } = useAuth();
  console.log("The user is", user);
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
    } catch (error) {
      console.error(error);
    }
  };

  return { games, fetchGames, setGames };
};
export default useGame;
