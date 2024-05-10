import React, { useEffect, useState } from "react";
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
  TextInput,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Location from "expo-location";

export default function CreateSubClasses({ route }) {
  const { classId, token } = route.params;
  const [subClass, setSubClass] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [from, setFrom] = useState(new Date());
  const [to, setTo] = useState(new Date());
  const [location_range, setLocation_range] = useState("");
  const navigation = useNavigation();
  const { userId } = useUserData();
  const [isFromPickerVisible, setFromPickerVisible] = useState(false);
  const [isToPickerVisible, setToPickerVisible] = useState(false);
  const [region, setRegion] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const showFromPicker = () => {
    setFromPickerVisible(true);
  };

  const hideFromPicker = () => {
    setFromPickerVisible(false);
  };

  const handleFromConfirm = (datetime) => {
    setFrom(datetime);
    hideFromPicker();
  };

  const showToPicker = () => {
    setToPickerVisible(true);
  };

  const hideToPicker = () => {
    setToPickerVisible(false);
  };

  const handleToConfirm = (datetime) => {
    setTo(datetime);
    hideToPicker();
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access location was denied"
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
      setIsLoading(false);
    })();
  }, []);

  const onRegionChange = (region) => {
    setRegion(region);
    setLatitude(region.latitude);
    setLongitude(region.longitude);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/attendance/create-timeline/${classId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            userId,
            description,
            from: from.toISOString(),
            to: to.toISOString(),
            location_range,
            latitude,
            longitude,
          }),
        }
      );

      if (response.ok) {
        setLoading(false);
        const data = await response.json();
        setDescription("");
        setLocation_range("");
        setFrom(new Date());
        setTo(new Date());
        setRegion(null);
        setLatitude(null);
        setLongitude(null);
        navigation.goBack();
      }

      if (response.status === 400) {
        setLoading(false);
        const data = await response.json();
        setError(data.message);
      }

      if (!response.ok) {
        setLoading(false);
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />

        <Button title="Select From Time" onPress={showFromPicker} />
        <DateTimePickerModal
          isVisible={isFromPickerVisible}
          mode="time"
          onConfirm={handleFromConfirm}
          onCancel={hideFromPicker}
        />
        <TextInput
          style={styles.input}
          placeholder="From"
          value={from.toLocaleTimeString()}
          editable={false} // make the field not editable
        />

        <Button title="Select To Time" onPress={showToPicker} />
        <DateTimePickerModal
          isVisible={isToPickerVisible}
          mode="time"
          onConfirm={handleToConfirm}
          onCancel={hideToPicker}
        />
        <TextInput
          style={styles.input}
          placeholder="To"
          value={to.toLocaleTimeString()}
          editable={false} // make the field not editable
        />

        <TextInput
          style={styles.input}
          placeholder="Location Range"
          value={location_range}
          onChangeText={setLocation_range}
        />
        {isLoading ? (
          <View style={styles.loadingView}>
            <ActivityIndicator
              size="large"
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                color: "#2F3791",
              }}
            />
          </View>
        ) : (
          <View style={styles.map}>
            {region && (
              <MapView
                style={{ flex: 1 }}
                region={region}
                onRegionChangeComplete={onRegionChange}
              >
                <Marker coordinate={region} />
              </MapView>
            )}
          </View>
        )}

        {error && <Text style={{ color: "red" }}>{error}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {loading ? <ActivityIndicator color="#eee" /> : "Create"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  form: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  input: {
    height: 50,
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  map: {
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#2F3791",
    padding: 15,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingView: {
    height: 300,
    borderRadius: 10,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
});
