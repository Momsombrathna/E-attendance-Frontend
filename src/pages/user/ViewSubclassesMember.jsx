import React, { useState, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL, useUserData } from "../../api/config";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
} from "react-native";
import { ThemeContext } from "../../hooks/ThemeContext";

export default function ViewSubclassesMember({ route }) {
  const { classId, token } = route.params;
  const [classData, setClassData] = useState({ students: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { darkMode } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    main: {
      flex: 1,
      backgroundColor: darkMode ? "#000" : "#fff",
      justifyContent: "center",
    },
    content: {
      flexDirection: "row",
      margin: 2,
      marginHorizontal: 5,
      padding: 5,
      borderRadius: 5,
      backgroundColor: darkMode ? "#333" : "#eee",
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    textView: {
      marginLeft: 10,
      justifyContent: "center",
    },
    text: {
      fontSize: 16,
      color: darkMode ? "#fff" : "#000",
    },
    owner: {
      color: "#2F3791",
    },
    joinedDate: {
      fontSize: 12,
      color: darkMode ? "#ddd" : "#666",
    },
    error: {
      color: "red",
    },
  });

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
      setClassData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getClassData();
    }, [classId])
  );

  // console.log(token);
  return (
    <View style={styles.main}>
      {loading ? (
        <ActivityIndicator size="large" color="#eee" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={classData.students}
          keyExtractor={(item) => item.studentId.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.content}>
              <Image
                source={{ uri: item.studentProfile }}
                style={styles.image}
              />
              <View style={styles.textView}>
                <Text style={styles.text}>
                  {item.studentName}
                  {index === 0 && <Text style={styles.owner}> (Owner)</Text>}
                </Text>
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
          )}
        />
      )}
    </View>
  );
}
