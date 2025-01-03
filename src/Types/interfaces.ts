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

export type EditProfileDialogProps = {
  openModal: boolean;
  closeModal: () => void;
};

export type GameStatus =
  | "WAITING_FOR_PLAYER"
  | "PLACING_SHIPS"
  | "IN_PROGRESS"
  | "FINISHED";

export interface IngameUserProfileDto {
  id: number;
  userName: string;
}

export interface CurrentGame {
  currentTurnPlayerId: null | number;
  endedAt: null | Date;
  id: number;
  player1: IngameUserProfileDto;
  player1Board: string;
  player2: null;
  player2Board: null;
  startTime: Date;
  status: GameStatus;
  updatedAt: Date;
}

export interface GameDto {
  id: number;
  player1UserName: string;
  player2UserName: null | string;
  status: GameStatus;
}
