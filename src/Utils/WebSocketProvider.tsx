import { createContext, useContext } from "react";
import { WebSocketHook } from "../Types/interfaces";
import { useAuth } from "./Authprovider";
import { useRef, useState } from "react";
import { Client, StompSubscription } from "@stomp/stompjs";
import { SubscriptionType, SubscriptionCallback } from "../Types/interfaces";

interface WebSocketContextType extends WebSocketHook {
  connect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

  const connect = () => {
    if (stompClient.current?.connected) {
      console.log("Already connected to Stomp client");
      return;
    }

    const client = new Client({
      brokerURL: `${import.meta.env.VITE_BACKEND_BASE_URL}/ws-battleship`,
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
  };

  const disconnect = () => {
    if (stompClient.current) {
      Object.keys(subscriptions.current).forEach((gameId) => {
        unsubscribeFromAllGameEvents(Number(gameId));
      });
    }

    stompClient.current?.deactivate();
    stompClient.current = null;
    setConnected(false);
  };

  const subscribeToGameEvent = (
    gameId: number,
    eventType: SubscriptionType,
    callback: SubscriptionCallback
  ) => {
    if (!stompClient.current?.connected) return;

    const topicPaths = {
      game: `/topic/game/${gameId}`,
      playerJoined: `/topic/game/${gameId}/player-joined`,
      move: `/topic/game/${gameId}/move`,
    };

    const subscription = stompClient.current.subscribe(
      topicPaths[eventType],
      (message) => {
        const data = JSON.parse(message.body);
        callback(data);
      }
    );

    if (!subscriptions.current[gameId]) {
      subscriptions.current[gameId] = {
        game: null as unknown as StompSubscription,
        playerJoined: null as unknown as StompSubscription,
        move: null as unknown as StompSubscription,
      };
    }

    subscriptions.current[gameId][eventType] = subscription;

    return subscription;
  };

  const unsubscribeFromAllGameEvents = (gameId: number) => {
    if (subscriptions.current[gameId]) {
      Object.values(subscriptions.current[gameId]).forEach((subscription) => {
        subscription.unsubscribe();
      });
      delete subscriptions.current[gameId];
    }
  };

  const unsubscribeFromSingleGameEvent = (
    gameId: number,
    eventType: SubscriptionType
  ) => {
    if (
      subscriptions.current[gameId] &&
      subscriptions.current[gameId][eventType]
    ) {
      subscriptions.current[gameId][eventType].unsubscribe();
      delete subscriptions.current[gameId][eventType];
    }
  };

  return (
    <WebSocketContext.Provider
      value={{
        subscribeToGameEvent,
        unsubscribeFromAllGameEvents,
        unsubscribeFromSingleGameEvent,
        connected,
        connect,
        disconnect,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
