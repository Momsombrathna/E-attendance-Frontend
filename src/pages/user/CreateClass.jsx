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
import { FontAwesome5 } from "@expo/vector-icons";

export default function CreateClass() {
  const { token, userId } = useUserData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [className, setClassName] = useState("");

  const navigation = useNavigation();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/class/create-class/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          className,
        }),
      });

      if (response.ok) {
        setLoading(false);
        const data = await response.json();
        setClassName("");
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }

      if (response.status === 400) {
        setLoading(false);
        const data = await response.json();
        setError(data.message);
      }

      if (!response.ok) {
        setLoading(false);
        const data = await response.json();

        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, backgroundColor: "white" }}
    >
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome5 name="arrow-left" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Create Class</Text>
          </View>
          <View style={styles.form}>
            <Text style={styles.text}>Class Name</Text>
            <TextInput
              style={styles.input}
              value={className}
              placeholder="Enter class name"
              onChangeText={setClassName}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>
                {loading ? <ActivityIndicator color="white" /> : "Create"}
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
    marginTop: 50,
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
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
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
