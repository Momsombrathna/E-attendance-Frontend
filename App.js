import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import withAuthProtection from "./src/context/AuthContext";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome5 } from "@expo/vector-icons";

import Classes from "./src/pages/Classes";
import Settings from "./src/pages/Settings";
import Profile from "./src/pages/Profile";
import Login from "./src/pages/auth/Login";
import Register from "./src/pages/auth/Register";
import VerifyEmail from "./src/pages/auth/verifyOtp/VerifyEmail";
import ForgotPass from "./src/pages/auth/resetPass/ForgotPass";
import VerifyEmailResetPass from "./src/pages/auth/resetPass/VerifyEmailResetPass";
import SetNewPass from "./src/pages/auth/resetPass/SetNewPass";

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
        tabBarStyle: {
          backgroundColor: "#fff",
        },
      })}
    >
      <Tab.Screen name="Classes" component={Classes} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

const ProtectedComponent = withAuthProtection(TabNavigator);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
        <Stack.Screen
          name="VerifyEmailResetPass"
          component={VerifyEmailResetPass}
        />
        <Stack.Screen name="SetNewPass" component={SetNewPass} />
        <Stack.Screen name="Home" component={ProtectedComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
