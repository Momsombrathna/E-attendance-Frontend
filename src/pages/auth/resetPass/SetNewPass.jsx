import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../../api/config";
import axios from "axios";
import Logo from "../../../../assets/e-attendance.png";
import Icon from "react-native-vector-icons/FontAwesome";

export default function SetNewPass({ route }) {
  const { email } = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const handleSetNewPass = async () => {
    setLoading(true);
    setError("");

    if (!password || !confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      setLoading(false);
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      setLoading(false);
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one digit");
      setLoading(false);
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      setError(
        "Password must contain at least one special character (!@#$%^&*)"
      );
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/set-new-password`, {
        email,
        password,
      });

      if (response.status === 200) {
        setLoading(false);
        Alert.alert("Password reset successfully. Please login.");
        navigation.navigate("Login");
      } else {
        setLoading(false);
        setError("An error occurred. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.main}>
        <View style={styles.logo}>
          <Image source={Logo} style={{ width: 110, height: 100 }} />
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Set new password </Text>
        </View>
        <View style={styles.viewsContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={[styles.inputContainer, error && styles.inputError]}>
            <TextInput
              secureTextEntry={!isPasswordVisible}
              style={styles.inputPassword}
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Icon
                name={isPasswordVisible ? "eye-slash" : "eye"}
                size={20}
                color="grey"
              />
            </TouchableOpacity>
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
        <View style={styles.viewsContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={[styles.inputContainer, error && styles.inputError]}>
            <TextInput
              secureTextEntry={!isConfirmPasswordVisible}
              style={styles.inputPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
            />
            <TouchableOpacity
              onPress={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
            >
              <Icon
                name={isConfirmPasswordVisible ? "eye-slash" : "eye"}
                size={20}
                color="grey"
              />
            </TouchableOpacity>
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSetNewPass}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  main: {
    width: "90%",
    padding: 10,
  },
  logo: {
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    color: "#2F3791",
    opacity: 0.9,
    fontWeight: "bold",
  },
  headerContainer: {
    marginBottom: 20,
    display: "flex",
    alignItems: "center",
  },
  viewsContainer: {
    marginTop: 20,
    position: "relative",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    paddingLeft: 5,
    color: "#2F3791",
    opacity: 0.9,
  },
  inputContainer: {
    height: 50,
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputUsername: {
    flex: 1,
  },
  inputPassword: {
    flex: 1,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    position: "absolute",
    paddingLeft: 5,
    bottom: -16,
  },
  button: {
    backgroundColor: "#2F3791",
    padding: 15,
    alignItems: "center",
    opacity: 0.9,
    borderRadius: 10,
    marginTop: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
