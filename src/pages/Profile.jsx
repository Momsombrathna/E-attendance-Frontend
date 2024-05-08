import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { API_URL, useUserData } from "../api/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Text,
  Alert,
  TextStyle,
  View,
  Button,
  StyleSheet,
  Image,
} from "react-native";
import LoadingScreen from "./LoadingScreen";

export default function Profile() {
  const navigation = useNavigation();
  const { userId, token } = useUserData();
  const [user, setUser] = useState({});
  const [card, setCard] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserData();
  }, [userId]);

  useEffect(() => {
    getCardData();
  }, [userId]);

  const getUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/get/${userId}`, {
        method: "GET",
        headers: {
          "auth-token": token,
        },
      });
      const data = await response.json();
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getCardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/user/get-student-card/${userId}`,
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const data = await response.json();
      setCard(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          setLoading(true);
          await fetch(`${API_URL}/auth/logout/${userId}`, {
            method: "POST",
            headers: {
              "auth-token": token,
            },
          });
          await AsyncStorage.removeItem("userData");
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <View style={styles.container}>
          <Text style={styles.text}>Profile:</Text>
          <Image style={styles.image} source={{ uri: user.profile }} />
          <Text style={styles.text}>Welcome {user.username} </Text>
          <Text style={styles.text}>Email: {user.email} </Text>

          <Text style={styles.text}>Card:</Text>
          <Text style={styles.text}>firstName: {card.firstName}</Text>
          <Text style={styles.text}>lastName: {card.lastName}</Text>
          <Text style={styles.text}>Phone number: {card.phoneNumber}</Text>
          <Text style={styles.text}>Address: {card.address}</Text>
          <Image style={styles.image} source={{ uri: card.profile }} />
          <Image style={styles.qrCode} source={{ uri: card.qrCode }} />

          <Button title="Logout" onPress={handleLogout} />
          <Button
            title="GenerateCard"
            onPress={() => navigation.navigate("GenerateCard")}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  qrCode: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
});
