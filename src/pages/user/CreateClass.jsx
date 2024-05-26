import React, { useState, useEffect, useContext } from "react";
import { API_URL, useUserData } from "../../api/config";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import { ThemeContext } from "../../hooks/ThemeContext";

export default function CreateClass() {
  const { token, userId } = useUserData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [className, setClassName] = useState("");

  const navigation = useNavigation();

  const { darkMode } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      marginTop: 10,
      flex: 1,
      backgroundColor: darkMode ? "black" : "white",
      padding: 20,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    headerText: {
      fontSize: 20,
      fontWeight: "bold",
      marginLeft: 10,
      color: darkMode ? "white" : "black",
    },
    form: {
      flex: 1,
      height: 100,
    },
    text: {
      fontSize: 16,
      marginBottom: 10,
      color: darkMode ? "white" : "black",
    },
    input: {
      backgroundColor: darkMode ? "#333" : "#eee",
      height: 50,
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
      color: darkMode ? "white" : "black",
    },
    button: {
      backgroundColor: "#2F3791",
      padding: 15,
      alignItems: "center",
      borderRadius: 5,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
    },
    error: {
      marginTop: 10,
      paddingHorizontal: 10,
      color: "red",
      fontSize: 16,
    },
    errorInput: {
      borderColor: "red",
      borderWidth: 1,
    },
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/class/create-class/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          className,
        }),
      });

      if (response.ok) {
        setLoading(false);
        const data = await response.json();
        setClassName("");
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }

      if (response.status === 400) {
        setLoading(false);
        const data = await response.json();
        setError(data.message);
      }

      if (!response.ok) {
        setLoading(false);
        const data = await response.json();

        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, backgroundColor: darkMode ? "black" : "white" }}
    >
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.form}>
            <TextInput
              style={[styles.input, error && styles.errorInput]}
              value={className}
              placeholderTextColor={darkMode ? "white" : "black"}
              placeholder="Enter class name"
              onChangeText={setClassName}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>
                {loading ? <ActivityIndicator color="white" /> : "Create"}
              </Text>
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
