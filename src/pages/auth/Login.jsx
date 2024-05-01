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
  Pressable,
} from "react-native";
import { login } from "../../context/AuthContext";
import Logo from "../../../assets/e-attendance.png";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!username || !password) {
      setLoading(false);
      setError("Please enter your username and password");
      return;
    }

    if (Object.keys(error).length > 0) {
      setError("");
      setLoading(false);
      return;
    }

    login(username, password, setLoading, setError, navigation);
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
            <View style={[styles.inputContainer, error && styles.inputError]}>
              <TextInput
                style={styles.inputUsername}
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
              />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <View style={styles.viewsContainers}>
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
          <Pressable
            style={styles.btn}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: "#fff", textAlign: "center" }}>Login</Text>
            )}
          </Pressable>

          <Text
            style={{
              color: "gray",
              textAlign: "center",
              width: "100%",
              marginBottom: 16,
              cursor: "pointer",
            }}
          >
            Don't have an account? &nbsp;
            <Text
              onPress={() => {
                navigation.navigate("Signup");
              }}
              style={{
                color: "#007bff",
                cursor: "pointer",
              }}
            >
              Sign up
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
    color: "red",
    position: "absolute",
    bottom: -3,
    paddingLeft: 10,
  },
  errorTexts: {
    color: "red",
    position: "absolute",
    bottom: -3,
    paddingLeft: 10,
  },
});
