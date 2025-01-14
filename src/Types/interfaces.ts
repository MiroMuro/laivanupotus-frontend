import { StompSubscription } from "@stomp/stompjs";
import { JwtPayload } from "jwt-decode";
export interface AuthContextType {
  currentUserInformation: OwnUserProfile | null;
  token: string | null;
  decodedUser: JwtPayload | null;
  login: (
    userName: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    userName: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  getToken: () => string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface ButtonProps {
  loading?: boolean;
  type: "button" | "submit" | "reset";
  title: string;
}
export interface HeaderButtonProps extends ButtonProps {
  to: string;
}

export interface FormProps {
  imgSrc: string;
  placeholder: string;
  value: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type FormHeaderProps = {
  message?: string;
  status?: "error" | "success" | "nada";
};

export interface UserProfile {
  id: number;
  userName: string;
  roles: string;
  totalGames: number;
  gamesWon: number;
  gamesLost: number;
}

export interface OwnUserProfile extends UserProfile {
  email: string;
  createdAt: Date;
}
export interface NotOwnUserProfile extends UserProfile {
  lastLogin: Date;
}
export interface IngameUserProfileDto {
  id: number;
  userName: string;
}
export type EditProfileDialogProps = {
  openModal: boolean;
  closeModal: () => void;
};

export type GameStatus =
  | "WAITING_FOR_PLAYER"
  | "PLACING_SHIPS"
  | "IN_PROGRESS"
  | "FINISHED";

export interface CurrentGame {
  currentTurnPlayerId: null | number;
  endedAt: null | Date;
  id: number;
  player1: IngameUserProfileDto;
  player1Board: playerBoard;
  player2: null | IngameUserProfileDto;
  player2Board: playerBoard;
  startTime: Date;
  status: GameStatus;
  updatedAt: Date;
}

type Coordinate = {
  x: number;
  y: number;
};

type Move = {
  x: number;
  y: number;
  playerBehindTheMoveId: number;
  isHit: boolean;
};

enum ShipType {
  CARRIER = 5,
  BATTLESHIP = 4,
  CRUISER = 3,
  SUBMARINE = 3,
  DESTROYER = 2,
  WARBOAT = 1,
}
interface playerBoard {
  allShipsCoords: Coordinate[];
  boardState: string;
  id: number;
  moves: Move[];
  ships: ShipType[];
}

export interface GameDto {
  id: number;
  player1UserName: string;
  player2UserName: null | string;
  status: GameStatus;
}

export type SubscriptionType = "game" | "playerJoined" | "move";
export type SubscriptionCallback = (data: any) => void;

export interface gameSubscriptions {
  [gameId: number]: {
    [key in SubscriptionType]?: StompSubscription;
  };
}

export interface WebSocketHook {
  subscribeToGameEvent: (
    gameId: number,
    eventType: SubscriptionType,
    callback: (data: any) => void
  ) => StompSubscription | undefined;
  connected: boolean;
  unsubscribeFromAllGameEvents: (gameId: number) => void;
  unsubscribeFromSingleGameEvent: (
    gameId: number,
    eventType: SubscriptionType
  ) => void;
}

export type playerJoinedData = {
  message: string;
  messageStatus: boolean;
};
