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
  TextInput,
  Button,
  Platform,
} from "react-native";
import { ThemeContext } from "../../hooks/ThemeContext";
import MapView, { Marker } from "react-native-maps";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { useUserData, API_URL } from "../../api/config";
import axios from "axios";

export default function EditMySubClass({ route }) {
  const { subClassId, _description, start, end, rang, lat, lon } = route.params;
  const [description, setDescription] = useState(_description);
  const [from, setFrom] = useState(new Date(start));
  const [to, setTo] = useState(new Date(end));
  const navigation = useNavigation();
  const { userId, token } = useUserData();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFromPickerVisible, setFromPickerVisible] = useState(false);
  const [isToPickerVisible, setToPickerVisible] = useState(false);
  const [location_range, setLocationRange] = useState(String(rang));
  const [latitude, setLatitude] = useState(lat);
  const [longitude, setLongitude] = useState(lon);
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState(null);
  const { darkMode } = useContext(ThemeContext);

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
        latitude: lat,
        longitude: lon,
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
    try {
      const response = await axios({
        method: "PATCH",
        url: `${API_URL}/attendance/edit-timeline/${subClassId}`,
        data: {
          userId,
          description,
          from,
          to,
          location_range,
          latitude,
          longitude,
        },
        headers: {
          "auth-token": token,
        },
      });

      if (response.status === 200) {
        setLoading(false);
        navigation.goBack();
      } else {
        setLoading(false);
        setError(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkMode ? "#000" : "#fff",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginVertical: 20,
      color: darkMode ? "#fff" : "#000",
    },
    form: {
      marginHorizontal: 20,
      marginTop: 20,
    },
    input: {
      height: 40,
      backgroundColor: darkMode ? "#333" : "#eee",
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      color: darkMode ? "#fff" : "#000",
    },
    map: {
      height: 300,
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 10,
    },
    button: {
      marginTop: 10,
      backgroundColor: darkMode ? "#2F3791" : "#2F3791",
      padding: 15,
      marginBottom: 10,
      borderRadius: 10,
      height: 50,
      alignItems: "center",
    },
    buttonText: {
      color: darkMode ? "#fff" : "#fff",
      fontWeight: "bold",
    },
    loadingView: {
      height: 300,
      borderRadius: 10,
      backgroundColor: darkMode ? "#333" : "#eee",
      justifyContent: "center",
      alignItems: "center",
    },
    datePickContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    dateInput: {
      height: 40,
      backgroundColor: darkMode ? "#333" : "#eee",
      borderRadius: 10,
      padding: 10,
      marginBottom: 10,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      color: darkMode ? "#fff" : "#000",
    },
    textInput: {
      color: darkMode ? "#fff" : "#000",
    },
    to: {
      marginHorizontal: 10,
      alignSelf: "center",
      fontSize: 16,
      color: darkMode ? "#fff" : "#000",
    },
    label: {
      fontSize: 14,
      fontWeight: "bold",
      color: darkMode ? "#fff" : "#2F3791",
      opacity: 0.9,
      paddingLeft: 5,
      marginBottom: 10,
    },
    rangPicker: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      marginBottom: 10,
    },
    rangeButton: {
      height: 40,
      backgroundColor: darkMode ? "#333" : "#eee",
      borderRadius: 10,
      padding: 10,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Timeline</Text>
        <View style={styles.datePickContainer}>
          <TouchableOpacity style={styles.dateInput} onPress={showFromPicker}>
            <Text style={styles.textInput}>
              {from.toLocaleDateString()}{" "}
              {from.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isFromPickerVisible}
            mode="datetime"
            onConfirm={handleFromConfirm}
            onCancel={hideFromPicker}
          />

          <Text style={styles.to}> - </Text>

          <TouchableOpacity style={styles.dateInput} onPress={showToPicker}>
            <Text style={styles.textInput}>
              {to.toLocaleDateString()}{" "}
              {to.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isToPickerVisible}
            mode="datetime"
            onConfirm={handleToConfirm}
            onCancel={hideToPicker}
          />
        </View>

        <Text style={styles.label}>Location Range</Text>
        <View style={styles.rangPicker}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {locationRanges.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.rangeButton,
                  {
                    backgroundColor:
                      location_range === String(item.value)
                        ? "#2F3791"
                        : darkMode
                        ? "#333"
                        : "#eee",
                  },
                ]}
                onPress={() => setLocationRange(String(item.value))}
              >
                <Text
                  style={[
                    styles.textInput,
                    {
                      color:
                        location_range === String(item.value)
                          ? "#fff"
                          : darkMode
                          ? "#fff"
                          : "#000",
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.label}>Location</Text>
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

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {loading ? <ActivityIndicator color="#eee" /> : "Update"}
          </Text>
        </TouchableOpacity>
        {error && (
          <Text style={{ color: "red", paddingHorizontal: 10 }}>{error}</Text>
        )}
      </View>
    </View>
  );
}
