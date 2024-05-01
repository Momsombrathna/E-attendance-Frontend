import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React from "react";


const data = ["Class 1", "Class 2", "Class 3", "Class 4"]; // Replace this with your data

const Item = ({ title, navigation }) => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => navigation.navigate("SubClass")}
  >
    <View style={styles.content}>
      <Image
        source={require("../../../assets/e-attendance.png")}
        style={styles.image}
      />
      <View>
        <Text style={[styles.text, { marginStart: 10 }]}>{title}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const Classes = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <Item title={item} navigation={navigation} />
  );

  return (
    <View style= {{flex: 1}}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

export default Classes;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginHorizontal: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 40,
    height: 37,
  },
});
