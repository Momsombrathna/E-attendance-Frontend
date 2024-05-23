import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { API_URL } from "../../api/config";
import axios from "axios";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ShowCode({ route }) {
  const { code, classId, token } = route.params;
  const [codeData, setCodeData] = useState(code.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const viewShotRef = useRef();

  const handleRefreshCode = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.patch(
        `${API_URL}/class/refresh-code/${classId}`,
        {},
        {
          headers: {
            "auth-token": token,
          },
        }
      );
      setCodeData(response.data.code.toString());
      setLoading(false);
    } catch (error) {
      setError("Error refreshing code");
      setLoading(false);
    }
  };

  const textToQrCode = () => {
    const size = 200;
    const text = codeData;
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=${text}&size=${size}x${size}&bgcolor=ffffff&color=000000`;
    return qrCode;
  };

  const captureAndSaveImage = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success", "Image saved to device!");
    } catch (error) {
      console.error("Error saving image to device:", error);
      Alert.alert("Error", "Failed to save image to device");
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <ViewShot
          ref={viewShotRef}
          style={{
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          options={{ format: "jpg", quality: 1.0 }}
        >
          <Text style={styles.text}>Scan the QR code to join the class</Text>
          {loading ? (
            <View
              style={{
                width: 200,
                height: 200,
                marginTop: 10,
                marginBottom: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator size="large" color="#2F3791" />
            </View>
          ) : (
            <View style={styles.qrCodeContainer}>
              <Image
                source={{ uri: textToQrCode() }}
                style={{
                  width: 200,
                  height: 200,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              />
            </View>
          )}

          <View style={styles.codeContainer}>
            <Text style={styles.text}>Or enter this code: </Text>
            <View style={styles.codeText}>
              <Text style={{ color: "#fff", fontSize: 18 }}>{codeData}</Text>
            </View>
          </View>
        </ViewShot>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.icon} onPress={handleRefreshCode}>
            <Icon name="refresh" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon} onPress={captureAndSaveImage}>
            <Icon name="download" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {error ? (
          <Text style={{ color: "red", fontSize: 16, marginTop: 10 }}>
            {error}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    margin: 5,
    textAlign: "center",
  },
  classText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "sans-serif",
    color: "#000000",
    opacity: 0.8,
    fontWeight: "bold",
  },
  codeText: {
    backgroundColor: "#2F3791",
    opacity: 0.9,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  qrCodeContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  codeContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  classContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 30,
    display: "flex",
    flexDirection: "row",
    gap: 20,
    justifyContent: "space-between",
  },
  icon: {
    padding: 10,
    backgroundColor: "#2F3791",
    borderRadius: 5,
  },
});
