import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { API_URL, useUserData } from "../../api/config";
import { useFocusEffect } from "@react-navigation/native";

export default function GetUserById({ id }) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const { token } = useUserData();

  useEffect(() => {
    getUserById();
  }, [id]);

  const getUserById = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/get/${id}`, {
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

  return (
    <View style={styles.main}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={styles.container}>
          <Image source={{ uri: user.profile }} style={styles.image} />
          <Text style={styles.text}>{user.username}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    height: 50,
  },
  container: {
    borderWidth: 1,
    borderColor: "#000",

    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    borderWidth: 1,
    borderColor: "#000",
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
