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

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
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

    if (/\s/.test(email)) {
      setEmailError("Email should not contain spaces");
      setLoading(false);
      return;
    }

    if (/\s/.test(password)) {
      setPasswordError("Password should not contain spaces");
      setLoading(false);
      return;
    }

    if (!username) {
      setUsernameError("Username is required");
      setLoading(false);
      return;
    }

    if (username.length > 30) {
      setUsernameError("Username must be 30 characters or fewer");
      setLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setPasswordError("Password must contain at least one uppercase letter");
      setLoading(false);
      return;
    }

    if (!/[a-z]/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter");
      setLoading(false);
      return;
    }

    if (!/[0-9]/.test(password)) {
      setPasswordError("Password must contain at least one digit");
      setLoading(false);
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      setPasswordError(
        "Password must contain at least one special character (!@#$%^&*)"
      );
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      // Register the user
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      // Send the OTP
      const otpResponse = await fetch(`${API_URL}/auth/email-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const otpData = await otpResponse.json();

      if (!otpResponse.ok) {
        setError(otpData.message);
        setLoading(false);
        return;
      }

      // Navigate to the verification page
      navigation.navigate("VerifyEmail", { email });
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
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
          style={[styles.input, (usernameError || error) && styles.inputError]}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />

        {usernameError ? (
          <Text style={styles.errorUsernameMessage}>{usernameError}</Text>
        ) : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, (emailError || error) && styles.inputError]}
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
          style={[
            styles.passwordContainer,
            (passwordError || error) && styles.inputError,
          ]}
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
          style={[
            styles.passwordContainer,
            (passwordError || error) && styles.inputError,
          ]}
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
            <Text
              style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
            >
              Register
            </Text>
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
    backgroundColor: "#fff",
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
    borderRadius: 10,
    backgroundColor: "#eee",
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
    borderRadius: 10,
    backgroundColor: "#eee",
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
  errorUsernameMessage: {
    color: "red",
    fontSize: 11,
    width: "90%",
    textAlign: "left",
    paddingLeft: 5,
    position: "absolute",
    bottom: -6,
  },
});
