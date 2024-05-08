import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { API_URL, useUserData } from "../api/config";
import {
  Text,
  Alert,
  TextStyle,
  View,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingScreen from "./LoadingScreen";
import * as ImagePicker from "expo-image-picker";

export default function Profile() {
  const navigation = useNavigation();
  const { userId, token, username, email, role } = useUserData();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        `Sorry, we need camera  
             roll permission to upload images.`
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync();

      if (!result.cancelled) {
        setFile(result.uri);

        setError(null);
      }
    }
  };

  const [loading, setLoading] = useState(false);
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          setLoading(true);
          await fetch(`${API_URL}/auth/logout/${userId}`, {
            method: "POST",
            headers: {
              "auth-token": token,
            },
          });
          await AsyncStorage.removeItem("userData");
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
        style: "destructive",
      },
    ]);
  };
  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              marginVertical: 16,
            }}
          >
            <View style={{ flex: 1 }}>
              <Image
                source={require("../../assets/e-attendance.png")}
                style={{
                  objectFit: "contain",
                  width: 70,
                  height: 70,
                  marginStart: 30,
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 50,
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => ToastAndroid.show("Clicked", ToastAndroid.SHORT)}
              style={{
                marginEnd: 30,
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,
                elevation: 4,
              }}
            >
              <Text>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginHorizontal: 15 }}>
            <Text style={{ marginStart: 3, marginVertical: 5 }}>Username</Text>
            <TextInput
              style={{
                borderColor: "gray",
                width: "100%",
                borderWidth: 1,
                borderRadius: 10,
                padding: 8,
                fontSize: 16,
              }}
            >
              {username}
            </TextInput>
            <Text style={{ marginStart: 3, marginVertical: 5 }}>Email</Text>
            <TextInput
              style={{
                borderColor: "gray",
                width: "100%",
                borderWidth: 1,
                borderRadius: 10,
                padding: 8,
                fontSize: 16,
              }}
            >
              {email}
            </TextInput>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ marginStart: 3, marginVertical: 5 }}>Role</Text>
                <TextInput
                  style={{
                    borderColor: "gray",
                    width: "100%",
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 8,
                    fontSize: 16,
                  }}
                >
                  Student
                </TextInput>
              </View>
              <View style={{ flex: 0.1 }}></View>
              <View style={{ flex: 1 }}>
                <Text style={{ marginStart: 3, marginVertical: 5 }}>
                  Gender
                </Text>
                <TextInput
                  style={{
                    borderColor: "gray",
                    width: "100%",
                    borderWidth: 1,
                    borderRadius: 10,
                    padding: 8,
                    fontSize: 16,
                  }}
                >
                  Male
                </TextInput>
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
});
