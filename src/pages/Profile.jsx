import React, { useEffect, useState } from "react";
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
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_URL, useUserData } from "../api/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import LoadingScreen from "./LoadingScreen";

export default function Profile() {
  const navigation = useNavigation();
  const { userId, token } = useUserData();
  const [user, setUser] = useState({});
  const [card, setCard] = useState({});
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    getUserData();
  }, [userId]);

  useEffect(() => {
    getCardData();
  }, [userId]);

  const getUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/get/${userId}`, {
        method: "GET",
        headers: {
          "auth-token": token,
        },
      });
      const data = await response.json();
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getCardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/user/get-student-card/${userId}`,
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const data = await response.json();
      setCard(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

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

  const showToast = () => {
    ToastAndroid.show("Button clicked!", ToastAndroid.SHORT);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.navigate("GenerateCard")}>
            <Ionicons
              name="duplicate"
              size={30}
              color="black"
              style={{ marginRight: 25 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{ marginRight: 25, fontWeight: "600" }}>Logout</Text>
            {/* <Ionicons
              name="log-out"
              size={32}
              color="red"
              style={{ marginRight: 25 }}
            /> */}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ScrollView>
          <View style={styles.container}>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Image style={styles.image} source={{ uri: user.profile }} />
              <TouchableOpacity onPress={showToast}>
                <Text
                  style={{
                    marginRight: 25,
                    backgroundColor: "white",
                    borderRadius: 25,
                    padding: 8,
                    shadowColor: "black",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowRadius: 2.62,
                    elevation: 4,
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginHorizontal: 15,
                padding: 10,
                borderRadius: 10,
                backgroundColor: "#fff",
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.text]}>First Name</Text>
                  <TextInput
                    style={[styles.input, { color: "black" }]}
                    value={card.firstName}
                    editable={false}
                  />
                </View>
                <View style={{ flex: 0.1 }}></View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.text]}>Last Name</Text>
                  <TextInput
                    style={[styles.input, { color: "black" }]}
                    value={card.lastName}
                    editable={false}
                  />
                </View>
              </View>

              <View style={{ marginTop: 8 }}>
                <Text style={[styles.text]}>Username</Text>
                <TextInput
                  style={[styles.input, { color: "black" }]}
                  value={user.username}
                  editable={false}
                />
              </View>
              <View style={{ marginTop: 8 }}>
                <Text style={[styles.text]}>Email</Text>
                <TextInput
                  style={[styles.input, { color: "black" }]}
                  value={user.email}
                  editable={false}
                  keyboardType="email-address"
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.text]}>Role</Text>
                  <TextInput
                    style={[styles.input, { color: "black" }]}
                    value={user.role === "admin" ? "Admin" : "Student"}
                    editable={false}
                  />
                </View>
                <View style={{ flex: 0.1 }}></View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.text]}>Gender</Text>
                  <TextInput
                    style={[styles.input, { color: "black" }]}
                    value={card.sex}
                    editable={false}
                  />
                </View>
              </View>
              <View style={{ marginTop: 8 }}>
                <Text style={styles.text}>Phone Number </Text>
                <TextInput
                  style={[styles.input, { color: "black" }]}
                  value={card.phoneNumber}
                  editable={false}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={{ marginTop: 8 }}>
                <Text style={[styles.text]}>Address</Text>
                <TextInput
                  style={[styles.input, { color: "black" }]}
                  value={card.address}
                  editable={false}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 25,
                marginBottom: 25,
              }}
            >
              <Image style={styles.qrCode} source={{ uri: card.qrCode }} />
            </View>

            {/* <View style={{ width: 150, alignItems: "center" }}>
              <Button title="Logout" onPress={handleLogout} a />
            </View>
            <View style={{ marginTop: 8 }}></View>
            <View style={{ width: 150 }}>
              <Button
                title="GenerateCard"
                onPress={() => navigation.navigate("GenerateCard")}
              />
            </View> */}
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // paddingHorizontal: 25,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderColor: "black",
    borderWidth: 1,
    objectFit: "fit",
    marginLeft: 25,
    marginVertical: 25,
  },
  input: {
    height: 40,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    padding: 10,
  },
  qrCode: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
  },
});
