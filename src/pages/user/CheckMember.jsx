import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
  Button,
  Platform,
  FlatList,
} from "react-native";

export default function CheckMember({ route }) {
  const { item } = route.params;
  return (
    <View style={styles.main}>
      <FlatList
        data={Object.entries(item.attendances)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.content}>
            <Image
              source={{ uri: item[1].studentProfile }}
              style={{ width: 80, height: 80 }}
            />
            <Text>{item[1].studentName}</Text>

            <Text>
              Checked In:
              {item[1].checkedIn === true ? (
                <Text>Check In at {item[1].checkedInTime}</Text>
              ) : (
                <Text>Not now</Text>
              )}
            </Text>
            <Text>
              Checked Out:{" "}
              {item[1].checkedOut === true ? (
                <Text>Check Out at {item[1].checkedOutTime}</Text>
              ) : (
                <Text>Not now</Text>
              )}
            </Text>

            <Text>Status: {item[1].status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  button: {
    backgroundColor: "#f194ff",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },

  buttonText: {
    color: "white",
    textAlign: "center",
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
});
