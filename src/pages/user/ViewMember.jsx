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

const dummyData = [
  {
    _id: "1",
    profile: "https://example.com/image1.jpg",
    username: "User 1",
    role: "user",
  },
  {
    _id: "2",
    profile: "https://example.com/image2.jpg",
    username: "User 2",
    role: "user",
  },
  // Add more dummy data here...
];

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

const ViewMember = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

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
          data={dummyData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.content}>
              <Image
                source={{ uri: `${item.classProfile}?t=${Date.now()}` }}
                style={styles.image}
              />
              <View style={styles.textView}>
                <Text style={styles.text}>{item.username}</Text>
                <Text style={styles.nameText}>
                  Role: {item.role === "admin" ? "Admin" : "Student"}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ViewMember;
