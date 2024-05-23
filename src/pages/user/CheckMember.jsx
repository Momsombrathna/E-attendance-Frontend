import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { ThemeContext } from "../../hooks/ThemeContext";

export default function CheckMember({ route }) {
  const { item } = route.params;
  const { darkMode } = useContext(ThemeContext);

  const styles = StyleSheet.create({
    main: {
      flex: 1,
      backgroundColor: darkMode ? "#000" : "#fff",
      paddingHorizontal: 10,
    },

    container: {
      borderRadius: 5,
      flex: 1,
      marginHorizontal: 5,
      marginVertical: 5,
      backgroundColor: darkMode ? "#555" : "#B9B9B9",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },

    rowContainer: {
      flexDirection: "row",
      alignItems: "center",
    },

    columnContainer: {
      flexDirection: "Column",
      alignItems: "center",
      paddingVertical: 10,
    },

    text: {
      fontSize: 20,
      color: darkMode ? "#fff" : "#000",
      fontWeight: "bold",
    },
    checkedText: {
      fontSize: 16,
      color: darkMode ? "#fff" : "#000",
      fontWeight: "bold",
    },
  });
  return (
    <View style={styles.main}>
      <FlatList
        numColumns={2}
        data={Object.entries(item.attendances)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.container}>
            <View style={styles.columnContainer}>
              <Image
                source={{ uri: item[1].studentProfile }}
                style={{ width: 80, height: 80 }}
              />

              <View style={styles.columnContainer}>
                <Text style={styles.text}>{item[1].studentName}</Text>
                <View
                  style={[
                    styles.columnContainer,
                    {
                      padding: 0,
                      alignItems: "flex-start",
                    },
                  ]}
                >
                  <View>
                    <Text style={styles.checkedText}>
                      Checked In:{" "}
                      {item[1].checkedIn === true ? (
                        <Text style={{ color: "#00FF00" }}>
                          {new Date(item[1].checkedInTime).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit", hour12: true }
                          )}
                        </Text>
                      ) : (
                        <Text style={{ color: "red" }}>Not now</Text>
                      )}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.checkedText}>
                      Checked Out:{" "}
                      {item[1].checkedOut === true ? (
                        <Text style={{ color: "#00FF00" }}>
                          {new Date(item[1].checkedOutTime).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit", hour12: true }
                          )}
                        </Text>
                      ) : (
                        <Text style={{ color: "red" }}>Not now</Text>
                      )}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.text,
                    {
                      fontWeight: "400",
                      color: "#fff",
                      backgroundColor:
                        item[1].status === "Present" ? "#00FF00" : "red",
                      padding: 5,
                      borderRadius: 5,
                      paddingHorizontal: 10,
                    },
                  ]}
                >
                  Status: {item[1].status}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
