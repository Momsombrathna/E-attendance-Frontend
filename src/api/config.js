import AsyncStorage from "@react-native-async-storage/async-storage";
import { E_ATTENDANCE_DEPLOY_URL } from "@env";
import React, { useState, useEffect } from "react";

const API_URL = E_ATTENDANCE_DEPLOY_URL;

if (!API_URL) {
  throw new Error("API is not defined");
}

const useUserData = () => {
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState({});
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [expires, setExpires] = useState("");

  useEffect(() => {
    const getUserData = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        console.log("User data not found");
        return;
      }
      const parsedData = JSON.parse(userData);
      setToken(parsedData.token);
      setProfile(parsedData.profile);
      setUserId(parsedData.userId);
      setEmail(parsedData.email);
      setUsername(parsedData.username);
      setExpires(parsedData.expirationDate);
    };

    getUserData();
  }, []);

  return { token, userId, profile, email, username, expires };
};

export { useUserData, API_URL };
