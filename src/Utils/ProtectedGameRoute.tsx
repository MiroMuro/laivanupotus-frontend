import { useState, useEffect } from "react";
import { useAuth } from "./Authprovider";
import { useNavigate, useParams } from "react-router";
import GameBoard from "../Pages/GameBoard";
const ProtectedGameRoute = () => {
  const { token } = useAuth();
  const { gameId, playerId } = useParams();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_BASE_URL
          }/api/game/${gameId}/authorize?userId=${playerId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        response.json().then((data) => console.log(data));
        console.log(isAuthorized);

        if (!response.ok) {
          return <NotAuthenticated />;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error(error);
        <NotAuthenticated />;
      }
    };

    checkAuthorization();
  }, [gameId]);

  return isAuthorized ? <GameBoard /> : <NotAuthenticated />;
};

const NotAuthenticated = () => {
  return (
    <div className="w-96 h-36 flex flex-col items-center justify-center  text-black rounded-md bg-battleship-blue-light border-4 border-gray-400">
      <h2 className="text-xl text-white">
        You are not authorized to play this match!
      </h2>
    </div>
  );
};
export default ProtectedGameRoute;
