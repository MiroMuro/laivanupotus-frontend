import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AuthContextType } from "../Types/interfaces";
import { OwnUserProfile } from "../Types/interfaces";
import useCookie from "./useCookie";
export const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUserInformation, setCurrentUserInformation] =
    useState<OwnUserProfile | null>(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [decodedUser, setDecodedUser] = useState<JwtPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const { setCookie, getCookie, clearCookie } = useCookie();

  const isTokenExpired = (decodedToken: JwtPayload) => {
    return (
      decodedToken == null ||
      decodedToken.exp == null ||
      decodedToken.exp * 1000 < Date.now()
    );
  };

  //Check token validity on initial load
  useEffect(() => {
    if (token) {
      try {
        //Get user info from cookie on possible page reload.
        const userInfo = getCookie("currentUserInformation");
        if (userInfo) {
          setCurrentUserInformation(userInfo);
        }

        const decodedToken = jwtDecode(token);
        //Token expired. Logout
        if (isTokenExpired(decodedToken)) {
          logout();
          return;
        }

        setDecodedUser(decodedToken);
      } catch (error) {
        console.error("Error initializing auth:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const extractAuthToken = (headers: Headers) => {
    let authHeaders = headers.get("Authorization");
    const authToken = authHeaders?.slice(7);
    if (!authToken) throw new Error("Invalid auth token!");
    return authToken;
  };

  const login = async (userName: string, password: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userName, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      //User information handling
      const currentUserInformationJson = await response.json();
      setCookie("currentUserInformation", currentUserInformationJson);
      setCurrentUserInformation(currentUserInformationJson);

      //Handle token
      const authToken = extractAuthToken(response.headers);
      localStorage.setItem("token", authToken);

      const decodedUser = jwtDecode(authToken);
      setDecodedUser(decodedUser);
      setToken(authToken);

      return { success: true };
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        return {
          success: false,
          message: error.message || "An error occurred during login",
        };
      } else {
        return {
          success: false,
          message: "An error occurred during login",
        };
      }
    }
  };

  const register = async (
    userName: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName,
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error registering user. Check your credentials");
      }

      return { success: true };
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        return {
          success: false,
          message: error.message || "An error occurred during registration",
        };
      } else {
        return {
          success: false,
          message: "An error occurred during registration",
        };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    clearCookie("currentUserInformation");
    setCurrentUserInformation(null);
    setDecodedUser(null);
    setToken(null);
  };

  const getToken = () => token;

  const contextValue = {
    currentUserInformation,
    decodedUser,
    token,
    login,
    register,
    logout,
    getToken,
    isAuthenticated: !!decodedUser,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an Authprovider");
  }
  return context;
};
