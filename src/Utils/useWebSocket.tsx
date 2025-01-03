import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client, Frame, StompSubscription } from "@stomp/stompjs";
import { useAuth } from "./Authprovider";
import { WebSocketHook } from "../Types/interfaces";

const useWebSocket = (): WebSocketHook => {
  const { token } = useAuth();
  const stompClient = useRef<Client | null>(null);
  const subscriptions = useRef<{
    [key: string]: {
      game: StompSubscription;
      playerJoined: StompSubscription;
      move: StompSubscription;
    };
  }>({});
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    //Initialize the Stomp client.
    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_BACKEND_BASE_URL}/ws-battleship`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setConnected(true);
      console.log("Connected to websocket");
    };

    client.onDisconnect = () => {
      setConnected(false);
      console.log("Disconnected from websocket");
    };

    client.activate();
    stompClient.current = client;

    return () => {
      client.deactivate();
    };
  }, [token]);

  const subscribeToGame = (gameId: number, callback: (data: any) => void) => {
    if (!stompClient.current?.connected) return;

    //Sub to various game events
    const gameSubscription = stompClient.current.subscribe(
      `/topic/game/${gameId}`,
      (message) => {
        const data = JSON.parse(message.body);
        callback(data);
      }
    );

    const playerJoinedSubscription = stompClient.current.subscribe(
      `/topic/game/${gameId}/player-joined`,
      (message) => {
        const data = JSON.parse(message.body);
        callback(data);
      }
    );

    const moveSubscription = stompClient.current.subscribe(
      `/topic/game/${gameId}/move`,
      (message) => {
        const data = JSON.parse(message.body);
        callback(data);
      }
    );

    subscriptions.current[gameId] = {
      game: gameSubscription,
      playerJoined: playerJoinedSubscription,
      move: moveSubscription,
    };
  };
  const unsubscribeFromGame = (gameId: number) => {
    if (subscriptions.current[gameId]) {
      Object.values(subscriptions.current[gameId]).forEach((subscription) => {
        subscription.unsubscribe();
      });
      delete subscriptions.current[gameId];
    }
  };

  return { subscribeToGame, unsubscribeFromGame, connected };
};

export default useWebSocket;
