import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../../hooks/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { API_URL, useUserData } from "../../api/config";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function QrCodeScannerJoinClass() {
  const { userId, token } = useUserData();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const { darkMode } = useContext(ThemeContext);
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <ActivityIndicator />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const styles = darkMode ? darkStyles : lightStyles;

  const joinClass = async (codeScanned) => {
    setLoading(true);
    setError("");

    if (!code) {
      setError("Please enter a valid code");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/class/invite-by-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          code: codeScanned,
          userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        throw new Error(data.message);
      } else {
        navigation.goBack();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const barcodeScanned = (code) => {
    setCode(code);
    joinClass(code);
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <CameraView
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarCodeScanned={barcodeScanned}
            style={styles.camera}
            facing={facing}
          >
            <View style={styles.container}>
              <Text style={styles.text}>Scan the QR code</Text>
              {error ? <Text style={styles.text}>{error}</Text> : null}
            </View>
          </CameraView>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <MaterialCommunityIcons
              name="camera-switch"
              size={24}
              color={styles.text.color}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const lightStyles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: 400,
    height: 500,
  },
  cameraContainer: {
    borderRadius: 30,
    overflow: "hidden",
    width: 400,
    height: 500,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#2F3791",
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
});

const darkStyles = StyleSheet.create({
  main: {
    ...lightStyles.main,
    backgroundColor: "#333",
  },
  container: {
    ...lightStyles.container,
    backgroundColor: "#333",
  },
  camera: {
    ...lightStyles.camera,
    backgroundColor: "#333",
  },
  buttonContainer: {
    ...lightStyles.buttonContainer,
    backgroundColor: "#333",
  },

  button: {
    ...lightStyles.button,
    backgroundColor: "#2F3791",
  },
  text: {
    ...lightStyles.text,
    color: "#fff",
  },

  text: {
    color: "#fff",
    fontSize: 16,
  },
});
