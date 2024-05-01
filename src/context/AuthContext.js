import React from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

function withAuthProtection(Component) {
  return function ProtectedRoute(props) {
    const navigation = useNavigation();
    const route = useRoute();
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      (async () => {
        const userData = await AsyncStorage.getItem("userData");
        if (!userData && route.name !== "Login") {
          navigation.replace("Login");
        }
        setIsLoading(false);
      })();
    }, []);

    if (isLoading) {
      return (
        <View>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    return <Component {...props} />;
  };
}

export default withAuthProtection;
