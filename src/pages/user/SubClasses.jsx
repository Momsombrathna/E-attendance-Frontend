import React, { useEffect, useState } from "react";
import { API_URL } from "../../api/config";
import { useNavigation } from "@react-navigation/native";
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

  // console.log(token);
  // console.log(subClass);

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
            <TouchableOpacity
              style={styles.subClass}
              onPress={() =>
                navigation.navigate("ViewSubClasses", {
                  subClassId: item._id,
                })
              }
            >
              <View style={styles.body}>
                <View>
                  <Text style={styles.subClassName}>{item.description}</Text>
                  <Text style={styles.time}>
                    {new Date(item.from).toLocaleTimeString()} -{" "}
                    {new Date(item.to).toLocaleTimeString()}
                  </Text>
                  <Text style={styles.locationRange}>
                    Location Range: {item.location_range}
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
                  <Feather name="map-pin" size={30} color="#666" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
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
    padding: 5,
    backgroundColor: "#fff",
  },
  subClass: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    gap: 3,
  },
  subClassName: {
    fontSize: 18,
  },
  time: {
    fontSize: 14,
    color: "#666",
  },
  locationRange: {
    fontSize: 14,
    color: "#666",
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