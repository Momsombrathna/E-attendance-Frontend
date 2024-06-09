import React, { useState, useEffect, useContext } from "react";
import { API_URL, useUserData } from "../../api/config";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from "react-native";
import * as Location from "expo-location";
import { ThemeContext } from "../../hooks/ThemeContext";
import Feather from "react-native-vector-icons/Feather";
import MapView, { Marker, Circle, Polyline } from "react-native-maps";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { showMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome5";
import TimeIcon from "../../../assets/AnimationTime.json";
import LottieView from "lottie-react-native";

export default function ViewSubClasses({ route }) {
  const {
    subClassId,
    className,
    lat,
    lon,
    rang,
    to,
    checkedIn,
    checkedOut,
    status,
  } = route.params;
  const { token, userId } = useUserData();
  const [loading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const { darkMode } = useContext(ThemeContext);
  const animationValue = useState(new Animated.Value(0))[0];
  const navigation = useNavigation();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animationValue, {
          toValue: 3,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animationValue, {
          toValue: 0.5,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animationValue]);

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showMessage({
          message: "Error",
          description: "Permission to access location was denied",
          type: "danger",
        });
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setLoading(false);
    };
    fetchLocation();
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
        showMessage({
          message: "Failed",
          description: data.message,
          type: "danger",
        });
        throw new Error(data.message);
      }
      showMessage({
        message: "Success",
        description: "You have successfully checked in",
        type: "success",
      });
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: "Failed",
        description: error.message,
        type: "danger",
      });
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
        showMessage({
          message: "Failed",
          description: data.message,
          type: "danger",
        });
        throw new Error(data.message);
      }
      showMessage({
        message: "Success",
        description: "You have successfully checked out",
        type: "success",
      });
      navigation.goBack();
    } catch (error) {
      showMessage({
        message: "Failed",
        description: error.message,
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: "100%",
      backgroundColor: darkMode ? "#333" : "#fff",
      justifyContent: "center",
      alignItems: "center",
    },
    main: {
      flex: 1,
      width: "100%",
      alignItems: "center",
    },
    map: {
      height: "60%",
      width: "100%",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    mapView: {
      height: "100%",
      width: "100%",
    },
    checkContainer: {
      marginTop: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    checkText: {
      color: "#fff",
      fontSize: 14,
      fontWeight: "bold",
    },
    loadingMap: {
      height: "100%",
      width: "100%",
      backgroundColor: darkMode ? "#444" : "#eee",
    },
    animation: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: darkMode ? "#444" : "#eee",
      position: "absolute",
      transform: [
        {
          scale: animationValue,
        },
      ],
    },
    loadingContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginTop: 50,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.map}>
          {loading ? (
            <View style={styles.loadingMap}>
              <ActivityIndicator
                size="small"
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#2F3791",
                }}
              />
            </View>
          ) : (
            <MapView
              style={styles.mapView}
              initialRegion={{
                latitude: lat,
                longitude: lon,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{ latitude: lat, longitude: lon }}
                title={className}
                description="Class location"
              >
                <View
                  style={{
                    backgroundColor: "#2F3791",
                    borderRadius: 50,
                    padding: 5,
                  }}
                >
                  <Feather name="map-pin" size={18} color="white" />
                </View>
              </Marker>
              <Circle
                center={{ latitude: lat, longitude: lon }}
                radius={rang * 1000}
                fillColor="rgba(0, 0, 255, 0.1)"
                strokeColor="rgba(0, 0, 255, 0.5)"
              />
              <Marker
                coordinate={{ latitude, longitude }}
                title="Your location"
                description="Your current location"
              />
              <Polyline
                coordinates={[
                  { latitude: lat, longitude: lon },
                  { latitude, longitude },
                ]}
                strokeColor={
                  status === "present"
                    ? "rgba(0, 255, 0, 0.5)"
                    : "rgba(255, 0, 0, 0.5)"
                }
                strokeWidth={2}
              />
            </MapView>
          )}
        </View>

        <View style={styles.checkContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <View
                style={{
                  backgroundColor: darkMode ? "#444" : "#eee",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  padding: 10,
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AnimatedCircularProgress
                  size={100}
                  width={5}
                  fill={100}
                  tintColor="#2F3791"
                  backgroundColor="#3d5875"
                >
                  {(fill) => (
                    <View>
                      <LottieView
                        source={TimeIcon}
                        autoPlay
                        loop
                        style={{ width: 80, height: 80 }}
                      />
                    </View>
                  )}
                </AnimatedCircularProgress>
              </View>
            </View>
          ) : (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {moment(to).isBefore(moment()) ? (
                <>
                  <View style={styles.loadingContainer}>
                    <View
                      style={{
                        backgroundColor: "rgba(255, 0, 0, 0.5)",
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        padding: 10,
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Feather name="alert-circle" size={50} color="#eee" />
                    </View>
                  </View>
                  <Text
                    style={{
                      color: "rgba(255, 0, 0, 0.5)",
                      fontSize: 14,
                      marginTop: 30,
                      justifyContent: "center",
                    }}
                  >
                    Class has Ended
                  </Text>
                </>
              ) : status === "present" ? (
                <>
                  <View style={styles.loadingContainer}>
                    <View
                      style={{
                        backgroundColor: "rgba(0, 255, 0, 0.5)",
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                        padding: 10,
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Feather
                        name="check-circle"
                        size={50}
                        color="#eee"
                        style={{ marginTop: 5 }}
                      />
                    </View>
                  </View>
                  <Text
                    style={{
                      color: "rgba(0, 255, 0, 0.5)",
                      fontSize: 14,
                      marginTop: 30,
                      justifyContent: "center",
                    }}
                  >
                    You are Present
                  </Text>
                </>
              ) : status === "absent" ? (
                <View>
                  {checkedIn === false ? (
                    <View style={styles.loadingContainer}>
                      <Animated.View style={styles.animation} />
                      <TouchableOpacity
                        style={{
                          backgroundColor: "rgba(0, 255, 0, 0.5)",
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                          padding: 10,
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={handleCheckedIn}
                      >
                        <Text style={styles.checkText}>Check In</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.loadingContainer}>
                      <Animated.View style={styles.animation} />
                      <TouchableOpacity
                        style={{
                          backgroundColor: "rgba(255, 0, 0, 0.5)",
                          shadowColor: "#000",
                          shadowOffset: {
                            width: 0,
                            height: 2,
                          },
                          shadowOpacity: 0.25,
                          shadowRadius: 3.84,
                          elevation: 5,
                          padding: 10,
                          width: 100,
                          height: 100,
                          borderRadius: 50,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={handleCheckedOut}
                      >
                        <Text style={styles.checkText}>Check Out</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ) : (
                <View>
                  <Text style={styles.checkText}>Class Ended</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
