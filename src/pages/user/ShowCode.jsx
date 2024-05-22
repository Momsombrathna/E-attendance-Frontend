import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";
import { API_URL } from "../../api/config";
import axios from "axios";

export default function ShowCode({ route }) {
  const { code, classId, token } = route.params;
  const [codeData, setCodeData] = useState(code.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRefreshCode = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.patch(
        `${API_URL}/class/refresh-code/${classId}`,
        {},
        {
          headers: {
            "auth-token": token,
          },
        }
      );
      setCodeData(response.data.code.toString());
      setLoading(false);
    } catch (error) {
      setError("Error refreshing code");
      setLoading(false);
    }
  };

  const textToQrCode = () => {
    const size = 200;
    const text = codeData;
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?data=${text}&size=${size}x${size}&bgcolor=ffffff&color=000000`;
    return qrCode;
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : (
          <>
            <Text style={styles.text}>Scan the QR code to join the class</Text>

            <View style={styles.qrCodeContainer}>
              <Image
                source={{ uri: textToQrCode() }}
                style={{
                  width: 200,
                  height: 200,
                  marginTop: 10,
                  marginBottom: 10,
                }}
              />
            </View>
            <View style={styles.codeContainer}>
              <Text style={styles.text}>Or enter this code: </Text>
              <View style={styles.codeText}>
                <Text style={{ color: "#fff", fontSize: 18 }}>{codeData}</Text>
              </View>
            </View>
            <View style={styles.button}>
              <Button title="Refresh Code" onPress={handleRefreshCode} />
            </View>
          </>
        )}

        {error ? (
          <Text style={{ color: "red", fontSize: 16, marginTop: 10 }}>
            {error}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    margin: 5,
  },
  classText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "sans-serif",
    color: "#000000",
    opacity: 0.8,
    fontWeight: "bold",
  },
  codeText: {
    backgroundColor: "#2F3791",
    opacity: 0.9,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  qrCodeContainer: {
    marginTop: 10,
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderColor: "#6D78C4",
    borderWidth: 5,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
  },
  codeContainer: {
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  classContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  button: {
    marginTop: 50,
    width: 150,
  },
});
