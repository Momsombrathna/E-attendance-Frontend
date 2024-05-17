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
import { useFocusEffect } from "@react-navigation/native";

export default function SubClasses({ route }) {
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

  // useEffect(() => {
  //   getSubClass();
  // }, [classId]);

  useFocusEffect(
    React.useCallback(() => {
      getSubClass();
    }, [classId])
  );

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
            <>
              <TouchableOpacity
                style={styles.subClass}
                onPress={() =>
                  navigation.navigate("ViewSubClasses", {
                    subClassId: item._id,
                    className: item.description,
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
                    <Text style={styles.subClassName}>{item.description}</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
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
                <Button
                  title="Close Map"
                  onPress={() => setModalVisible(false)}
                />
              </Modal>
            </>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#fff",
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
    width: "80%",
    height: "auto",
    marginBottom: 5,
    fontSize: 18,
    fontWeight: "bold",
  },
  time: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    marginRight: 5,
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#f2f2f2",
  },
  locationRange: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
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
});
