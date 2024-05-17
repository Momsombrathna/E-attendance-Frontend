import React, { useState } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { API_URL, useUserData } from "../../api/config";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export default function ViewMember({ route }) {
  const { classId, token } = route.params;
  const { userId } = useUserData();
  const [getClass, setGetClass] = useState({});
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  const getClassData = async () => {
    setLoading(true);
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

  console.log(getClass.students);

  return (
    <View style={styles.main}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={getClass.students}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <Text> {item}</Text>}
        />
      )}
    </View>
  );
}

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
});
