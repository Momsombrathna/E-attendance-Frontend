import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import { withAuthProtection } from "./src/context/AuthContext";
import { createStackNavigator } from "@react-navigation/stack";

import Classes from "./src/pages/Class/Classes";
import Settings from "./src/pages/Settings";
import Profile from "./src/pages/Profile";
import Login from "./src/pages/auth/Login";
import SubClass from "./src/pages/Class/SubClass";
import CameraSelfie from "./src/components/cameraSelfie";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Classes") {
            iconName = focused ? "book" : "book";
          } else if (route.name === "Settings") {
            iconName = focused ? "cog" : "cog";
          } else if (route.name === "Profile") {
            iconName = focused ? "user-circle-o" : "user-circle-o";
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2F3791",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Classes" component={Classes} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

//const ProtectedComponent = withAuthProtection(TabNavigator);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Set headerShown to false to hide the header
        }}
      >
        {/* <Stack.Screen name="Login" component={Login} /> */}
        <Stack.Screen
          name="Protected"
          component={TabNavigator}
          options={{ title: "Back" }}
        />
        <Stack.Screen
          name="SubClass"
          component={SubClass}
          options={{ headerShown: true, title: "Back" }}
        />
        <Stack.Screen
          name="cameraSelfie"
          component={CameraSelfie}
          options={{ headerShown: true, title: "Capture Your Selfie"}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
