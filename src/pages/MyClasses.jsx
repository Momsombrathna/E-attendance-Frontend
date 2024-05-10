import React, { useEffect, useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { Swipeable } from "react-native-gesture-handler";
import { API_URL, useUserData } from "../api/config";
import { renderRightAction } from "./partials/Swapeable";
import axios from "axios";

const MyClasses = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [classData, setClass] = useState({});
  const { token, userId } = useUserData();

  useEffect(() => {
    getClassData();
  }, [userId]);

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
    <View style={{ width: 192, flexDirection: "row" }}>
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
        "pencil",
        70
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
        "trash",
        70
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

  return (
    <View style={styles.main}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#eee" />
        </View>
      ) : (
        <FlatList
          data={classData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Swipeable
              friction={2}
              rightThreshold={40}
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
                    className: item.className,
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
                      <Text style={styles.text}>{item.className}</Text>
                      <Text style={styles.nameText}>Code: {item.code}</Text>
                    </View>
                  </View>
                  <View style={styles.studentCount}>
                    <Text style={styles.studentCountText}>
                      {item.students.length - 1}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      )}
    </View>
  );
};

export default MyClasses;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
  },
  container: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
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
  },
  nameText: {
    marginTop: 5,
    fontSize: 14,
    color: "#666",
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
    color: "#000",
    fontSize: 12,
  },
});
