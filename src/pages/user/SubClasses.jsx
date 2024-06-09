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
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL, useUserData } from "../../api/config";
import { ThemeContext } from "../../hooks/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Circle } from "react-native-maps";
import Feather from "react-native-vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";

export default function SubClasses({ route }) {
  const { classId, token } = route.params;
  const [subClass, setSubClass] = useState({});
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const { userId } = useUserData();
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
    location_range: 0,
  });

  const [refreshing, setRefreshing] = useState(false);

  const { darkMode } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 5,
      backgroundColor: darkMode ? "#000" : "#fff",
    },
    subClass: {
      padding: 5,
      margin: 4,
      borderStartColor: "#2F3791",
      borderStartWidth: 7,
      borderRadius: 5,
      backgroundColor: darkMode ? "#444" : "#eee",
    },
    subClassName: {
      fontSize: 18,
      marginBottom: 5,
      fontWeight: "bold",
      color: darkMode ? "#fff" : "#444",
      overflow: "hidden",
      width: 200,
      borderRadius: 5,
      TextOverflow: "ellipsis",
    },

    locationRange: {
      fontSize: 14,
      color: "#fff",
    },
    dateRangeContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
    },
    timeFooter: {
      backgroundColor: darkMode ? "#222" : "#888",
      padding: 5,
      width: 160,
      borderRadius: 5,
    },
    dateRange: {
      fontSize: 13,
      color: "#fff",
      alignItems: "center",
      justifyContent: "center",
      width: 150,
    },
    map: {
      width: "100%",
      height: "95%",
    },
    body: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    chip: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 5,
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
      setRefreshing(true);
      getSubClass();
      setRefreshing(false);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    getSubClass();
    setRefreshing(false);
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

  const SkeletonItem = () => (
    <View style={styles.subClass}>
      <View style={styles.body}>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <LinearGradient
            colors={["#bbbbbb", "#cccccc", "#bbbbbb"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: 150,
              height: 20,
              borderRadius: 5,
            }}
          ></LinearGradient>

          <View
            style={{
              ...styles.dateRangeContainer,
              marginTop: 5,
            }}
          >
            <LinearGradient
              colors={["#bbbbbb", "#cccccc", "#bbbbbb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: 150,
                height: 20,
                borderRadius: 5,
              }}
            ></LinearGradient>

            <LinearGradient
              colors={["#bbbbbb", "#cccccc", "#bbbbbb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: 150,
                height: 20,
                borderRadius: 5,
              }}
            ></LinearGradient>
          </View>
        </View>
      </View>
      <View
        style={{
          marginTop: 5,
          flexDirection: "row",
          gap: 5,
          alignItems: "center",
        }}
      >
        <LinearGradient
          colors={["#bbbbbb", "#cccccc", "#bbbbbb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: 50,
            height: 20,
            borderRadius: 5,
          }}
        ></LinearGradient>
        <LinearGradient
          colors={["#bbbbbb", "#cccccc", "#bbbbbb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: 50,
            height: 20,
            borderRadius: 5,
          }}
        ></LinearGradient>

        <LinearGradient
          colors={["#bbbbbb", "#cccccc", "#bbbbbb"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: 50,
            height: 20,
            borderRadius: 5,
          }}
        ></LinearGradient>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 7, 8, 9, 10]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <SkeletonItem />}
        />
      ) : (
        <FlatList
          data={subClass.attendance}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            const now = moment();
            const created = moment(item.created);
            const started = moment(item.from);
            const ended = moment(item.to);

            let backgroundColor;
            if (started.isAfter(now)) {
              backgroundColor = "#f1c40f";
            } else if (ended.isBefore(now)) {
              backgroundColor = "#e74c3c";
            } else {
              backgroundColor = "#2ecc71";
            }

            return (
              <>
                <TouchableOpacity
                  style={{
                    ...styles.subClass,
                    borderStartColor: (() => {
                      const attendance = item.attendances.find(
                        (attendance) => attendance.studentId === userId
                      );
                      return attendance && attendance.status === "absent"
                        ? "#bb2124"
                        : "#22bb33";
                    })(),
                  }}
                  onPress={() =>
                    navigation.navigate("ViewSubClasses", {
                      subClassId: item._id,
                      className: item.description,
                      lat: item.latitude,
                      lon: item.longitude,
                      rang: item.location_range,
                      to: item.to,
                      checkedIn: (() => {
                        const attendance = item.attendances.find(
                          (attendance) => attendance.studentId === userId
                        );
                        return attendance && attendance.checkedIn;
                      })(),
                      checkedOut: (() => {
                        const attendance = item.attendances.find(
                          (attendance) => attendance.studentId === userId
                        );
                        return attendance && attendance.checkedOut;
                      })(),
                      status: (() => {
                        const attendance = item.attendances.find(
                          (attendance) => attendance.studentId === userId
                        );
                        return attendance && attendance.status;
                      })(),
                    })
                  }
                >
                  <View style={styles.body}>
                    <View
                      style={{
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.subClassName}
                      >
                        {item.description}
                      </Text>

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
                    </View>
                  </View>
                  <View
                    style={{
                      marginTop: 5,
                      flexDirection: "row",
                      gap: 5,
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        ...styles.chip,
                        backgroundColor,
                      }}
                    >
                      <Text style={styles.locationRange}>
                        {moment(item.created).fromNow()}
                      </Text>
                    </View>
                    <View
                      style={{
                        ...styles.chip,
                        backgroundColor: "yellow",
                      }}
                    >
                      <Text
                        style={{
                          ...styles.locationRange,
                          color: "#333",
                        }}
                      >
                        Range:{" "}
                        {
                          locationRanges.find(
                            (range) => range.value === item.location_range
                          ).label
                        }
                      </Text>
                    </View>
                    <View
                      style={{
                        ...styles.chip,
                        backgroundColor: "#2F3791",
                      }}
                    >
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
                </TouchableOpacity>
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
                      radius={currentLocation.location_range * 1000}
                      fillColor="rgba(0, 0, 255, 0.1)"
                      strokeColor="rgba(0, 0, 255, 0.5)"
                    />
                  </MapView>
                  <TouchableOpacity
                    style={{
                      height: 100,
                      backgroundColor: darkMode ? "#444" : "#fff",
                      padding: 5,
                    }}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text
                      style={{
                        color: darkMode ? "#fff" : "#000",
                        fontSize: 18,
                        textAlign: "center",
                      }}
                    >
                      Close
                    </Text>
                  </TouchableOpacity>
                </Modal>
              </>
            );
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}
