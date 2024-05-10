import React, { useState, useEffect } from "react";
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
import { API_URL, useUserData } from "../../api/config";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";

export default function UpdateClass({ route }) {
  const { classId, classDescription, profile } = route.params;
  const [className, setClassName] = useState(classDescription);
  const [classImage, setClassImage] = useState(profile);
  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const { token, userId } = useUserData();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const pickImage = async () => {
    setLoading(true);
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.3,
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

        setClassImage(manipResult.uri);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error picking image", error);
    }
  };

  const handleUpdateClass = async () => {
    setLoading(true);
    setError(null);

    if (!className) {
      setLoading(false);
      return setError("Class name is required");
    }

    if (!classImage) {
      setLoading(false);
      return setError("Please upload a class image");
    }

    const formData = new FormData();
    formData.append("className", className);
    formData.append("classImage", {
      uri: classImage,
      name: "classImage.jpg",
      type: "image/jpeg",
    }); // remove the extra object

    try {
      const response = await axios.patch(
        `${API_URL}/class/update-class/${classId}`,
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
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
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
            source={{ uri: classImage }}
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
            <Image source={{ uri: classImage }} style={styles.image} />
          </TouchableOpacity>

          <TouchableOpacity onPress={pickImage}>
            <Text style={{ color: "#2F3791", marginTop: 10 }}>
              Change Photo
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.form}>
          <TextInput
            style={styles.textInput}
            placeholder="Class Name"
            value={className}
            onChangeText={setClassName}
          />
        </View>

        {error && <Text style={{ color: "red" }}>{error}</Text>}

        <TouchableOpacity
          style={{
            backgroundColor: "#2F3791",
            padding: 15,
            borderRadius: 5,
            height: 50,
            width: "90%",
            alignItems: "center",
          }}
          onPress={handleUpdateClass}
        >
          <Text style={{ color: "#fff" }}>
            {loading ? <ActivityIndicator color="white" /> : "Update"}
          </Text>
        </TouchableOpacity>
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
    color: "#000",
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
    backgroundColor: "#eee",
    height: 50,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
});
