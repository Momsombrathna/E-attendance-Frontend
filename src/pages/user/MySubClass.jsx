import React, { useEffect, useState } from "react";
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
import { API_URL } from "../../api/config";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, Circle } from "react-native-maps";
import Feather from "react-native-vector-icons/Feather";
import { Swipeable } from "react-native-gesture-handler";
import { renderRightAction } from "../partials/Swapeable";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

export default function MySubClasses({ route }) {
  const { classId, token } = route.params;
  const [subClass, setSubClass] = useState({});
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
    location_range: 0,
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
    description,
    from,
    to,
    location_range
  ) => (
    <View style={{ width: 192, flexDirection: "row" }}>
      {renderRightAction(
        "Edit",
        "#2F3791",
        192,
        progress,
        () => {
          navigation.navigate("Home", {
            subClassId,
            description,
            from,
            to,
            location_range,
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
        url: `${API_URL}/attendance/delete-subclass/${subClassId}`,
        data: {
          userId,
        },
        headers: {
          "auth-token": token,
        },
      });

      if (response.status === 200) {
        setLoading(false);
        setSubClass(subClass.filter((cls) => cls._id !== subClassId));
      } else {
        setLoading(false);
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

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
                  item.description,
                  item.from,
                  item.to,
                  item.location_range
                )
              }
            >
              <TouchableOpacity
                style={styles.subClass}
                onPress={() => Alert.alert("Subclass")}
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
                    <Text style={styles.dateRange}>
                      {new Intl.DateTimeFormat("default", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(item.created))}
                    </Text>
                  </View>

                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.time}>
                        {new Intl.DateTimeFormat("default", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(item.from))}{" "}
                        -{" "}
                        {new Intl.DateTimeFormat("default", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(item.to))}
                      </Text>
                      <Text style={styles.locationRange}>
                        Range: {item.location_range}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View style={styles.checkedInCountContainer}>
                        <Text style={styles.checkedInCount}>
                          {"checked in: " +
                            item.attendances.filter(
                              (attendance) => attendance.checkedIn
                            ).length}
                        </Text>
                      </View>
                      <View style={styles.checkedOutCountContainer}>
                        <Text style={styles.checkedOutCount}>
                          {"Check out: " +
                            item.attendances.filter(
                              (attendance) => attendance.checkedOut
                            ).length}
                        </Text>
                      </View>
                    </View>
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
                    <Feather name="map-pin" size={30} color="#666" />
                  </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 5,
  },
  subClass: {
    padding: 10,
    margin: 5,
    borderStartColor: "#2F3791",
    borderStartWidth: 5,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subClassName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  name: {
    maxWidth: 100,
    marginBottom: 5,
  },
  time: {
    fontSize: 14,
    color: "#666",
    marginRight: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#f2f2f2",
  },
  locationRange: {
    fontSize: 14,
    color: "#666",
    marginRight: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#f2f2f2",
  },
  map: {
    width: "100%",
    height: "90%",
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  dateRange: {
    fontSize: 14,
    color: "#666",
  },
  checkedInCount: {
    fontSize: 14,
    padding: 5,
    color: "#fff",
  },
  checkedOutCount: {
    fontSize: 14,
    color: "#fff",
    padding: 5,
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
    marginRight: 5,
    padding: 3,
    borderRadius: 5,
  },
});
