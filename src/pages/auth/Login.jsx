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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    if (!username || !password) {
      setError("Username and password are required");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const Data = await response.json();

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7); // Set the expiration date to 30 days from now

      const userData = {
        token: Data.user.tokens[Data.user.tokens.length - 1],
        username: Data.user.username,
        userId: Data.user._id,
        email: Data.user.email,
        profile: Data.user.profile,
        expirationDate: expirationDate.toISOString(), // Convert the expiration date to a string
      };

      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      console.log(userData);
      navigation.replace("Protected");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.main}>
          <View style={styles.logo}>
            <Image source={Logo} style={{ width: 110, height: 100 }} />
          </View>
          <Text style={styles.header}>Welcome Back.</Text>
          <View style={styles.viewsContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputContainer, error && styles.inputError]}>
              <TextInput
                style={styles.inputUsername}
                value={username}
                onChangeText={setUsername}
                placeholder="Username or Email"
              />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <View style={styles.viewsContainers}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, error && styles.inputError]}>
              <TextInput
                style={styles.inputPassword}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Icon
                  style={{ color: "gray" }}
                  name={isPasswordVisible ? "eye" : "eye-slash"}
                  size={20}
                />
              </TouchableOpacity>
            </View>
            {error && <Text style={styles.errorTexts}>{error}</Text>}
          </View>
          <Text
            onPress={() => {
              navigation.navigate("ForgotPassword");
            }}
            style={styles.text_forgot}
          >
            Forgot password?
          </Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: "#fff", textAlign: "center" }}>Login</Text>
            )}
          </TouchableOpacity>

          <Text
            style={{
              color: "gray",
              textAlign: "center",
              width: "100%",
              marginBottom: 16,
            }}
          >
            Don't have an account? &nbsp;
            <Text
              onPress={() => {
                navigation.navigate("Register");
              }}
              style={{
                color: "#2F3791",
                opacity: 0.9,
              }}
            >
              Sign up.
            </Text>
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    color: "#2F3791",
    opacity: 0.8,
  },

  main: {
    width: "90%",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
  },
  inputContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    padding: 10,
    borderRadius: 10,
  },
  inputUsername: {
    fontSize: 16,
    width: "100%",
    color: "black",
    zIndex: 1,
  },

  inputPassword: {
    fontSize: 16,
    width: "90%",
    color: "black",
    zIndex: 1,
  },
  logo: {
    margin: "10px 0",
    marginBottom: 16,
  },
  btn: {
    width: "100%",
    height: 50,
    marginBottom: 16,
    backgroundColor: "#464DAA",
    borderRadius: 10,
    textAlign: "center",
    justifyContent: "center",
  },
  text_forgot: {
    color: "gray",
    textAlign: "right",
    width: "100%",
    marginBottom: 16,
    marginTop: 10,
  },
  viewsContainer: {
    width: "100%",
    position: "relative",
  },
  viewsContainers: {
    marginTop: 16,
    width: "100%",
    position: "relative",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    position: "absolute",
    bottom: -1,
    paddingLeft: 5,
  },
  errorTexts: {
    fontSize: 12,
    color: "red",
    position: "absolute",
    bottom: -1,
    paddingLeft: 5,
  },

  label: {
    width: "90%",
    textAlign: "left",
    color: "#2F3791",
    fontSize: 16,
    paddingLeft: 5,
    marginBottom: 5,
  },
});
