import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, getUserId, getToken } from "../api/config";
import { Alert } from "react-native";
import React from "react";
import { ActivityIndicator, View } from "react-native";

const login = async (username, password, setError, setLoading, navigation) => {
  setLoading(true);

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      setLoading(false);
      setError(result.message);
      Alert.alert("Error", "An error occurred. Please try again");
    } else {
      setLoading(false);
      await AsyncStorage.multiSet([
        ["token", result.tokens[result.user.tokens.length - 1]],
        ["username", result.user.username],
        ["userId", result.user._id],
        ["email", result.user.email],
        ["profile", result.user.profile],
      ]);
      navigation.navigate("Classes");
    }
  } catch (error) {
    console.log(error);
    setLoading(false);
    setError({ message: "An error occurred. Please try again" });
    Alert.alert("Error", "An error occurred. Please try again");
  }
};

const logout = async () => {
  try {
    const result = await Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ],
      { cancelable: true }
    );

    if (result.action === "OK") {
      const response = await fetch(`${API_URL}/auth/logout/${getUserId()}`, {
        method: "POST",
        headers: {
          "auth-token": getToken(),
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("username");
        await AsyncStorage.removeItem("userId");
        await AsyncStorage.removeItem("email");
        await AsyncStorage.removeItem("profile");
        navigation.navigate("Login");
      } else {
        throw new Error("Logout failed");
      }
    }
  } catch (error) {
    console.log(error);
    Alert.alert("Error", "An error occurred. Please try again");
  }
};

function withAuthProtection(WrappedComponent) {
  return class extends React.Component {
    state = {
      isLoading: true,
      isAuthorized: false,
    };

    async componentDidMount() {
      const token = await AsyncStorage.getItem("token");

      this.setState({
        isLoading: false,
        isAuthorized: !!token,
      });
    }

    render() {
      const { isLoading, isAuthorized } = this.state;

      if (isLoading) {
        return <ActivityIndicator />;
      }

      if (!isAuthorized) {
        return (
          <View>
            <Text>You are not authorized to access this resource</Text>
          </View>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}

export { login, logout, withAuthProtection };
