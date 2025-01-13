import { useEffect, useRef, useState } from "react";
import { Client, Frame, StompSubscription } from "@stomp/stompjs";
import { useAuth } from "./Authprovider";
import { WebSocketHook } from "../Types/interfaces";
import { SubscriptionType, SubscriptionCallback } from "../Types/interfaces";

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

    return () => {
      client.deactivate();
    };
  }, [token]);

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
        console.log("Received message", message);
        //const data = JSON.parse(message.body);
        callback(message);
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

  /*const subscribeToGame = (
    gameId: number,
    callback: (data: any) => void,
    joinOrCreate: "JOIN" | "CREATE"
  ) => {
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
  };*/
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

  return {
    subscribeToGameEvent,
    unsubscribeFromAllGameEvents,
    connected,
    unsubscribeFromSingleGameEvent,
  };
};

export default useWebSocket;
