import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect } from "react";

function withAuthProtection(Component) {
  return function WithAuthProtection(props) {
    const navigation = useNavigation();
    const route = useRoute();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      checkAuth();
    }, [route]);

    const checkAuth = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (!userData) {
        navigation.navigate("Login");
        return;
      }

      const parsedData = JSON.parse(userData);
      const expires = new Date(parsedData.expirationDate);
      const now = new Date();

      if (now > expires) {
        navigation.navigate("Login");
        return;
      }

      setLoading(false);
    };

    if (loading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return <Component {...props} />;
  };
}

export default withAuthProtection;
