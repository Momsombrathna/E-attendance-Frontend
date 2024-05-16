import React, { useState, useEffect } from "react";
import { API_URL, useUserData } from "../../api/config";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Button,
  ActivityIndicator,
  Animated,
} from "react-native";
import * as Location from "expo-location";

export default function ViewSubClasses({ route }) {
  const { subClassId, subClassName } = route.params;
  const { token, userId } = useUserData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const navigation = useNavigation();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [scaleValue] = useState(new Animated.Value(0));

  // get latitude and longitude from device automatically
  const getLocation = async () => {
    setLoading(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError("Permission to access location was denied");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);
    setLoading(false);
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleCheckedIn = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/attendance/checked-in/${subClassId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            studentId: userId,
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

  const handleCheckedOut = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/attendance/checked-out/${subClassId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            studentId: userId,
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

  const startAnimation = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (isCheckedIn) {
      startAnimation();
    }
  }, [isCheckedIn]);

  const buttonScale = scaleValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1.2],
  });

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#eee" />
      ) : (
        <>
          <View style={styles.errorShown}>
            {error && <Text style={styles.error}>{error}</Text>}
          </View>
          <View style={styles.viewsContainer}>
            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={styles.checkedInButton}
                onPress={handleCheckedIn}
              >
                <Text style={styles.buttonText}>Check In</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                style={styles.checkedOutButton}
                onPress={handleCheckedOut}
              >
                <Text style={styles.buttonText}>Check Out</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  viewsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 10,
  },
  checkedInButton: {
    backgroundColor: "#FF6347", // Tomato color
    padding: 10,
    borderRadius: 5,
    elevation: 3, // for Android
    shadowColor: "#000", // for iOS
    shadowOffset: { width: 0, height: 2 }, // for iOS
    shadowOpacity: 0.25, // for iOS
    shadowRadius: 3.84, // for iOS
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
  checkedOutButton: {
    backgroundColor: "green", // Tomato color
    padding: 10,
    borderRadius: 5,
    elevation: 3, // for Android
    shadowColor: "#000", // for iOS
    shadowOffset: { width: 0, height: 2 }, // for iOS
    shadowOpacity: 0.25, // for iOS
    shadowRadius: 3.84, // for iOS
  },
  className: {
    fontSize: 20,
    fontWeight: "bold",
  },
  error: {
    color: "red",
  },
  errorShown: {
    marginBottom: 10,
  },
});
