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
import axios from "axios";
import { ThemeContext } from "../../hooks/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function JoinClass() {
  const { userId, token } = useUserData();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const { darkMode } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: darkMode ? "black" : "white",
    },
    inputContainer: {
      width: "100%",
      marginBottom: 10,
      backgroundColor: darkMode ? "#333" : "#eee",
      borderRadius: 5,
    },
    input: {
      fontSize: 16,
      padding: 10,
      height: 50,
      color: darkMode ? "white" : "black",
    },
    button: {
      marginTop: 10,
      width: "100%",
      padding: 15,
      backgroundColor: "#2F3791",
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: "white",
      fontSize: 16,
    },
    error: {
      color: "red",
      marginTop: 10,
    },
    inputError: {
      borderColor: "red",
      borderWidth: 1,
      borderRadius: 5,
    },
  });

  const joinClass = async () => {
    setLoading(true);
    setError("");

    if (!code) {
      setError("Please enter a valid code");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/class/invite-by-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          code,
          userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        throw new Error(data.message);
      } else {
        navigation.goBack();
      }
    } catch (error) {
      setError(error.message);
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
          <View style={styles.inputContainer}>
            <TextInput
              type="text"
              style={[styles.input, error && styles.inputError]}
              value={code}
              onChangeText={(text) => setCode(text)}
              placeholderTextColor={darkMode ? "white" : "black"}
              placeholder="Enter Invite Code"
            />
            {/* Qr code scanner */}
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 10,
                top: 10,
              }}
              onPress={() => navigation.navigate("Scanner")}
            >
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={30}
                color={darkMode ? "white" : "#2F3791"}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={joinClass}>
            <Text style={styles.buttonText}>
              {loading ? <ActivityIndicator color="white" /> : "Join"}
            </Text>
          </TouchableOpacity>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
