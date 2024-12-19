import React, { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AuthContextType } from "../Types/interfaces";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  //Check token validity on initial load
  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);

        if (
          decodedUser.exp != undefined &&
          decodedUser.exp * 1000 > Date.now()
        ) {
          setUser(decodedUser);
        } else {
          logout();
        }
      } catch (error) {
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

      console.log("response", response);
      let authHeaders = response.headers.get("Authorization");
      const auhtToken = authHeaders?.slice(7);

      if (auhtToken) {
        localStorage.setItem("token", auhtToken);
      } else {
        throw new Error("Invalid token");
      }

      const decodeUser = jwtDecode(auhtToken);
      setUser(decodeUser);
      setToken(auhtToken);

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

      console.log("response", response);
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
    setUser(null);
    setToken(null);
  };

  const getToken = () => token;

  const contextValue = {
    user,
    token,
    login,
    register,
    logout,
    getToken,
    isAuthenticated: !!user,
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
