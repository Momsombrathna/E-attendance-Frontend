import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

const data = ["SubClass 1", "SubClass 2", "SubClass 3", "SubClass 4"]; // Replace this with your data

const Item = ({ title, navigation }) => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => navigation.navigate("cameraSelfie")}
  >
    <View style={styles.content}>
      <Image
        source={require("../../assets/e-attendance.png")}
        style={styles.image}
      />
      <View>
        <Text style={[styles.text, { marginStart: 10 }]}>{title}</Text>
        <Text style={[styles.text, { marginStart: 10 }]}>00:00 - 00:00</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const SubClass = () => {
  const renderItem = ({ item }) => (
    <Item title={item} navigation={navigation} />
  );
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
    </SafeAreaView>
  );
};

export default SubClass;

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
