import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import withAuthProtection from "./src/context/AuthContext";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome5 } from "@expo/vector-icons";
import { TouchableOpacity, Button, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Classes from "./src/pages/Classes";
import Settings from "./src/pages/Settings";
import Profile from "./src/pages/Profile";
import Login from "./src/pages/auth/Login";
import Register from "./src/pages/auth/Register";
import VerifyEmail from "./src/pages/auth/verifyOtp/VerifyEmail";
import ForgotPass from "./src/pages/auth/resetPass/ForgotPass";
import VerifyEmailResetPass from "./src/pages/auth/resetPass/VerifyEmailResetPass";
import SetNewPass from "./src/pages/auth/resetPass/SetNewPass";
import SubClasses from "./src/pages/user/SubClasses";
import CameraSelfie from "./src/pages/cameraSelfie";
import GenerateCard from "./src/pages/user/GenerateCard";
import CreateClass from "./src/pages/user/CreateClass";
import UpdateClass from "./src/pages/user/UpdateClass";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const navigation = useNavigation();
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
      <Tab.Screen
        name="Classes"
        component={Classes}
        options={{
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 20,
                backgroundColor: "#eee",
                padding: 5,
                width: 30,
                height: 30,
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => navigation.navigate("CreateClass")}
            >
              <FontAwesome5
                name="plus"
                size={20}
                style={{
                  color: "#2F3791",
                  opacity: 0.9,
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

const ProtectedComponent = withAuthProtection(TabNavigator);
const GenerateCardComponent = withAuthProtection(GenerateCard);
const CreateClassComponent = withAuthProtection(CreateClass);
const UpdateClassComponent = withAuthProtection(UpdateClass);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={ProtectedComponent}
          options={{ title: " Back" }}
        />
        <Stack.Screen name="GenerateCard" component={GenerateCardComponent} />
        <Stack.Screen
          name="CreateClass"
          component={CreateClassComponent}
          options={{
            title: " Create Class",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="UpdateClass"
          component={UpdateClassComponent}
          options={{
            headerShown: true,
            title: "Update Class",
          }}
        />

        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
        <Stack.Screen name="ForgotPass" component={ForgotPass} />
        <Stack.Screen
          name="VerifyEmailResetPass"
          component={VerifyEmailResetPass}
        />
        <Stack.Screen name="SetNewPass" component={SetNewPass} />
        <Stack.Screen name="Classes" component={Classes} />
        <Stack.Screen
          name="SubClass"
          component={SubClasses}
          options={({ route }) => ({
            headerShown: true,
            title: route.params.className,
          })}
        />
        <Stack.Screen
          name="cameraSelfie"
          component={CameraSelfie}
          options={{ headerShown: true, title: "Take a selfie" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
