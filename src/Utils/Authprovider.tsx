import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AuthContextType } from "../Types/interfaces";
import { OwnUserProfile } from "../Types/interfaces";
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [currentUserInformation, setCurrentUserInformation] = useState<
    OwnUserProfile | undefined
  >();
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [decodedUser, setDecodedUser] = useState<JwtPayload | null>(null);
  const [loading, setLoading] = useState(true);

  //Check token validity on initial load
  useEffect(() => {
    if (token) {
      const decodedUser = jwtDecode(token);
      setDecodedUser(jwtDecode(token));
      console.log("HERE", currentUserInformation);
      try {
        if (
          decodedUser == null ||
          decodedUser.exp == null ||
          decodedUser.exp * 1000 < Date.now()
        ) {
          console.log("Token expired");
          logout();
        }
      } catch (error) {
        console.error("Error decoding token", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

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

      const currentUserInformationJson = await response.json();
      console.log(currentUserInformationJson);
      setCurrentUserInformation(currentUserInformationJson);

      let authHeaders = response.headers.get("Authorization");
      const authToken = authHeaders?.slice(7);

      if (authToken) {
        localStorage.setItem("token", authToken);
      } else {
        throw new Error("Invalid token");
      }

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
    setCurrentUserInformation(undefined);
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
