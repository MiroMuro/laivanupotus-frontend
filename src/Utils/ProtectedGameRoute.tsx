import { useState, useEffect } from "react";
import { useAuth } from "./Authprovider";
import { useParams } from "react-router";
import Game from "../Pages/Game";
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

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          switch (response.status) {
            case 401:
              throw new Error(
                errorData?.message ||
                  "You are not authorized to play this match!"
              );
            case 500:
              throw new Error(
                errorData?.message ||
                  "Internal server error! Please try again later!"
              );
            default:
              throw new Error(
                errorData?.message ||
                  `Failed to create game: ${response.statusText}`
              );
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
        throw new Error(
          "An unexpected error occurred! Please try again later!"
        );
      }
    };

    checkAuthorization();
  }, [gameId]);

  return isAuthorized ? (
    <Game gameId={gameId!} playerId={playerId!} />
  ) : (
    <NotAuthenticated />
  );
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
