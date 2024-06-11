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
  Button,
} from "react-native";

import { ThemeContext } from "../../hooks/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";
import { API_URL, useUserData } from "../../api/config";
import { showMessage } from "react-native-flash-message";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function TeacherScanner({ route }) {
  const { token } = useUserData();
  const { item } = route.params;
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const [facing, setFacing] = useState("back");
  const [cameraView, setCameraView] = useState(null);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <ActivityIndicator />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View
        style={{
          height: 500,
          backgroundColor: "#eee",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "#2F3791",
            padding: 10,
            borderRadius: 5,
          }}
          onPress={requestPermission}
        >
          <Text style={{ color: "#fff" }}>Allow Camera</Text>
        </TouchableOpacity>
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

      width: 500,
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
    cameraButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
    },
    cameraBtn: {
      backgroundColor: "#2F3791",
      padding: 10,
      borderRadius: 5,
      margin: 10,
      gap: 10,
      flexDirection: "row",
      alignItems: "center",
    },
  });

  const handleCheckedIn = async (id) => {
    setLoading(true);

    if (!id) {
      setError("Please scan the QR code first");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/attendance/checked-in/${item._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            studentId: id,
            latitude: item.latitude,
            longitude: item.longitude,
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        showMessage({
          message: data.message,
          type: "danger",
        });
        throw new Error(data.message);
      } else {
        showMessage({
          message: data.message,
          type: "success",
        });
        setIsCheckedIn(true);
      }
    } catch (error) {
      showMessage({
        message: error.message,
        type: "danger",
      });
    } finally {
      setLoading(false);
      setScanned(false);
    }
  };

  const handleCheckedOut = async (id) => {
    setLoading(true);

    if (!id) {
      setError("Please scan the QR code first");
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/attendance/checked-out/${item._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            studentId: id,
            latitude: item.latitude,
            longitude: item.longitude,
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        showMessage({
          message: data.message,
          type: "danger",
        });
        throw new Error(data.message);
      } else {
        showMessage({
          message: data.message,
          type: "success",
        });
      }
    } catch (error) {
      showMessage({
        message: error.message,
        type: "danger",
      });
    } finally {
      setLoading(false);
      setScanned(false);
    }
  };

  const handleOpenCheckInCamera = ({ data }) => {
    setCameraView("checkIn");
    setScanned(true);
    handleCheckedIn(data);
  };

  const handleOpenCheckOutCamera = ({ data }) => {
    setCameraView("checkOut");
    setScanned(true);
    handleCheckedOut(data);
  };
  console.log(item.to);

  return (
    <View style={styles.main}>
      {Date.now() > new Date(item.to) ? (
        <View
          style={{
            marginTop: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Feather
            name="alert-triangle"
            size={100}
            color={darkMode ? "#444" : "#333"}
          />
          <Text
            style={{
              color: darkMode ? "#444" : "#333",
              fontSize: 16,
              marginTop: 10,
            }}
          >
            This class has ended
          </Text>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.cameraButton}>
            <TouchableOpacity
              style={{
                ...styles.cameraBtn,
                backgroundColor:
                  cameraView === "checkIn" ? "rgba(0, 255, 0, 0.5)" : "#444",
              }}
              onPress={() => setCameraView("checkIn")}
            >
              <Feather name="log-in" size={24} color={styles.text.color} />
              <Text style={styles.text}>Check In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.cameraBtn,
                backgroundColor:
                  cameraView === "checkOut" ? "rgba(255, 0, 0, 0.5)" : "#444",
              }}
              onPress={() => setCameraView("checkOut")}
            >
              <Feather name="log-out" size={24} color={styles.text.color} />
              <Text style={styles.text}>Check Out</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cameraContainer}>
            {cameraView === "checkIn" ? (
              <CameraView
                onBarcodeScanned={scanned ? undefined : handleOpenCheckInCamera}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr", "pdf417"],
                }}
                style={StyleSheet.absoluteFillObject}
                facing={facing}
              >
                <View style={styles.scannerContainer}>
                  <Text style={styles.headerScanner}>
                    Scan the QR code to check in
                  </Text>
                  <View style={styles.loadingView}>
                    {loading ? (
                      <ActivityIndicator size="large" color="#fff" />
                    ) : null}
                  </View>
                </View>
              </CameraView>
            ) : cameraView === "checkOut" ? (
              cameraView === "checkOut" && (
                <CameraView
                  onBarcodeScanned={
                    scanned ? undefined : handleOpenCheckOutCamera
                  }
                  barcodeScannerSettings={{
                    barcodeTypes: ["qr", "pdf417"],
                  }}
                  style={StyleSheet.absoluteFillObject}
                  facing={facing}
                >
                  <View style={styles.scannerContainer}>
                    <Text style={styles.headerScanner}>
                      Scan the QR code to check out
                    </Text>
                    <View style={styles.loadingView}>
                      {loading ? (
                        <ActivityIndicator size="large" color="#fff" />
                      ) : null}
                    </View>
                  </View>
                </CameraView>
              )
            ) : (
              <View style={styles.scannerContainer}>
                <Text style={styles.headerScanner}>Scan the QR code</Text>
                <View style={styles.loadingView}>
                  <Feather
                    name="camera-off"
                    size={100}
                    color={darkMode ? "#fff" : "#000"}
                  />
                  <Text
                    style={{
                      color: darkMode ? "#fff" : "#000",
                      fontSize: 16,
                      marginTop: 10,
                    }}
                  >
                    Please select an option above
                  </Text>
                </View>
              </View>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <MaterialCommunityIcons
                name="camera-switch"
                size={24}
                color={styles.text.color}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
