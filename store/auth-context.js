import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext({
  token: "",
  userID: "",
  isAuthenticated: false,
  authenticate: (token, userID) => {},
  logout: () => {},
});

export default function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [userID, setUserID] = useState();

  useEffect(() => {
    const loadAuthData = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUserID = await AsyncStorage.getItem("userID");

      console.log("auth-context21 userID: ", storedUserID);

      if (storedToken && storedUserID) {
        setAuthToken(storedToken);
        setUserID(storedUserID);
      }
    };

    loadAuthData();
  }, []);

  async function authenticate(token, userID) {
    if (token) {
      setAuthToken(token);
      await AsyncStorage.setItem("token", token);
    }

    if (userID) {
      setUserID(userID);
      await AsyncStorage.setItem("userID", userID);
    }
  }

  function logout() {
    setAuthToken(null);
    setUserID(null);
    AsyncStorage.removeItem("token");
    AsyncStorage.removeItem("userID");
  }

  const value = {
    token: authToken,
    userID: userID,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
