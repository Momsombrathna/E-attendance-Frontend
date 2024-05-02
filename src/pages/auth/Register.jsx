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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const navigation = useNavigation();

  function handleSubmit() {
    setLoading(true);
    setError("");

    if (!password || !email || !username || !confirmPassword) {
      setError("Please fill in all the fields");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email address");
      setLoading(false);
      return;
    }

    if (!email.includes(".")) {
      setError("Invalid email address");
      setLoading(false);
      return;
    }

    if (!password.match(/[0-9]/)) {
      setError("Password must contain at least one number");
      setLoading(false);
      return;
    }

    if (!password.match(/[a-z]/)) {
      setError("Password must contain at least one lowercase letter");
      setLoading(false);
      return;
    }

    if (!password.match(/[A-Z]/)) {
      setError("Password must contain at least one uppercase letter");
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
        // console.log(result);
        // Save the token in the async storage
        AsyncStorage.setItem(
          "token",
          result.user.tokens[result.user.tokens.length - 1]
        );
        AsyncStorage.setItem("username", result.user.username);
        AsyncStorage.setItem("userId", result.user._id);
        AsyncStorage.setItem("email", result.user.email);
        AsyncStorage.setItem("profile", result.user.profile);

        navigation.navigate("Protected");
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  }

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <Text style={styles.title}>Register Account</Text>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      {error && error.message && error.message.includes("username") ? (
        <Text style={styles.error}>{error.message}</Text>
      ) : null}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      {error && error.message && error.message.includes("email") ? (
        <Text style={styles.error}>{error.message}</Text>
      ) : null}

      {/* password */}
      <Text style={styles.label}>Password</Text>
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
      {error && error.message && error.message.includes("password") ? (
        <Text style={styles.error}>{error.message}</Text>
      ) : null}

      {/* confirm password */}
      <Text style={styles.label}>Confirm Password</Text>
      <View style={[styles.passwordContainer, error && styles.inputError]}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!isConfirmPasswordVisible}
        />
        <TouchableOpacity
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
          style={styles.icon}
        >
          <Icon
            name={isConfirmPasswordVisible ? "eye-slash" : "eye"}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      {error && error.message && error.message.includes("confirmPassword") ? (
        <Text style={styles.error}>{error.message}</Text>
      ) : null}

      <TouchableOpacity
        style={styles.btn}
        onPress={
          username && password && email
            ? () => {
                handleSubmit();
              }
            : null
        }
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
    marginTop: 8,
    marginBottom: 16,
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
    marginTop: 8,
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
});
