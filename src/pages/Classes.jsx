import React, { useState, useContext, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_URL, useUserData } from "../api/config";
import { LinearGradient } from "expo-linear-gradient";
import { ThemeContext } from "../hooks/ThemeContext";
import { renderRightAction } from "./partials/Swapeable";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

const Classes = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState([]);
  const { token, userId } = useUserData();
  const [refreshing, setRefreshing] = useState(false);
  const { darkMode } = useContext(ThemeContext);

  const getClassData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/user/get-students-class/${userId}`,
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const data = await response.json();
      setClassData(data);
    } catch (error) {
      console.error("Error fetching class data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClassData();
  }, [userId]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getClassData();
    setRefreshing(false);
  }, [userId]);

  const renderRightActions = (progress, classId) => (
    <View style={{ width: 190, flexDirection: "row" }}>
      {renderRightAction(
        "Mute",
        "#FF9500",
        192,
        progress,
        () => {
          Alert.alert("Mute", "Are you sure you want to mute this class?", [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              style: "destructive",
            },
          ]);
        },
        "volume-off"
      )}
      {renderRightAction(
        "Leave",
        "#FF453A",
        128,
        progress,
        () => {
          Alert.alert("Leave", "Are you sure you want to leave this class?", [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => handleLeave(classId),
              style: "destructive",
            },
          ]);
        },
        "sign-out"
      )}
    </View>
  );

  const handleLeave = async (classId) => {
    try {
      const response = await fetch(`${API_URL}/class/leave-class/${classId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          userId: userId,
        }),
      });

      if (response.ok) {
        // filter the class out of the list
        const newClasses = classData.filter(
          (classItem) => classItem._id !== classId
        );
        setClassData(newClasses);
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to remove student. Please try again later.");
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
      color: darkMode ? "#eee" : "#333",
    },
    nameText: {
      marginTop: 5,
      fontSize: 12,
      color: darkMode ? "#ccc" : "#777",
    },
    textView: {
      justifyContent: "center",
      flexDirection: "column",
    },
  });

  const SkeletonItem = () => (
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
            <LinearGradient
              colors={["#cccccc", "#bbbbbb", "#cccccc"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: 100, height: 10, marginTop: 5, borderRadius: 5 }}
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
          data={Array(6).fill()}
          renderItem={SkeletonItem}
          keyExtractor={(item, index) => index.toString()}
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
                leftThreshold={1}
                renderRightActions={(progress) =>
                  renderRightActions(progress, item._id)
                }
              >
                <TouchableOpacity
                  style={styles.container}
                  onPress={() =>
                    navigation.navigate("SubClass", {
                      classId: item._id,
                      token: token,
                      className: item.className,
                    })
                  }
                >
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
                      <Text style={styles.nameText}>
                        Owner: {item.ownerName}
                      </Text>
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

export default Classes;
