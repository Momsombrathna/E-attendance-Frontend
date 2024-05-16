import React, { useState, useContext } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { ThemeContext } from "../hooks/ThemeContext";

export default function Settings() {
  const [language, setLanguage] = useState("English");
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const toggleLanguage = () => {
    setLanguage(language === "English" ? "Khmer" : "English");
  };

  const styles = darkMode ? darkStyles : lightStyles;

  return (
    <View style={styles.container}>
      <View style={styles.setting}>
        <Text style={styles.text}>Language: {language}</Text>
        <Switch value={language === "Khmer"} onValueChange={toggleLanguage} />
      </View>

      <View style={styles.setting}>
        <Text style={styles.text}>Dark Mode: {darkMode ? "On" : "Off"}</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>
    </View>
  );
}

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  text: {
    fontSize: 18,
    color: "#000",
  },
});

const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },
  text: {
    fontSize: 18,
    color: "#fff",
  },
});
