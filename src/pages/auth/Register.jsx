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
} from "react-native";
import Logo from "../../../assets/e-attendance.png";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { API_URL } from "../../api/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const handleSubmit = () => {
    setLoading(true);
    setError("");

    if (!password || !email || !username || !confirmPassword) {
      setError("Please fill in all the fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setEmailError("Invalid email address");
      setLoading(false);
      return;
    }

    if (!email.includes(".")) {
      setEmailError("Invalid email address");
      setLoading(false);
      return;
    }

    if (!password.match(/[0-9]/)) {
      setPasswordError("Password must contain at least one number");
      setLoading(false);
      return;
    }

    if (!password.match(/[a-z]/)) {
      setPasswordError("Password must contain at least one lowercase letter");
      setLoading(false);
      return;
    }

    if (!password.match(/[A-Z]/)) {
      setPasswordError("Password must contain at least one uppercase letter");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, email }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message);
          });
        }

        return response.json();
      })
      .then((result) => {
        setLoading(false);

        navigation.navigate("Protected");
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <Text style={styles.title}>Register Account</Text>
      <Text style={styles.label}>Username</Text>
      <View style={styles.inputContainer}>
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
          style={[styles.input, error && styles.inputError]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      </View>

      {/* password */}
      <Text style={styles.label}>Password</Text>
      <View style={styles.inputContainer}>
        <View style={[styles.passwordContainer, error && styles.inputError]}>
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
        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      </View>

      {/* confirm password */}
      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.inputContainer}>
        <View style={[styles.passwordContainer, error && styles.inputError]}>
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
        {error ? <Text style={styles.errorMessage}>{error}</Text> : null}
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={handleSubmit}
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
    marginBottom: 16,
    color: "#2F3791",
  },
  input: {
    width: "90%",
    height: 50,
    borderColor: "gray",
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
    borderColor: "gray",
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
