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
import { LinearGradient } from "expo-linear-gradient";
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

  const hashUserId = (userId) => {
    if (!userId) {
      return "";
    }

    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      let char = userId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash % 1000000)
      .toString()
      .padStart(6, "0");
  };

  // console.log(token);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={{ marginRight: 25, fontWeight: "600", fontSize: 18 }}>
              Log Out
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("GenerateCard", {
                token: token,
              })
            }
          >
            <Ionicons
              name="pencil-sharp"
              size={30}
              color="black"
              style={{ marginRight: 25 }}
            />
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
        <ScrollView style={styles.container}>
          <View style={{ alignItems: "center" }}>
            <Image style={styles.image} source={{ uri: user.profile }} />
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              {card.lastName} {card.firstName}
            </Text>
            <Text style={{ fontWeight: "300", fontSize: 14, color: "#7E7E7E" }}>
              {user.email}
            </Text>
            <LinearGradient
              style={[styles.card]}
              colors={["#2F3791", "#8089EB"]}
              start={{ x: 0, y: 0.7 }}
              end={{ x: 0.3, y: 0 }}
            >
              <View
                style={[
                  styles.rowItem,
                  { justifyContent: "space-between", alignItems: "flex-start" },
                ]}
              >
                <Text style={styles.header}>Student ID Card</Text>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={[
                      styles.text,
                      {
                        fontSize: 12,
                        backgroundColor: user.verified ? "green" : "red",
                        padding: 5,
                        borderRadius: 5,
                      },
                    ]}
                  >
                    {user.verified ? "Verified" : "Not Verified"}
                  </Text>
                  <Text style={styles.text}>
                    Student ID: {hashUserId(card.userId)}
                  </Text>
                </View>
              </View>
              <View
                style={[styles.rowItem, { justifyContent: "space-between" }]}
              >
                <Text style={styles.text}>
                  <Text style={{ fontWeight: "bold" }}>Name: </Text>{" "}
                  {card.lastName} {card.firstName}
                </Text>
              </View>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Date of Birth:</Text>{" "}
                {new Date(card.dateOfBirth).toLocaleDateString()}
              </Text>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Gender: </Text> Gender:{" "}
                {card.sex}
              </Text>
              <Text style={styles.text}>
                <Text style={{ fontWeight: "bold" }}>Address: </Text>{" "}
                {card.address}
              </Text>
            </LinearGradient>
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
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 80,
    borderColor: "black",
    borderWidth: 1,
    objectFit: "fit",
    marginTop: 25,
    marginBottom: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  text: {
    fontSize: 14,
    color: "white",
  },
  card: {
    padding: 10,
    flexDirection: "column",
    width: "90%",
    height: 200,
    borderRadius: 5,
    marginTop: 25,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  rowItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
  },
  qrCode: {
    width: 320,
    height: 320,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
  },
});
