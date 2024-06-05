// Import necessary libaries
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";
import { useUserData, API_URL } from "../../api/config";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";
import { ThemeContext } from "../../hooks/ThemeContext";
import Dropdown from "../partials/CustomDropdown";

export default function EditCard({ route }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { card } = route.params;
  const [profile, setProfile] = useState(card.profile);
  const [firstName, setFirstName] = useState(card.firstName);
  const [lastName, setLastName] = useState(card.lastName);
  const [sex, setSex] = useState(card.sex);
  const [age, setAge] = useState(card.age);
  const [dateOfBirth, setDateOfBirth] = useState(card.dateOfBirth);
  const [address, setAddress] = useState(card.address);
  const [phoneNumber, setPhoneNumber] = useState(card.phoneNumber);
  const [email, setEmail] = useState(card.email);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { userId, token } = useUserData();
  const navigation = useNavigation();

  const [profileImage, setProfileImage] = useState(card.profile);
  const [isImageModalVisible, setImageModalVisible] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: darkMode ? "#000" : "#fff",
    },

    input: {
      height: 50,
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
      backgroundColor: "#2F3791",
      padding: 5,
      borderRadius: 5,
      marginBottom: 40,
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
    editProfile: {
      width: "40%",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      borderRadius: 10,
      backgroundColor: darkMode ? "#444" : "#eee",
      marginBottom: 10,
    },
  });

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date.toLocaleDateString());
    console.log("raw date", date);
    setDateOfBirth(date);
    hideDatePicker();
  };

  const { darkMode } = useContext(ThemeContext);

  const pickImage = async () => {
    setLoading(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (result.canceled) {
        setLoading(false);
        setError("Image picker cancelled");
      } else if (!result.assets || !result.assets[0].uri) {
        setLoading(false);
        setError("Image picker error");
      } else {
        const manipResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 400 } }],
          { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
        );

        setProfileImage(manipResult.uri);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error picking image", error);
    }
  };

  const handleEditCard = async () => {
    setLoading(true);
    setError("");

    if (
      !profile ||
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

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("sex", sex);
    formData.append("age", age);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("address", address);
    formData.append("phoneNumber", phoneNumber);
    formData.append("email", email);
    formData.append("profileImage", {
      uri: profileImage,
      name: "profileImage.jpg",
      type: "image/jpeg",
    });

    try {
      const respones = await axios.put(
        `${API_URL}/card/update-student-card/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "auth-token": token,
          },
        }
      );
      if (respones.status === 200) {
        setLoading(false);
        navigation.goBack();
      } else {
        setLoading(false);
        setError(respones.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isImageModalVisible}
        onRequestClose={() => {
          setImageModalVisible(!isImageModalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: `${profileImage}?t=${Date.now()}` }}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
          <TouchableOpacity
            style={{ position: "absolute", top: 50, right: 20 }}
            onPress={() => setImageModalVisible(false)}
          >
            <Text style={{ color: "white", fontSize: 20 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <View style={{ alignItems: "center" }}>
        <TouchableOpacity onPress={() => setImageModalVisible(true)}>
          <Image
            source={{ uri: `${profileImage}?t=${Date.now()}` }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              borderRadius: 10,
              borderColor: "black",
              borderWidth: 1,
              margin: 10,
            }}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={pickImage}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.editProfile}>
            <Icon
              name="edit"
              size={24}
              color={darkMode ? "#fff" : "#444"}
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: darkMode ? "#fff" : "#444" }}>
              Edit Profile
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TextInput
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
      <Dropdown
        data={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ]}
        placeholder={sex}
        onChange={(value) => setSex(value)}
      />
      <TextInput
        value={age.toString()}
        onChangeText={setAge}
        inputMode="numeric"
        style={styles.input}
        placeholderTextColor={styles.placeholderText.color}
      />
      <View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
      <TouchableOpacity onPress={showDatePicker}>
        <TextInput
          value={moment(dateOfBirth).format("DD/MMM/yyyy")}
          style={styles.input}
          placeholderTextColor={styles.placeholderText.color}
          editable={false} // Disable editing of the input field
        />
      </TouchableOpacity>

      <TextInput
        value={address}
        onChangeText={setAddress}
        style={styles.input}
        placeholderTextColor={styles.placeholderText.color}
      />
      <TextInput
        placeholder="Phone Number"
        inputMode="numeric"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        placeholderTextColor={styles.placeholderText.color}
      />
      <TextInput
        placeholder="Email"
        value={email}
        inputMode="email"
        onChangeText={setEmail}
        style={styles.input}
        placeholderTextColor={styles.placeholderText.color}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.btn}>
        <TouchableOpacity style={styles.button} onPress={handleEditCard}>
          <Text style={{ color: "#fff", textAlign: "center" }}>
            {loading ? <ActivityIndicator color="#fff" /> : "Update"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
