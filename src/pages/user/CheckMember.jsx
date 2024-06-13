import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { ThemeContext } from "../../hooks/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Feather from "react-native-vector-icons/Feather";
import { FontAwesome } from "@expo/vector-icons";
import moment from "moment";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";

export default function CheckMember({ route }) {
  const { item } = route.params;
  const { darkMode } = useContext(ThemeContext);
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    main: {
      flex: 1,
      backgroundColor: darkMode ? "#444" : "#fff",
    },
    container: {
      borderRadius: 10,
      flex: 1,
      marginHorizontal: 10,
      marginVertical: 3,
      backgroundColor: darkMode ? "#333" : "#eee",
    },
    body: {
      flex: 1,
      padding: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    profilesContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    text: {
      color: darkMode ? "#fff" : "#000",
      fontSize: 16,
      fontWeight: "600",
    },
    columnContainer: {
      width: "60%",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "start",
    },
    checkedText: {
      color: darkMode ? "#fff" : "#000",
      fontSize: 14,
      fontWeight: "400",
    },
    button: {
      backgroundColor: "#2F3791",
      padding: 10,
      borderRadius: 10,
      margin: 10,
    },
    buttonText: {
      color: "#fff",
      textAlign: "center",
    },
    statusContainer: {
      flexDirection: "column",
      alignItems: "start",
      marginLeft: 10,
    },
    status: {
      color: "#fff",
      alignItems: "center",
      fontSize: 12,
    },
    statusChip: {
      marginTop: 5,
      paddingHorizontal: 5,
      borderRadius: 10,
    },
    checkContainer: {
      flexDirection: "column",
      justifyContent: "start",
      alignItems: "flex-start",
    },
  });

  const data = Object.entries(item.attendances)
    .filter(([key, value]) => key !== "0")
    .map(([key, value]) => {
      return {
        studentName: value.studentName,
        status: value.status,
        checkedIn: value.checkedIn,
        checkedInTime:
          value.checkedInTime === null
            ? "No"
            : moment(value.checkedInTime).format("ddd,MM YYYY HH:MM"),
        checkedOut: value.checkedOut,
        checkedOutTime:
          value.checkedOutTime === null
            ? "No"
            : moment(value.checkedOutTime).format("ddd,MM YYYY HH:MM"),
      };
    });

  // export attendances to excel file
  const exportToExcel = async () => {
    try {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        `E-Attendance of ${item.description}.xlsx`
      );
      const wbout = XLSX.write(wb, {
        type: "base64",
        bookType: "xlsx",
      });
      const uri =
        FileSystem.cacheDirectory + `E-Attendance of ${item.description}.xlsx`;
      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await Sharing.shareAsync(uri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: `E-Attendance of ${item.description}`,
        UTI: "com.microsoft.excel.xlsx",
      });

      await FileSystem.deleteAsync(uri);
    } catch (error) {
      Alert.alert("Error", "Failed to export to excel file");
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            paddingRight: 10,
          }}
        >
          <TouchableOpacity onPress={exportToExcel}>
            <FontAwesome name="file-excel-o" size={24} color="#2F3791" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("TeacherScanner", { item })}
          >
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={24}
              color="#2F3791"
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.main}>
      <FlatList
        data={Object.entries(item.attendances)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) =>
          item[0] !== "0" && (
            <View style={styles.container}>
              <View style={styles.body}>
                <View style={styles.profilesContainer}>
                  <Image
                    source={{ uri: item[1].studentProfile }}
                    style={{ width: 60, height: 60, borderRadius: 30 }}
                  />
                  <View style={styles.statusContainer}>
                    <Text style={styles.text}>{item[1].studentName}</Text>
                    <View
                      style={{
                        ...styles.statusChip,
                        backgroundColor:
                          item[1].status === "present" ? "#00FF00" : "#FF0000",
                      }}
                    >
                      <Text style={styles.status}>{item[1].status}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.columnContainer}>
                  <View style={styles.checkContainer}>
                    <Text style={styles.checkedText}>
                      check in:{" "}
                      {item[1].checkedIn === true ? (
                        <View
                          style={{
                            backgroundColor: "rgba(0, 255, 0, 0.5)",
                            paddingHorizontal: 5,
                            borderRadius: 10,
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 12,
                            }}
                          >
                            {moment(item[1].checkedInTime).format(
                              "ddd,MM YYYY hh:mm a"
                            )}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            backgroundColor: "rgba(255, 0, 0, 0.5)",
                            paddingHorizontal: 5,
                            borderRadius: 10,
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 12,
                            }}
                          >
                            Not now
                          </Text>
                        </View>
                      )}
                    </Text>

                    <Text style={styles.checkedText}>
                      check out:{" "}
                      {item[1].checkedOut === true ? (
                        <View
                          style={{
                            backgroundColor: "rgba(0, 255, 0, 0.5)",
                            paddingHorizontal: 5,
                            borderRadius: 10,
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 12,
                            }}
                          >
                            {moment(item[1].checkedOutTime).format(
                              "ddd,MM YYYY hh:mm a"
                            )}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            backgroundColor: "rgba(255, 0, 0, 0.5)",
                            paddingHorizontal: 5,
                            borderRadius: 10,
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: "#fff",
                              fontSize: 12,
                            }}
                          >
                            Not now
                          </Text>
                        </View>
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )
        }
      />
    </View>
  );
}
