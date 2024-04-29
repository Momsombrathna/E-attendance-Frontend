import React from "react";
import { Text, TextStyle, View, Button, StyleSheet } from "react-native";

export default function Profile() {
  const handleLogout = () => {
    // Add code to log out the user
    alert("Logged out");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile screen</Text>
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
