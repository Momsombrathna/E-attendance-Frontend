import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { API_URL, useUserData } from "../api/config";
import { renderRightAction } from "./partials/Swapeable";
import axios from "axios";
import { ThemeContext } from "../hooks/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome";

const MyClasses = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [classData, setClass] = useState({});
  const { token, userId } = useUserData();
  const [refreshing, setRefreshing] = useState(false);

  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    getClassData();
  }, [userId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await getClassData();
    setRefreshing(false);
  };

  const getClassData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/user/get-class-owner/${userId}`,
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const data = await response.json();
      setClass(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const renderRightActions = (progress, classId, classDescription, profile) => (
    <View style={{ width: 190, flexDirection: "row" }}>
      {renderRightAction(
        "Edit",
        "#2F3791",
        192,
        progress,
        () => {
          navigation.navigate("UpdateClass", {
            classId,
            classDescription,
            profile,
          });
        },
        "pencil"
      )}
      {renderRightAction(
        "Delete",
        "#FF453A",
        128,
        progress,
        () => {
          Alert.alert("Delete", "Are you sure you want to delete this class?", [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => handleDelete(classId),
              style: "destructive",
            },
          ]);
        },
        "trash"
      )}
    </View>
  );

  const handleDelete = async (classId) => {
    try {
      const response = await axios({
        method: "delete",
        url: `${API_URL}/class/delete-class/${classId}`,
        data: {
          userId,
        },
        headers: {
          "auth-token": token,
        },
      });

      if (response.status === 200) {
        setLoading(false);
        setClass(classData.filter((cls) => cls._id !== classId));
      } else {
        setLoading(false);
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    main: {
      flex: 1,
      backgroundColor: darkMode ? "#333" : "#fff",
      paddingHorizontal: 5,
    },
    container: {
      margin: 5,
      padding: 5,
      borderRadius: 5,
      borderStartColor: "#2F3791",
      borderStartWidth: 7,
      backgroundColor: darkMode ? "#444" : "#f2f2f2",
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      height: 60,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 10,
    },
    text: {
      fontSize: 18,
      maxWidth: 200,
      color: darkMode ? "#eee" : "#333",
    },
    nameText: {
      marginTop: 5,
      fontSize: 14,
      color: darkMode ? "#eee" : "#333",
    },
    textView: {
      justifyContent: "center",
      flexDirection: "column",
    },
    viewsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    studentCount: {
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      height: 20,
      backgroundColor: "#eee",
      borderRadius: 10,
    },
    studentCountText: {
      color: darkMode ? "#333" : "#eee",
      fontSize: 12,
    },
  });

  const skeletonItem = () => (
    <View style={{ margin: -2 }}>
      <View style={styles.container}>
        <View style={styles.content}>
          <LinearGradient
            colors={["#cccccc", "#bbbbbb", "#cccccc"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.image}
          />
          <View style={styles.textView}>
            <LinearGradient
              colors={["#cccccc", "#bbbbbb", "#cccccc"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: 200, height: 20, borderRadius: 5 }}
            />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.main}>
      {loading ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 7, 8, 9, 10]}
          keyExtractor={(item) => item.toString()}
          renderItem={() => skeletonItem()}
        />
      ) : classData.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Icon name="exclamation-triangle" size={50} color="#ccc" />
          <Text style={{ color: "#ccc", fontSize: 20, marginTop: 10 }}>
            No class found
          </Text>
        </View>
      ) : (
        <FlatList
          data={classData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={{ margin: -2 }}>
              <Swipeable
                friction={2}
                rightThreshold={1}
                renderRightActions={(progress) =>
                  renderRightActions(
                    progress,
                    item._id,
                    item.className,
                    item.classProfile
                  )
                }
              >
                <TouchableOpacity
                  style={styles.container}
                  onPress={() =>
                    navigation.navigate("MySubClass", {
                      classId: item._id,
                      token: token,
                      code: item.code,
                      className: item.className,
                      classProfile: item.classProfile,
                    })
                  }
                >
                  <View style={styles.viewsContainer}>
                    <View style={styles.content}>
                      <Image
                        source={{ uri: `${item.classProfile}?t=${Date.now()}` }}
                        style={styles.image}
                      />
                      <View style={styles.textView}>
                        <Text
                          style={styles.text}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.className}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Swipeable>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#fff"]}
              tintColor={darkMode ? "#fff" : "#eee"}
            />
          }
        />
      )}
    </View>
  );
};

export default MyClasses;
