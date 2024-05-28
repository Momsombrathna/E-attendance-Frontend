import React, { useEffect, useState, useContext } from "react";
import {
  Text,
  View,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { API_URL, useUserData } from "../api/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../hooks/ThemeContext";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import moment from "moment";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import LoadingScreen from "./LoadingScreen";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Profile() {
  const navigation = useNavigation();
  const { userId, token } = useUserData();
  const [user, setUser] = useState({});
  const [card, setCard] = useState({});
  const [loading, setLoading] = useState(false);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const qrCodeRef = React.useRef();

  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    getUserData();
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

  const captureAndSaveImage = async () => {
    try {
      const uri = await qrCodeRef.current.capture();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "Image saved to device!");
    } catch (error) {
      console.error("Error saving image to device:", error);
      Alert.alert("Error", "Failed to save image to device");
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* <TouchableOpacity
            onPress={() =>
              navigation.navigate("GenerateCard", {
                token: token,
              })
            }
          >
            <Icon
              name="edit"
              size={24}
              color={darkMode ? "#fff" : "#2F3791"}
              style={{ marginRight: 25 }}
            />
          </TouchableOpacity> */}
          <TouchableOpacity onPress={handleLogout}>
            <Icon
              name="sign-out"
              size={24}
              color={darkMode ? "#fff" : "#444"}
              style={{ marginRight: 25 }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, darkMode]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? "#333" : "#fff",
      width: "100%",
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 50,
      objectFit: "fit",
    },
    userName: {
      fontSize: 24,
      fontWeight: "bold",
      color: darkMode ? "#fff" : "#444",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    userEmail: {
      fontSize: 14,
      color: darkMode ? "#fff" : "#444",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
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
    qrCodeContainer: {
      width: 100,
      height: 100,
      borderRadius: 10,
      borderColor: "black",
      borderWidth: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    userProfileContainer: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 10,
      width: "90%",
      height: 150,
      padding: 10,
      marginTop: 10,
      borderRadius: 5,
    },
    textsContainer: {
      gap: 5,
      paddingHorizontal: 10,
      height: "100%",
      marginTop: 10,
      width: "70%",
      backgroundColor: darkMode ? "#444" : "#eee",
      padding: 5,
      borderRadius: 10,
      alignItems: "start",
      justifyContent: "center",
      marginBottom: 10,
    },
    profileImageContainer: {
      height: "100%",
      backgroundColor: darkMode ? "#444" : "#eee",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 10,
    },
    cardsContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    edit: {
      flexDirection: "row",
      gap: 10,
      width: "90%",
    },
    editProfile: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 10,
      backgroundColor: darkMode ? "#444" : "#eee",
    },
    editProfileButton: {
      flex: 1,
      marginBottom: 10,
    },
  });

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ScrollView style={styles.container}>
          <View style={{ alignItems: "center" }}>
            <View style={styles.userProfileContainer}>
              <View style={styles.profileImageContainer}>
                <Image
                  style={styles.image}
                  source={{ uri: user.profile }}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.textsContainer}>
                <Text style={styles.userName}>
                  {user.username}{" "}
                  {user.verified ? (
                    <View
                      style={{
                        backgroundColor: "green",
                        padding: 2,
                        borderRadius: 20,
                      }}
                    >
                      <Icon name="check" size={16} color="white" />
                    </View>
                  ) : (
                    <Icon name="times" size={16} color="red" />
                  )}
                </Text>

                <Text style={styles.userEmail}>{user.email}</Text>

                <Text style={styles.userEmail}>
                  Role:{" "}
                  {
                    <Text
                      style={{
                        color:
                          user.role === "admin"
                            ? darkMode
                              ? "yellow"
                              : "purple"
                            : darkMode
                            ? "#fff"
                            : "#444",
                      }}
                    >
                      {user.role}
                    </Text>
                  }
                </Text>
                <Text style={styles.userEmail}>
                  Created At: {moment(user.created).format("LL")}
                </Text>
              </View>
            </View>

            <View style={styles.edit}>
              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={() =>
                  navigation.navigate("GenerateCard", {
                    token: token,
                  })
                }
              >
                <View style={styles.editProfile}>
                  <Icon
                    name="edit"
                    size={24}
                    color={darkMode ? "#fff" : "#444"}
                    style={{ marginRight: 10 }}
                  />
                  <Text style={{ color: darkMode ? "#fff" : "#444" }}>
                    Edit Profile
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editProfileButton}
                onPress={() =>
                  card.message
                    ? navigation.navigate("GenerateCard")
                    : navigation.navigate("EditCard", { card: card })
                }
              >
                <View style={styles.editProfile}>
                  {card.message ? (
                    <Icon
                      name="id-card"
                      size={24}
                      color={darkMode ? "#fff" : "#444"}
                      style={{ marginRight: 10 }}
                    />
                  ) : (
                    <Icon
                      name="edit"
                      size={24}
                      color={darkMode ? "#fff" : "#444"}
                      style={{ marginRight: 10 }}
                    />
                  )}
                  <Text style={{ color: darkMode ? "#fff" : "#444" }}>
                    {card.message ? "Create Card" : "Edit Card"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.cardsContainer}>
              {card.message ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "90%",
                    height: 500,
                    borderRadius: 10,
                    backgroundColor: darkMode ? "#444" : "#eee",
                  }}
                >
                  <Icon name="exclamation-triangle" size={50} color="#ccc" />
                  <Text style={{ color: "#ccc", fontSize: 20, marginTop: 10 }}>
                    No card found
                  </Text>
                </View>
              ) : (
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
                          <Text style={{ fontWeight: "bold" }}>
                            Date of Birth:
                          </Text>{" "}
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
                          {/* <Image
                        source={{ uri: card.qrCode }}
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "contain",
                        }}
                      /> */}
                          <ViewShot
                            ref={qrCodeRef}
                            style={{ padding: 10, backgroundColor: "#fff" }}
                          >
                            <QRCode
                              value={card.userId}
                              size={300}
                              backgroundColor="#fff"
                              color="#000"
                              padding={10}
                              logo={{ uri: card.profile }}
                            />
                          </ViewShot>
                          <TouchableOpacity
                            style={{ position: "absolute", top: 50, right: 20 }}
                            onPress={() => captureAndSaveImage()}
                          >
                            <Text style={{ color: "white", fontSize: 20 }}>
                              Save
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={{ position: "absolute", top: 53, left: 20 }}
                            onPress={() => setImageModalVisible(false)}
                          >
                            <Text style={{ color: "white", fontSize: 20 }}>
                              Close
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </Modal>
                      <TouchableOpacity
                        onPress={() => setImageModalVisible(true)}
                      >
                        <View style={styles.qrCodeContainer}>
                          <QRCode value={card.userId} />
                        </View>
                        {/* <Image
                      style={styles.qrCode}
                      source={{ uri: card.qrCode }}
                    /> */}
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient>
              )}
            </View>
          </View>
        </ScrollView>
      )}
    </>
  );
}
