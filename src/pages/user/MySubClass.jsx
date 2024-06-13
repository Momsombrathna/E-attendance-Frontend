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
  RefreshControl,
} from "react-native";
import { ThemeContext } from "../../hooks/ThemeContext";
import { API_URL, useUserData } from "../../api/config";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Circle } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import Feather from "react-native-vector-icons/Feather";
import { Swipeable } from "react-native-gesture-handler";
import { renderRightAction } from "../partials/Swapeable";
// import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";
import Icon from "react-native-vector-icons/FontAwesome";
import { FontAwesome } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";

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
  const [refreshing, setRefreshing] = useState(false);

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
      borderRadius: 5,
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
      height: "95%",
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
      color: "#fff",
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
      backgroundColor: darkMode ? "#222" : "#888",
      padding: 5,
      width: 160,
      borderRadius: 5,
    },
    closeButton: {
      height: 100,
      alignItems: "center",
      backgroundColor: darkMode ? "#444" : "#fff",
      padding: 5,
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

  useEffect(() => {
    getSubClass();
  }, [classId]);

  const exportToExcel = async () => {
    const data = subClass.attendance.map((item) => {
      const now = moment();
      const created = moment(item.created);
      const started = moment(item.from);
      const ended = moment(item.to);

      let status;
      if (started.isAfter(now)) {
        status = "Not Started";
      } else if (ended.isBefore(now)) {
        status = "Ended";
      } else {
        status = "Ongoing";
      }

      return {
        Description: item.description,
        From: moment(item.from).format("MMM DD,YYYY hh:mm A"),
        To: moment(item.to).format("MMM DD,YYYY hh:mm A"),
        Status: status,
        LocationRange: locationRanges.find(
          (range) => range.value === item.location_range
        ).label,
        Latitude: item.latitude,
        Longitude: item.longitude,
      };
    });

    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        `SubClasses of ${subClass.class_name}.xlsx`
      );
      const wbout = XLSX.write(wb, {
        type: "base64",
        bookType: "xlsx",
      });

      const uri = FileSystem.cacheDirectory + "SubClasses.xlsx";
      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(uri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: `SubClasses of ${subClass.class_name}`,
        UTI: "com.microsoft.excel.xlsx",
      });

      await FileSystem.deleteAsync(uri);
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getSubClass();
    setRefreshing(false);
  };

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

  const SkeletonItem = () => (
    <View style={styles.subClass}>
      <View style={styles.body}>
        <View style={styles.name}>
          <LinearGradient
            colors={["#cccccc", "#bbbbbb", "#cccccc"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ ...styles.subClassName, height: 20 }}
          />

          <View style={styles.dateRangeContainer}>
            <LinearGradient
              colors={["#cccccc", "#bbbbbb", "#cccccc"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                ...styles.timeFooter,
                height: 20,
                width: "45%",
                marginRight: 10,
              }}
            />
            <LinearGradient
              colors={["#cccccc", "#bbbbbb", "#cccccc"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ ...styles.timeFooter, height: 20, width: "45%" }}
            />
          </View>

          <View style={{ flexDirection: "row", gap: 5, marginTop: 10 }}>
            <LinearGradient
              colors={["#cccccc", "#bbbbbb", "#cccccc"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                ...styles.checkInFooter,
                height: 20,
                width: "20%",
                marginRight: 10,
              }}
            />

            <LinearGradient
              colors={["#cccccc", "#bbbbbb", "#cccccc"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                ...styles.CheckOutFooter,
                height: 20,
                width: "20%",
                marginRight: 10,
              }}
            />

            <LinearGradient
              colors={["#cccccc", "#bbbbbb", "#cccccc"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                ...styles.rangFooter,
                height: 20,
                width: "20%",
                marginRight: 10,
              }}
            />

            <LinearGradient
              colors={["#cccccc", "#bbbbbb", "#cccccc"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: 20,
                width: "20%",
                borderRadius: 5,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          keyExtractor={(item) => item}
          renderItem={SkeletonItem}
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
            radius={currentLocation.location_range * 1000}
            fillColor="rgba(0, 0, 255, 0.1)"
            strokeColor="rgba(0, 0, 255, 0.5)"
          />
        </MapView>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
          style={styles.closeButton}
        >
          <Text
            style={{
              color: darkMode ? "#fff" : "#333",
              fontSize: 18,
            }}
          >
            Close
          </Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
