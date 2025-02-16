import { createContext, useCallback, useContext } from "react";
import { WebSocketHook } from "../Types/interfaces";
import { useAuth } from "./Authprovider";
import { useRef, useState } from "react";
import { Client, StompSubscription } from "@stomp/stompjs";
import { SubscriptionType, SubscriptionCallback } from "../Types/interfaces";

interface WebSocketContextType extends WebSocketHook {
  connect: (gameId: number) => void;
  disconnect: (gameId: number, permanent: boolean) => void;
  disconnectFromCreateGame: (permanent: boolean) => void;
  disconnectFromUnload: (gameId: number, permanent: boolean) => void;
  sendPageRefreshMessageThroughWebSocket: (gameId: number) => void;
}

interface GameBoardProps {
  gameId: string;
  playerId: string;
}
const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { token, currentUserInformation } = useAuth();
  const stompClient = useRef<Client | null>(null);
  const subscriptions = useRef<{
    [key: string]: {
      game: StompSubscription;
      playerJoined: StompSubscription;
      opponentDisconnected: StompSubscription;
      move: StompSubscription;
    };
  }>({});
  const [connected, setConnected] = useState<boolean>(false);
  //Used to determine between a refresh and a permanent disconnect.
  const isPermanentDisconnect = useRef<boolean>(false);

  const connect = useCallback(
    async (gameId: number) => {
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
        console.log("Current user information", currentUserInformation);
        stompClient.current?.publish({
          destination: `/topic/game/${gameId}/opponent-connected`,
          body: JSON.stringify({
            message: "Opponent connected",
            type: "CONNECTED",
            timestamp: new Date().getTime(),
            path: "/play",
          }),
        });
      };

      client.onStompError = (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      };

      client.onDisconnect = () => {
        setConnected(false);
        console.log("Disconnected from websocket");
      };

      client.onWebSocketClose = () => {
        //Attempt to reconnect after a brief delay
        if (!isPermanentDisconnect.current) {
          setConnected(false);
          console.log("Disconnected from websocket in onWebSocketClose");
          setTimeout(() => {
            if (!client.connected) {
              console.log("Attempting to reconnect to websocket");
              client.activate();
            }
          }, 5000);
        }
      };
      client.activate();
      stompClient.current = client;
    },
    [token]
  );

  const disconnect = (gameId: number, permanent: boolean) => {
    console.log("Disconnecting from websocket");
    isPermanentDisconnect.current = permanent;
    if (StompClientCurrentExists()) {
      //sendDisconnectionMessageThroughWebSocket(gameId, "/play");
      unsubscribeStompClientFromAllEvents();
      shutDownStompClient();
    } else {
      console.log("Stomp client does not exist");
    }
  };

  const disconnectFromUnload = (gameId: number, permanent: boolean) => {
    console.log("Disconnecting from websocket");
    isPermanentDisconnect.current = permanent;
    if (StompClientCurrentExists()) {
      sendUnloadDisconnectionMessageThroughWebSocket(gameId, "/play");
      unsubscribeStompClientFromAllEvents();
      shutDownStompClient();
    } else {
      console.log("Stomp client does not exist");
    }
  };

  const disconnectFromCreateGame = (permanent: boolean) => {
    isPermanentDisconnect.current = permanent;
    if (StompClientCurrentExists()) {
      unsubscribeStompClientFromAllEvents();
      shutDownStompClient();
    } else {
      console.log("Stomp client does not exist");
    }
  };
  const StompClientCurrentExists = () => {
    return stompClient.current;
  };

  const sendUnloadDisconnectionMessageThroughWebSocket = (
    gameId: number,
    pathName: string
  ) => {
    stompClient.current?.publish({
      destination: `/topic/game/${gameId}/opponent-disconnected`,
      body: JSON.stringify({
        message: "Opponent disconnected due to navigation",
        type: "LEAVE",
        timestamp: new Date().getTime(),
        path: pathName,
      }),
    });
  };

  const sendDisconnectionMessageThroughWebSocket = (
    gameId: number,
    pathName: string
  ) => {
    stompClient.current?.publish({
      destination: `/topic/game/${gameId}/opponent-disconnected`,
      body: JSON.stringify({
        message: "Opponent disconnected due to navigation",
        type: "NAVIGATION",
        timestamp: new Date().getTime(),
        path: pathName,
      }),
    });
  };

  const sendPageRefreshMessageThroughWebSocket = (gameId: number) => {
    stompClient.current?.publish({
      destination: `/topic/game/${gameId}/opponent-disconnected`,
      body: JSON.stringify({
        message: "Opponent intends to reconnect",
        type: "REFRESH_INTENT",
        timestamp: new Date().getTime(),
      }),
    });
  };
  const unsubscribeStompClientFromAllEvents = () => {
    if (stompClient.current) {
      Object.keys(subscriptions.current).forEach((gameId) => {
        unsubscribeFromAllGameEvents(Number(gameId));
      });
    }
  };

  const shutDownStompClient = () => {
    stompClient.current?.deactivate();
    stompClient.current = null;
    setConnected(false);
  };

  const subscribeToGameEvent = (
    gameId: number,
    eventType: SubscriptionType,
    callback: SubscriptionCallback
  ) => {
    if (!stompClient.current?.connected) return null;

    const topicPaths = {
      game: `/topic/game/${gameId}`,
      playerJoined: `/topic/game/${gameId}/player-joined`,
      opponentDisconnected: `/topic/game/${gameId}/opponent-disconnected`,
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
        opponentDisconnected: null as unknown as StompSubscription,
        move: null as unknown as StompSubscription,
      };
    }

    subscriptions.current[gameId][eventType] = subscription;

    return subscription;
  };

  const unsubscribeFromAllGameEvents = (gameId: number) => {
    if (subscriptions.current[gameId]) {
      Object.values(subscriptions.current[gameId]).forEach((subscription) => {
        if (subscription) {
          subscription.unsubscribe();
        }
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
        disconnectFromCreateGame,
        disconnectFromUnload,
        sendPageRefreshMessageThroughWebSocket,
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
