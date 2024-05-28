import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Button,
  ActivityIndicator,
} from "react-native";
import { ThemeContext } from "../../hooks/ThemeContext";
import { API_URL, useUserData } from "../../api/config";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Circle } from "react-native-maps";
import Feather from "react-native-vector-icons/Feather";
import { Swipeable } from "react-native-gesture-handler";
import { renderRightAction } from "../partials/Swapeable";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome";

export default function MySubClasses({ route }) {
  const { classId, token, code, className, classProfile } = route.params;
  const { userId } = useUserData();
  const [subClass, setSubClass] = useState({});
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
    location_range: 0,
  });

  const { darkMode } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? "#333" : "#fff",
      marginHorizontal: 10,
    },
    subClass: {
      margin: 4,
      borderRadius: 5,
      borderStartColor: "#2F3791",
      borderStartWidth: 7,
      backgroundColor: darkMode ? "#444" : "#eee",
    },
    subClassName: {
      fontSize: 18,
      fontWeight: "bold",
      color: darkMode ? "#fff" : "#444",
      overflow: "hidden",
      width: 200,
      TextOverflow: "ellipsis",
    },
    name: {
      flexDirection: "column",
      gap: 5,
      padding: 5,
    },
    time: {
      fontSize: 14,
      color: darkMode ? "#fff" : "#666",
      marginRight: 5,
      padding: 5,
      borderRadius: 5,
      backgroundColor: darkMode ? "#222" : "#f2f2f2",
    },
    locationRange: {
      fontSize: 13,
      color: darkMode ? "#fff" : "#eee",
    },
    map: {
      width: "100%",
      height: "90%",
    },
    body: {
      width: "90%",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    date: {
      fontSize: 14,
      color: darkMode ? "#fff" : "#666",
    },
    dateRange: {
      fontSize: 13,
      color: darkMode ? "#fff" : "#666",
      alignItems: "center",
      justifyContent: "center",
      width: 150,
    },
    dateRangeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
    },
    checkedInCount: {
      fontSize: 14,
      padding: 5,
      color: "#fff",
    },
    checkedOutCount: {
      fontSize: 14,
      padding: 5,
      color: "#fff",
    },

    checkedInCountContainer: {
      backgroundColor: "green",
      maxWidth: 100,
      opacity: 0.8,
      marginTop: 5,
      marginRight: 5,
      padding: 3,
      borderRadius: 5,
    },
    checkedOutCountContainer: {
      backgroundColor: "red",
      maxWidth: 100,
      opacity: 0.8,
      marginTop: 5,
      padding: 3,
      borderRadius: 5,
    },
    checkInFooter: {
      backgroundColor: "green",
      padding: 5,
      borderRadius: 5,
    },
    CheckOutFooter: {
      backgroundColor: "#FF453A",
      padding: 5,
      borderRadius: 5,
    },
    rangFooter: {
      backgroundColor: "#FFA500",
      padding: 5,
      borderRadius: 5,
    },
    timeFooter: {
      backgroundColor: darkMode ? "#222" : "#fff",
      padding: 5,
      width: 160,
      borderRadius: 5,
    },
  });

  const getSubClass = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/attendance/get-subclass/${classId}`,
        {
          method: "GET",
          headers: {
            "auth-token": token,
          },
        }
      );
      const data = await response.json();
      setSubClass(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getSubClass();
    }, [classId])
  );

  const renderRightActions = (
    progress,
    subClassId,
    _description,
    start,
    end,
    rang,
    lat,
    lon
  ) => (
    <View style={{ width: 192, flexDirection: "row" }}>
      {renderRightAction(
        "Edit",
        "#2F3791",
        192,
        progress,
        () => {
          navigation.navigate("EditMySubClass", {
            subClassId,
            _description,
            start,
            end,
            rang,
            lat,
            lon,
          });
        },
        "edit"
      )}
      {renderRightAction(
        "Delete",
        "#FF453A",
        128,
        progress,
        () => {
          Alert.alert("Delete", "Are you sure you want to delete this class?", [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              onPress: () => handleDelete(subClassId),
              style: "destructive",
            },
          ]);
        },
        "trash"
      )}
    </View>
  );

  const handleDelete = async (subClassId) => {
    try {
      const response = await axios({
        method: "delete",
        url: `${API_URL}/attendance/delete-timeline/${subClassId}`,
        data: {
          userId,
        },
        headers: {
          "auth-token": token,
        },
      });

      if (response.status === 200) {
        setLoading(false);
        getSubClass();
      } else {
        setLoading(false);
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const locationRanges = [
    { label: "10m", value: 0.01 },
    { label: "15m", value: 0.015 },
    { label: "20m", value: 0.02 },
    { label: "25m", value: 0.025 },
    { label: "30m", value: 0.03 },
    { label: "35m", value: 0.035 },
    { label: "40m", value: 0.04 },
    { label: "45m", value: 0.045 },
    { label: "50m", value: 0.05 },
  ];

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            color: "#2F3791",
          }}
        />
      ) : subClass &&
        subClass.attendance &&
        subClass.attendance.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Icon name="exclamation-triangle" size={50} color="#ccc" />
          <Text style={{ color: "#ccc", fontSize: 20, marginTop: 10 }}>
            No Attendance found
          </Text>
        </View>
      ) : (
        <FlatList
          data={subClass.attendance}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Swipeable
              friction={2}
              rightThreshold={40}
              renderRightActions={(progress) =>
                renderRightActions(
                  progress,
                  item._id,
                  item.description,
                  item.from,
                  item.to,
                  item.location_range,
                  item.latitude,
                  item.longitude
                )
              }
            >
              <TouchableOpacity
                style={styles.subClass}
                onPress={() => navigation.navigate("CheckMember", { item })}
              >
                <View style={styles.body}>
                  <View style={styles.name}>
                    <View>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.subClassName}
                      >
                        {item.description}
                      </Text>
                    </View>

                    <View style={styles.dateRangeContainer}>
                      <View style={styles.timeFooter}>
                        <Text style={styles.dateRange}>
                          {moment(item.from).format("MMM DD,YYYY hh:mm A")}
                        </Text>
                      </View>
                      <Feather
                        name="arrow-right"
                        size={20}
                        color={darkMode ? "#fff" : "#666"}
                      />
                      <View style={styles.timeFooter}>
                        <Text style={styles.dateRange}>
                          {moment(item.to).format("MMM DD,YYYY hh:mm A")}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 5,
                      }}
                    >
                      <View style={styles.checkInFooter}>
                        <Text style={styles.locationRange}>
                          Check in:{" "}
                          {
                            item.attendances.filter(
                              (attendance) => attendance.checkedIn
                            ).length
                          }{" "}
                        </Text>
                      </View>

                      <View style={styles.CheckOutFooter}>
                        <Text style={styles.locationRange}>
                          Check out:{" "}
                          {
                            item.attendances.filter(
                              (attendance) => attendance.checkedOut
                            ).length
                          }
                        </Text>
                      </View>
                      <View style={styles.rangFooter}>
                        <Text style={styles.locationRange}>
                          Range:{" "}
                          {
                            locationRanges.find(
                              (range) => range.value === item.location_range
                            ).label
                          }
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          setCurrentLocation({
                            latitude: item.latitude,
                            longitude: item.longitude,
                            location_range: item.location_range,
                          });
                          setModalVisible(true);
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "#2F3791",
                            padding: 5,
                            borderRadius: 5,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 14,
                              borderRadius: 5,
                            }}
                          >
                            View
                          </Text>
                          <Feather name="map-pin" size={16} color="#fff" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      )}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
          />
          <Circle
            center={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            radius={Math.sqrt(
              (currentLocation.location_range * 1000000) / Math.PI
            )}
            fillColor="rgba(0, 0, 255, 0.1)"
            strokeColor="rgba(0, 0, 255, 0.5)"
          />
        </MapView>
        <Button title="Close Map" onPress={() => setModalVisible(false)} />
      </Modal>
    </View>
  );
}
