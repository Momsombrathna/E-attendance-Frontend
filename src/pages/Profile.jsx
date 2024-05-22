import React, { useEffect, useState, useContext } from "react";

import {
  Text,
  View,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { API_URL, useUserData } from "../api/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../hooks/ThemeContext";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import moment from "moment";

import LoadingScreen from "./LoadingScreen";

export default function Profile() {
  const navigation = useNavigation();
  const { userId, token } = useUserData();
  const [user, setUser] = useState({});
  const [card, setCard] = useState({});
  const [loading, setLoading] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);

  const { darkMode } = useContext(ThemeContext);

  const styles = darkMode ? darkStyles : lightStyles;

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

  const handleDownload = async (uri) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Please allow permissions to download");
      return;
    }

    let date = moment().format("YYYYMMDDhhmmss");
    let fileUri = FileSystem.documentDirectory + `${date}.jpg`;

    try {
      const res = await FileSystem.downloadAsync(uri, fileUri);
      saveFile(res.uri);
      alert("File saved successfully");
    } catch (err) {
      console.log("FS Err: ", err);
    }
  };
  const saveFile = async (fileUri) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      const album = await MediaLibrary.getAlbumAsync("Download");
      if (album == null) {
        await MediaLibrary.createAlbumAsync("Download", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }
    } catch (err) {
      console.log("Save err: ", err);
    }
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
            <Text style={styles.userName}>
              {card.lastName} {card.firstName}
            </Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <LinearGradient
              style={[styles.card]}
              colors={darkMode ? ["#333", "#555"] : ["#2F3791", "#8089EB"]}
              start={{ x: 0, y: 0.7 }}
              end={{ x: 0.3, y: 0 }}
            >
              <View
                style={[
                  styles.container,
                  {
                    backgroundColor: "transparent",
                    justifyContent: "space-between",
                  },
                ]}
              >
                <View
                  style={[
                    styles.rowItem,
                    {
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    },
                  ]}
                >
                  <Image
                    style={[styles.qrCode, { width: 80, height: 80 }]}
                    source={{ uri: card.profile }}
                  />
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

                <View style={[styles.rowItem, { alignItems: "center" }]}>
                  <View style={{ alignItems: "flex-start" }}>
                    <Text style={styles.text}>
                      <Text style={{ fontWeight: "bold" }}>Name: </Text>{" "}
                      {card.lastName} {card.firstName}
                    </Text>
                    <Text style={styles.text}>
                      <Text style={{ fontWeight: "bold" }}>Date of Birth:</Text>{" "}
                      {new Date(card.dateOfBirth).toLocaleDateString()}
                    </Text>
                    <Text style={styles.text}>
                      <Text style={{ fontWeight: "bold" }}>Gender: </Text>{" "}
                      {card.sex}
                    </Text>
                    <Text style={styles.text}>
                      <Text style={{ fontWeight: "bold" }}>Address: </Text>{" "}
                      {card.address}
                    </Text>
                    <Text style={styles.text}>
                      <Text style={{ fontWeight: "bold" }}>Phone: </Text>{" "}
                      {card.phoneNumber}
                    </Text>
                  </View>
                  <Modal
                    animationType="slide"
                    transparent={false}
                    visible={isImageModalVisible}
                    onRequestClose={() => {
                      setImageModalVisible(!isImageModalVisible);
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: "black",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={{ uri: card.qrCode }}
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "contain",
                        }}
                      />
                      <TouchableOpacity
                        style={{ position: "absolute", bottom: 150 }}
                        onPress={() => handleDownload(card.qrCode)}
                      >
                        <Ionicons
                          name="download-outline"
                          color={"white"}
                          size={24}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{ position: "absolute", top: 50, right: 20 }}
                        onPress={() => setImageModalVisible(false)}
                      >
                        <Text style={{ color: "white", fontSize: 20 }}>
                          Close
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Modal>
                  <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                    <Image
                      style={styles.qrCode}
                      source={{ uri: card.qrCode }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const lightStyles = StyleSheet.create({
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
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  userEmail: {
    fontSize: 14,
    color: "#919191",
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
  },
  rowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  qrCode: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
  },
});

const darkStyles = StyleSheet.create({
  ...lightStyles,
  container: {
    ...lightStyles.container,
    backgroundColor: "#333",
  },
  image: {
    ...lightStyles.image,
    borderColor: "white",
  },
  userName: {
    ...lightStyles.userName,
    color: "white",
  },
  userEmail: {
    ...lightStyles.userEmail,
    color: "#919191",
  },
  card: {
    ...lightStyles.card,
    backgroundColor: "#555",
  },
  qrCode: {
    ...lightStyles.qrCode,
    borderColor: "white",
  },
});
