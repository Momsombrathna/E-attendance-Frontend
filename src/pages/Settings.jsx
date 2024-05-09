import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

export default function Settings() {
  const [language, setLanguage] = useState("English");
  const [darkMode, setDarkMode] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === "English" ? "Khmer" : "English");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <View style={styles.container}>
      <View style={styles.setting}>
        <Text>Language: {language}</Text>
        <Switch value={language === "Khmer"} onValueChange={toggleLanguage} />
      </View>

      <View style={styles.setting}>
        <Text>Dark Mode: {darkMode ? "On" : "Off"}</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  setting: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
});
