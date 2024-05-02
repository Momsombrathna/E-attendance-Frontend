import React from "react";
import { useNavigation } from "@react-navigation/native";
import { API_URL, useUserData } from "../api/config";
import { Text, Alert, TextStyle, View, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const navigation = useNavigation();
  const { userId, token } = useUserData();
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          await fetch(`${API_URL}/auth/logout/${userId}`, {
            method: "POST",
            headers: {
              "auth-token": token,
            },
          });
          await AsyncStorage.removeItem("userData");
          navigation.replace("Login");
        },
        style: "destructive",
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile screen</Text>
      <Text style={styles.text}>ID: {userId}</Text>
      <Button title="Logout" onPress={() => handleLogout()} />
    </View>
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
});
