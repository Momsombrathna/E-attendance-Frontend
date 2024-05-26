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
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../../hooks/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { API_URL, useUserData } from "../../api/config";
import { CameraView, Camera } from "expo-camera";
import * as Location from "expo-location";

export default function TeacherScanner({ route }) {
  const { userId, token } = useUserData();
  const [studentId, setStudentId] = useState("Not yet Scanned");
  const { item } = route.params;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const navigation = useNavigation();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const { darkMode } = useContext(ThemeContext);
  const [facing, setFacing] = useState("front");

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? "#000" : "#fff",
      marginTop: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    barcodebox: {
      width: 300,
      height: 300,
      backgroundColor: darkMode ? "#000" : "#fff",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      borderRadius: 10,
      borderColor: darkMode ? "#000" : "#fff",
      borderWidth: 2,
    },
    rowContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
    },
    text: {
      color: darkMode ? "#fff" : "#000",
      fontSize: 16,
      margin: 10,
    },
  });

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  // Request Camera Permission

  //what happen when we scan the barcode
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setStudentId(data);
    console.log(" Type: " + type + "\n Data: " + data);
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckedIn = async (studentId) => {
    setLoading(true);
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
            studentId: studentId,
            latitude,
            longitude,
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        throw new Error(data.message);
      } else {
        Alert.alert("Success", "You have checked in successfully");
        setIsCheckedIn(true);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckedOut = async (studentId) => {
    setLoading(true);
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
            studentId: studentId,
            latitude,
            longitude,
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        throw new Error(data.message);
      } else {
        Alert.alert("Success", "You have checked out successfully");
      }
      setIsCheckedIn(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    askForCameraPermission();
    getLocation();
  }, []);

  //Check permission and return the screens
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <Button title="Allow Camera" onPress={() => askForCameraPermission()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <View style={styles.rowContainer}>
        <Button
          title="Check In"
          onPress={() => {
            setScanned(false);
          }}
        />
        <Button
          title="Check Out"
          onPress={() => {
            setScanned(false);
          }}
        />
      </View> */}
      {!scanned && (
        <View style={styles.barcodebox}>
          <CameraView
            bounds="qr-code"
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={{ height: 400, width: 400 }}
            facing={facing}
          />
        </View>
      )}
      <Text style={styles.text}>Checked In Successfully {} </Text>
      {scanned && (
        <Button title="Scan again?" onPress={() => setScanned(false)} />
      )}
      <TouchableOpacity onPress={toggleCameraFacing}>
        <MaterialCommunityIcons
          name="camera-switch"
          size={24}
          color={styles.text.color}
        />
      </TouchableOpacity>
    </View>
  );
}
