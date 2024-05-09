import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { API_URL, useUserData } from "../../api/config";

export default function UpdateClass({ route }) {
  const { classId, className, profile } = route.params;
  const { token, userId } = useUserData();
  const navigation = useNavigation();

  const handleUpdateClass = () => {
    // Your done function code here
  };

  useEffect(() => {
    navigation.setParams({ handleUpdateClass });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={{ uri: profile }} style={styles.image} />
          <Text style={styles.text}>Set new Photo</Text>
        </View>
        <View style={styles.form}>
          <TextInput style={styles.textInput} placeholder="Class Name">
            {className}
          </TextInput>
        </View>
        <TouchableOpacity></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    height: "100%",
  },
  content: {
    flexDirection: "column",
    justifyContent: "center",
    padding: 10,

    alignItems: "center",
  },
  header: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    color: "#2F3791",
    opacity: 0.9,
    fontWeight: "bold",
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
});
