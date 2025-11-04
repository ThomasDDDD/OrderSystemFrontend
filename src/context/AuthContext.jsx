import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState();

  const APIKEY = import.meta.env.VITE_API_KEY;
  const URL = import.meta.env.VITE_BACKEND_URL;

  const devMode = import.meta.env.DEV_MODE;
  if (devMode) {
    false;
  }

  const getMode = () => {
    if (document.documentElement.classList.contains("dark")) {
      setMode("dark");
    } else {
      setMode("light");
    }
  };

  const login = (user) => {
    try {
      setUser(user);
      setIsLoggedIn(true);
      console.log("Login successfully");
      return { success: true };
    } catch (error) {
      console.error("failed to logIn:", error);
      return { success: false, error: "error" };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${URL}/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
          "api-key": APIKEY,
        },
        credentials: "include",
      });
      const data = await response.json();
      if (response.status === 200) {
        setIsLoggedIn(false);
        setUser(null);

        console.log("Logout successfully");
      }
      if (response.status !== 200) {
        console.log("Logout failed:" + " " + data.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getUser = async () => {
    try {
      const response = await fetch(`${URL}/user/getUser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "api-key": APIKEY,
        },
        credentials: "include",
      });

      const data = await response.json();
      if (response.status === 200) {
        login(data.user);
      }
      if (response.status === 403) {
        console.log(data.message);
        return;
      }
      if (response.status !== 200) {
        console.log("Login failed:" + " " + data.message);
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        loading,
        login,
        logout,
        getUser,
        mode,
        getMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
