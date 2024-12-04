import { JwtPayload } from "jwt-decode";
export interface AuthContextType {
  user: JwtPayload | null;
  token: string | null;
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
  isAuhtenticated: boolean;
  loading: boolean;
}
