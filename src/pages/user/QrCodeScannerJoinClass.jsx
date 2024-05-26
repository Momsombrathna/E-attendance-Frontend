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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
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

  const styles = StyleSheet.create({
    main: {
      flex: 1,
      backgroundColor: darkMode ? "#000" : "#fff",
    },
    container: {
      justifyContent: "center",
      alignItems: "center",
    },
    camera: {
      width: 400,
      height: 600,
    },
    cameraContainer: {
      overflow: "hidden",
      width: "100%",
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
    errorText: {
      color: "red",
      fontSize: 16,
    },
    scannerContainer: {
      flex: 1,
      alignItems: "center",
    },
    errorContainer: {
      height: 30,
      marginTop: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    headerScanner: {
      marginTop: 20,
      fontSize: 18,
      color: "#fff",
    },
    text: {
      fontSize: 18,
      color: "#fff",
    },
    nameText: {
      marginTop: 5,
      fontSize: 14,
      color: darkMode ? "#999" : "#777",
    },
    textView: {
      justifyContent: "center",
      flexDirection: "column",
    },
    loadingView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const joinClass = async (codeScanned) => {
    setLoading(true);
    setError("");

    if (!codeScanned) {
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
        const data = await response.json();
        Alert.alert("Success", data.message);
        navigation.navigate("Home");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setScanned(false);
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    joinClass(data);
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View style={styles.cameraContainer}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr", "pdf417"],
            }}
            style={StyleSheet.absoluteFillObject}
            facing={facing}
          >
            <View style={styles.scannerContainer}>
              <Text style={styles.headerScanner}>Scan the QR code</Text>
              <View style={styles.loadingView}>
                {loading ? (
                  <ActivityIndicator size="large" color="#fff" />
                ) : null}
              </View>
            </View>
          </CameraView>
        </View>
        <View style={styles.errorContainer}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
