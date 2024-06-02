import React, { useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ThemeContext } from "../../hooks/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { API_URL, useUserData } from "../../api/config";
import { renderRightAction } from "../partials/Swapeable";
import axios from "axios";

export default function ViewMember({ route }) {
  const { classId, token } = route.params;
  const { userId } = useUserData();
  const [getClass, setGetClass] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const { darkMode } = useContext(ThemeContext);

  useFocusEffect(
    React.useCallback(() => {
      getClassData();
    }, [classId])
  );

  const getClassData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/class/get-class/${classId}`, {
        method: "GET",
        headers: {
          "auth-token": token,
        },
      });
      const data = await response.json();
      setGetClass(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  async function handleRemove(classId, userId, studentId) {
    try {
      const response = await fetch(`${API_URL}/class/kick-student/${classId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          userId,
          studentId,
        }),
      });

      if (response.ok) {
        // filter the student out of the class
        const newStudents = getClass.students.filter(
          (student) => student.studentId !== studentId
        );
        setGetClass({ ...getClass, students: newStudents });
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to remove student. Please try again later.");
    }
  }

  const renderRightActions = (progress, studentId) => (
    <View style={{ width: 190, flexDirection: "row" }}>
      {renderRightAction(
        "Edit",
        "#2F3791",
        192,
        progress,
        () => {
          Alert.alert("Edit", "Are you sure you want to edit this user?");
        },
        "pencil"
      )}
      {renderRightAction(
        "Remove",
        "#FF453A",
        128,
        progress,
        () => {
          Alert.alert(
            "Remove",
            "Are you sure you want to remove this user from the classes?",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => handleRemove(classId, userId, studentId),
                style: "destructive",
              },
            ]
          );
        },
        "trash"
      )}
    </View>
  );

  const styles = StyleSheet.create({
    main: {
      flex: 1,
      backgroundColor: darkMode ? "#333" : "#fff",
    },
    container: {
      height: 60,
      flex: 1,
      flexDirection: "row",
      padding: 10,
      backgroundColor: darkMode ? "#444" : "#eee",
      margin: 2,
      marginHorizontal: 5,
      borderRadius: 5,
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 50,
    },
    textView: {
      marginLeft: 10,
    },
    text: {
      fontSize: 18,
      color: darkMode ? "#fff" : "#000",
    },
    nameText: {
      fontSize: 14,
      color: darkMode ? "#999" : "#777",
    },
    textViews: {
      flex: 1,
      alignItems: "flex-end",
      justifyContent: "center",
      marginRight: 10,
    },
    joinedDate: {
      fontSize: 12,
      color: darkMode ? "#999" : "#777",
    },
  });

  return (
    <View style={styles.main}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#444" />
        </View>
      ) : (
        <FlatList
          data={getClass.students}
          keyExtractor={(item) => item.studentId.toString()}
          renderItem={({ item }) =>
            item.studentId === userId ? (
              <View style={styles.container}>
                <View style={styles.content}>
                  <Image
                    source={{ uri: item.studentProfile }}
                    style={styles.image}
                  />
                  <View style={styles.textView}>
                    <Text style={styles.text}>
                      {item.studentName}{" "}
                      <Text
                        style={{
                          color: "green",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        &#10003;
                      </Text>
                    </Text>
                    <Text style={styles.joinedDate}>
                      Created at:{" "}
                      {new Date(item.joined).toLocaleDateString("en-US", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                </View>
                <View style={styles.textViews}>
                  <Text style={styles.nameText}>Admin</Text>
                </View>
              </View>
            ) : (
              <Swipeable
                renderRightActions={(progress) =>
                  renderRightActions(progress, item.studentId)
                }
              >
                <View style={styles.container}>
                  <View style={styles.content}>
                    <Image
                      source={{ uri: item.studentProfile }}
                      style={styles.image}
                    />
                    <View style={styles.textView}>
                      <Text style={styles.text}>{item.studentName}</Text>
                      <Text style={styles.joinedDate}>
                        Joined at:{" "}
                        {new Date(item.joined).toLocaleDateString("en-US", {
                          month: "long",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.textViews}>
                    <Text style={styles.nameText}>&nbsp;</Text>
                  </View>
                </View>
              </Swipeable>
            )
          }
        />
      )}
    </View>
  );
}
