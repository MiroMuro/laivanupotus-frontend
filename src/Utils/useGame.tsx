import { useAuth } from "./Authprovider";
import { useState } from "react";
import {
  NotOwnUserProfile,
  CurrentGame,
  DraggableShip,
  Move,
  GameStatus,
} from "../Types/interfaces";
import { GameDto } from "../Types/interfaces";
const useGame = () => {
  const { token } = useAuth();
  const [games, setGames] = useState<GameDto[]>([]);
  const [currentGame, setCurrentGame] = useState<CurrentGame>();
  const [creatingGameLoading, setCreatingGameLoading] = useState(false);
  const [joiningGameLoading, setJoiningGameLoading] = useState(false);
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
      //This is codethat might throw an Error.
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 20000);

      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_BASE_URL
        }/api/game/create?userId=${playerId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: abortController.signal,
        }
      );
      clearTimeout(timeoutId);

      //Detects an HTTP error.
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        switch (response.status) {
          case 409:
            throw new Error(
              errorData?.message ||
                "You are already in an active match! You cannot play multiple matches at once!"
            );
          case 404:
            throw new Error(
              errorData?.message || `User with id ${playerId} not found!`
            );
          case 403:
            throw new Error(
              errorData?.message || "You are not authorized to create a game!"
            );
          case 401:
            throw new Error(
              errorData?.message || "Unauthorized! Please login and try again!"
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
      let game = await response.json();
      //setCurrentGame(game);
      return game;
    } catch (error: unknown) {
      //If an error is detected in the try block the execution stops immediately and the catch block is executed.
      if (error instanceof Error) {
        //When we throw an Error from the catch block it basically means:
        //Lets not handle the Error here, but instead upper in the hiearchy.
        setCreatingGameLoading(false);
        if (error.name === "AbortError") {
          console.error("Failed to create a game: Timeout");
          throw new Error("Failed to create a game: Timeout");
        } else if (
          error.name === "TypeError" &&
          error.message.includes("NetworkError")
        ) {
          throw new Error(
            "Game server is currently unavailable. Please try again in a few moments."
          );
        } else {
          console.error(error);
          throw error;
        }
      }
      throw new Error("An unexpected error occurred! Please try again later!");
    } finally {
      setCreatingGameLoading(false);
    }
  };

  const joinGame = async (matchId: number, playerId: number) => {
    setJoiningGameLoading(true);
    try {
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 20000);

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
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error("Failed to join the game! Status: " + response.status);
        throw new Error("Failed to join the game!");
      }
      let game = await response.json();
      setCurrentGame(game);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setJoiningGameLoading(false);
        if (error.name === "AbortError") {
          console.error("Failed to join the game: Timeout");
          throw new Error("Failed to join the game: Request timed out!");
        } else if (
          error.name === "TypeError" &&
          error.message.includes("NetworkError")
        ) {
          throw new Error(
            "Game server is currently unavailable. Please try again in a few moments."
          );
        }
      }
      console.error(error);
    }
  };

  const placeShips = async (
    matchId: number,
    playerId: number,
    ships: DraggableShip[]
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_BASE_URL
        }/api/game/${matchId}/place-ships?userId=${playerId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ships),
        }
      );

      return response.ok;
    } catch (error) {
      console.error("Failed to place ships:", error);
      return false;
    }
  };

  const makeMove = async (
    matchId: number,
    playerId: number,
    move: Move
  ): Promise<Move> => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_BASE_URL
        }/api/game/${matchId}/make-move?userId=${playerId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(move),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to make a move! Status: " + response.status);
      }

      let responseMove = await response.json();
      return responseMove;
    } catch (error) {
      console.error("Failed to make a move:", error);
      throw new Error("Failed to make a move");
    }
  };

  const getGameStateByUserIdAndMatchId = async (
    matchId: number,
    playerId: number
  ) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACKEND_BASE_URL
        }/api/game/${matchId}/gamestate?userId=${playerId}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get game state! Status: " + response.status);
      }

      let gameState = await response.json();
      return gameState;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to get game state:", error);
        throw new Error("Failed to get game state");
      }
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
    setCurrentGame,
    creatingGameLoading,
    joinGame,
    joiningGameLoading,
    placeShips,
    makeMove,
    getGameStateByUserIdAndMatchId,
  };
};
export default useGame;
