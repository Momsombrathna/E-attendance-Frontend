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

export default function ForgotPass() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const handleOtpRequest = async () => {
    setLoading(true);
    setError("");

    if (!email) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!email || !email.includes("@") || !email.includes(".")) {
      setError("Invalid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/pass-reset-req-otp`, {
        email,
      });

      if (response.status === 200) {
        setLoading(false);
        navigation.navigate("VerifyEmailResetPass", { email });
      } else {
        setLoading(false);
        setError(response.data.message);
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
          <Text style={styles.header}>Request a password </Text>
          <Text style={styles.header}>reset OTP code</Text>
        </View>
        <View style={styles.viewsContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={[styles.inputContainer, error && styles.inputError]}>
            <TextInput
              style={styles.inputUsername}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
            />
          </View>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleOtpRequest}
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
    marginBottom: 20,
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
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.9,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
