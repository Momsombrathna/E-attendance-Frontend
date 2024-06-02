import React, { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import { ThemeContext } from "../../hooks/ThemeContext";
import { API_URL, useUserData } from "../../api/config";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";

export default function UpdateProfile({ route }) {
  const { token, userId, userProfile, name } = route.params;
  const [profileName, setProfileName] = useState(name);
  const [profileImage, setProfileImage] = useState(userProfile);
  const [isImageModalVisible, setImageModalVisible] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const { darkMode } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: darkMode ? "#333" : "#FFFFFF",
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
      color: darkMode ? "#FFFFFF" : "#000000",
      opacity: 0.7,
      fontWeight: "bold",
    },
    image: {
      width: 160,
      height: 160,
      borderRadius: 80,
    },
    form: {
      marginTop: 20,
      width: "90%",
    },
    textInput: {
      backgroundColor: darkMode ? "#444" : "#F5F5F5",
      color: darkMode ? "#FFFFFF" : "#000000",
      height: 50,
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
    },
  });

  const pickImage = async () => {
    setLoading(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      if (result.cancelled) {
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

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError(null);

    if (!profileName) {
      setLoading(false);
      return setError("Class name is required");
    }

    if (profileName.length < 3) {
      setLoading(false);
      return setError("Class name must be at least 3 characters long");
    }

    if (profileName.length > 20) {
      setLoading(false);
      return setError("Class name must be less than 20 characters long");
    }

    // not allowing special characters
    if (!/^[a-zA-Z0-9_ ]*$/.test(profileName)) {
      setLoading(false);
      return setError("Class name must not contain special characters");
    }

    if (!profileImage) {
      setLoading(false);
      return setError("Please upload a class image");
    }

    const formData = new FormData();
    formData.append("username", profileName);
    formData.append("profileImage", {
      uri: profileImage,
      name: "profileImage.jpg",
      type: "image/jpeg",
    }); // remove the extra object

    try {
      const response = await axios.patch(
        `${API_URL}/user/update/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "auth-token": token,
          },
        }
      );

      if (response.status === 200) {
        setLoading(false);
        navigation.goBack();
      } else {
        setLoading(false);
        setError(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setError(error.response.data.message);
      } else if (error.request) {
        setError("No response received from server.");
      } else {
        setError("Error in setting up the request.");
      }
    }
  };

  return (
    <View style={styles.container}>
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
            source={{ uri: profileImage }}
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

      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setImageModalVisible(true)}>
            <Image
              source={{ uri: `${profileImage}?t=${Date.now()}` }}
              style={styles.image}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={pickImage}>
            <Text
              style={{
                color: darkMode ? "#FFFFFF" : "#2F3791",
                marginTop: 10,
              }}
            >
              Change Photo
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            value={profileName}
            onChangeText={setProfileName}
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#2F3791",
            padding: 15,
            borderRadius: 5,
            height: 50,
            width: "90%",
            alignItems: "center",
          }}
          onPress={handleUpdateProfile}
        >
          <Text style={{ color: "#fff" }}>
            {loading ? <ActivityIndicator color="white" /> : "Update"}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 10,
            width: "90%",
          }}
        >
          {error && <Text style={{ color: "red" }}>{error}</Text>}
        </View>
      </View>
    </View>
  );
}
