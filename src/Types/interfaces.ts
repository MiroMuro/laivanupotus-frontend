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

export interface OwnUserProfile {
  id: number;
  userName: string;
  email: string;
  totalGames: number;
  gamesWon: number;
  gamesLost: number;
  createdAt: Date;
}
