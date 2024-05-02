import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import Logo from "../../../assets/e-attendance.png";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../api/config";
import axios from "axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    setEmailError(null);
    setPasswordError(null);

    if (!email || !password || !username || !confirmPassword) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Invalid email address");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });

      // Call the OTP API after successful registration
      const otpResponse = await axios.post(`${API_URL}/auth/email-otp`, {
        email,
      });

      navigation.navigate("VerifyEmail", { email });
    } catch (error) {
      if (error.response) {
        // Check the status code
        switch (error.response.status) {
          case 400:
            // Handle 400 error
            setError("Bad request. Please check your input");
            break;
          case 409:
            // Handle 409 error
            setError("User already exists. Please login");
            break;
          case 404:
            // Handle 404 error
            setError("User not found. Please register");
            break;
          case 403:
            // Handle 403 error
            setError("Forbidden. Please check your credentials");
            break;
          case 429:
            // Handle 429 error
            setError("Too many requests. Please try again later");
            break;

          case 401:
            // Handle 401 error
            setError("Unauthorized. Please check your credentials");
            break;
          case 500:
            // Handle 500 error
            setError("Server error. Please try again later");
            break;
          default:
            // Handle other errors
            setError("An error occurred. Please try again");
            break;
        }
      } else if (error.request) {
        setError("An error occurred. Please try again");
      } else {
        setError("An error occurred. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={{
          alignItems: "center",
          width: "100%",
          marginBottom: 16,
        }}
      >
        <Image source={Logo} style={styles.logo} />
        <Text style={styles.title}>Register Account</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        {emailError ? (
          <Text style={styles.errorMessage}>{emailError}</Text>
        ) : null}
      </View>

      {/* password */}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <View
          style={[styles.passwordContainer, passwordError && styles.inputError]}
        >
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.icon}
          >
            <Icon
              name={isPasswordVisible ? "eye-slash" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorMessage}>{passwordError}</Text>
        ) : null}
      </View>

      {/* confirm password */}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <View
          style={[styles.passwordContainer, passwordError && styles.inputError]}
        >
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isConfirmPasswordVisible}
          />
          <TouchableOpacity
            onPress={() =>
              setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
            }
            style={styles.icon}
          >
            <Icon
              name={isConfirmPasswordVisible ? "eye-slash" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text style={styles.errorMessage}>{passwordError}</Text>
        ) : null}
        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      </View>

      <View
        style={{
          width: "100%",
          alignItems: "center",
          position: "relative",
        }}
      >
        <TouchableOpacity
          style={styles.btn}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: "#fff", textAlign: "center" }}>Register</Text>
          )}
        </TouchableOpacity>
        <Text
          style={{
            color: "gray",
            textAlign: "center",
            width: "100%",
            marginTop: 16,
          }}
        >
          Already have an account? &nbsp;
          <Text
            onPress={() => {
              navigation.navigate("Login");
            }}
            style={{
              color: "#2F3791",
              opacity: 0.9,
            }}
          >
            Log in.
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  logo: {
    width: 110,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    opacity: 0.9,
    color: "#2F3791",
  },
  input: {
    width: "90%",
    height: 50,
    borderColor: "#2F3791",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginTop: 2,
    marginBottom: 20,
    padding: 8,
  },
  passwordContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    borderColor: "#2F3791",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#fff",
    height: 50,
    marginTop: 2,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    padding: 8,
  },
  icon: {
    padding: 8,
  },
  error: {
    color: "red",
    fontSize: 12,
    width: "90%",
    textAlign: "left",
    paddingLeft: 5,
  },
  btn: {
    width: "90%",
    height: 50,
    marginTop: 16,
    backgroundColor: "#2F3791",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    opacity: 0.9,
  },
  label: {
    width: "90%",
    textAlign: "left",
    color: "#2F3791",
    fontSize: 16,
    paddingLeft: 5,
    marginTop: 5,
    opacity: 0.9,
  },
  inputError: {
    borderColor: "red",
  },
  errorMessage: {
    color: "red",
    fontSize: 11,
    width: "90%",
    textAlign: "left",
    paddingLeft: 5,
    position: "absolute",
    bottom: -0,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    position: "relative",
  },
});
