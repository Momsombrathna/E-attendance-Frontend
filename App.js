import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import withAuthProtection from "./src/context/AuthContext";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "./src/hooks/ThemeContext";

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
import CreateSubClasses from "./src/pages/user/CreateSubClasses";
import ViewSubClasses from "./src/pages/user/ViewSubClasses";
import JoinClass from "./src/pages/user/JoinClass";
import MyClasses from "./src/pages/MyClasses";
import ViewMember from "./src/pages/user/ViewMember";
import MySubClasses from "./src/pages/user/MySubClass";
import EditMySubClass from "./src/pages/user/EditMySubClass";
import CheckMember from "./src/pages/user/CheckMember";

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
            iconName = "building-o";
          } else if (route.name === "Settings") {
            iconName = "cog";
          } else if (route.name === "Profile") {
            iconName = "user-circle-o";
          } else if (route.name === "MyClasses") {
            iconName = "book";
          }

          return (
            <View
              style={{
                alignItems: "center",
                flex: 1,
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  borderBottomRightRadius: 10,
                  borderBottomLeftRadius: 10,
                  backgroundColor: focused ? "#2F3791" : "#fff",
                  height: 2,
                  width: 70,
                }}
              />

              <Icon name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: "#2F3791",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
        },
      })}
    >
      <Tab.Screen
        name="MyClasses"
        component={MyClasses}
        options={{
          title: "My Classes",
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 20,
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
                paddingHorizontal: 10,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => navigation.navigate("JoinClass")}
            >
              <Text>Join</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

const HeaderRight = ({ classId, token }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{
        marginRight: 20,
        padding: 5,
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={() =>
        navigation.navigate("CreateSubClasses", { classId, token })
      }
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
  );
};

const ProtectedComponent = withAuthProtection(TabNavigator);
const GenerateCardComponent = withAuthProtection(GenerateCard);
const CreateClassComponent = withAuthProtection(CreateClass);
const UpdateClassComponent = withAuthProtection(UpdateClass);
const CreateSubClassesComponent = withAuthProtection(CreateSubClasses);
const ViewSubClassesComponent = withAuthProtection(ViewSubClasses);
const EditMySubClassComponent = withAuthProtection(EditMySubClass);
const CheckMemberComponent = withAuthProtection(CheckMember);

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
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
            name="MySubClass"
            component={MySubClasses}
            options={({ route, navigation }) => ({
              headerShown: true,
              title: route.params.className,
              headerRight: () => (
                <HeaderRight
                  classId={route.params.classId}
                  token={route.params.token}
                />
              ),
              headerTitle: () => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("viewMembers", {
                        classId: route.params.classId,
                        token: route.params.token,
                      })
                    }
                  >
                    <Text style={{ fontWeight: "600", fontSize: 16 }}>
                      {route.params.className}
                    </Text>
                  </TouchableOpacity>
                );
              },
              title: "Back",
            })}
          />
          <Stack.Screen
            name="SubClass"
            component={SubClasses}
            options={({ route, navigation }) => ({
              headerShown: true,
              title: route.params.className,
              headerTitle: () => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("viewMembers")}
                  >
                    <Text style={{ fontWeight: "600", fontSize: 16 }}>
                      {route.params.className}
                    </Text>
                  </TouchableOpacity>
                );
              },
              title: "Back",
            })}
          />
          <Stack.Screen
            name="viewMembers"
            component={ViewMember}
            options={{ headerShown: true, title: "Members" }}
          />
          <Stack.Screen
            name="cameraSelfie"
            component={CameraSelfie}
            options={{ headerShown: true, title: "Take a selfie" }}
          />
          <Stack.Screen
            name="GenerateCard"
            component={GenerateCardComponent}
            options={{ title: "My Card" }}
          />
          <Stack.Screen
            name="CreateClass"
            component={CreateClassComponent}
            options={{
              title: " Create Class",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="JoinClass"
            component={JoinClass}
            options={{
              title: " Join Class",
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
          <Stack.Screen
            name="CreateSubClasses"
            component={CreateSubClassesComponent}
            options={{
              headerShown: true,
              title: "Create Subclass",
            }}
            headerRight={() => <HeaderRight />}
          />
          <Stack.Screen
            name="ViewSubClasses"
            component={ViewSubClassesComponent}
            options={{
              headerShown: true,
              title: "View Subclass",
            }}
          />
          <Stack.Screen
            name="EditMySubClass"
            component={EditMySubClassComponent}
            options={{
              headerShown: true,
              title: "Edit Subclass",
            }}
          />
          <Stack.Screen
            name="CheckMember"
            component={CheckMemberComponent}
            options={{
              headerShown: true,
              title: "Attendance",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}
