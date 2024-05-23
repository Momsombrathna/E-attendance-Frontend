import React, { useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL, useUserData } from "../api/config";
import { ThemeContext } from "../hooks/ThemeContext";

const Classes = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [classData, setClass] = useState({});
  const { token, userId } = useUserData();

  const { darkMode } = useContext(ThemeContext);

  const styles = darkMode ? darkStyles : lightStyles;

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
      setClass(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getClassData();
    }, [userId])
  );

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
            <View style={{ margin: -2 }}>
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
                    <Text style={styles.nameText}>Owner: {item.ownerName}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Classes;

const lightStyles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
  },
  container: {
    padding: 10,
    margin: 5,
    borderStartColor: "#2F3791",
    borderStartWidth: 5,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
});

const darkStyles = StyleSheet.create({
  ...lightStyles,
  main: {
    ...lightStyles.main,
    backgroundColor: "#333",
  },
  container: {
    ...lightStyles.container,
    borderStartColor: "#fffa",
    backgroundColor: "#555",
  },
  text: {
    ...lightStyles.text,
    color: "#fff",
  },
  nameText: {
    ...lightStyles.nameText,
    color: "#ccc",
  },
});
