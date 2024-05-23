// Import necessary libaries
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserData, API_URL } from "../../api/config";
import { FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { ThemeContext } from "../../hooks/ThemeContext";

export default function GenerateCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const { userId, token } = useUserData();
  const navigation = useNavigation();

  const { darkMode } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      marginTop: 50,
      flex: 1,
      padding: 20,
      backgroundColor: darkMode ? "#000" : "#fff",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerText: {
      fontSize: 20,
      fontWeight: "bold",
      marginLeft: 20,
      color: darkMode ? "#fff" : "#000",
    },
    body: {
      marginTop: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: darkMode ? "#fff" : "gray",
      padding: 10,
      borderRadius: 5,
      marginBottom: 10,
      color: darkMode ? "#fff" : "#000",
      backgroundColor: darkMode ? "#333" : "#fff",
    },
    error: {
      color: "red",
      marginTop: 10,
    },
    btn: {
      marginTop: 20,
      backgroundColor:  "#2F3791",
      padding: 5,
      borderRadius: 5,
    },
    button: {
      backgroundColor: "#2F3791",
      padding: 10,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
    },
    placeholderText: {
      color: darkMode ? "#fff" : "gray",
    },
  });

  const handleGenerateCard = async () => {
    setLoading(true);
    setError("");

    if (
      !firstName ||
      !lastName ||
      !sex ||
      !age ||
      !dateOfBirth ||
      !address ||
      !phoneNumber ||
      !email
    ) {
      setLoading(false);
      return setError("Please fill all fields");
    }

    if (isNaN(age)) {
      setLoading(false);
      return setError("Age must be a number");
    }

    if (isNaN(phoneNumber)) {
      setLoading(false);
      return setError("Phone number must be a number");
    }

    if (age.length > 2) {
      setLoading(false);
      return setError("Age must be less than 100");
    }

    if (address.length < 10) {
      setLoading(false);
      return setError("Address must be more than 10 characters");
    }

    try {
      const response = await fetch(
        `${API_URL}/card/create-student-card/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            sex,
            age,
            dateOfBirth,
            address,
            phoneNumber,
          }),
        }
      );

      if (response.ok) {
        setLoading(false);
        Alert.alert("Card Generated Successfully");
        setFirstName("");
        setLastName("");
        setSex("");
        setAge("");
        setDateOfBirth("");
        setAddress("");
        setPhoneNumber("");
        setEmail("");
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
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5
          name="arrow-left"
          size={24}
          color={darkMode ? "#fff" : "black"}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Generate Card</Text>
      </View>
      <View style={styles.body}>
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
          placeholderTextColor={styles.placeholderText.color}
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
          placeholderTextColor={styles.placeholderText.color}
        />
        <TextInput
          placeholder="sex"
          value={sex}
          onChangeText={setSex}
          style={styles.input}
          placeholderTextColor={styles.placeholderText.color}
        />
        <TextInput
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          style={styles.input}
          placeholderTextColor={styles.placeholderText.color}
        />
        <TextInput
          placeholder="Date of Birth"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          style={styles.input}
          placeholderTextColor={styles.placeholderText.color}
        />
        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          placeholderTextColor={styles.placeholderText.color}
        />
        <TextInput
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
          placeholderTextColor={styles.placeholderText.color}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor={styles.placeholderText.color}
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.btn}>
        <TouchableOpacity style={styles.button} onPress={handleGenerateCard}>
          <Text style={{ color: "#fff", textAlign: "center" }}>
            {loading ? <ActivityIndicator color="#fff" /> : "Generate Card"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
