import React, { useState, useEffect } from "react";
import { API_URL, useUserData } from "../../api/config";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function JoinClass(route) {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              value={""}
              placeholder="Enter Invite Code"
            />
            {/* {error && <Text style={styles.error}>{error}</Text>} */}
            <TouchableOpacity style={styles.button} onPress={{}}>
              <Text style={styles.buttonText}>
                {loading ? <ActivityIndicator color="white" /> : "Join"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  form: {
    flex: 1,
    height: 100,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#eee",
    height: 50,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#2F3791",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 16,
  },
});
