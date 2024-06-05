import React, { useState, useContext } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import withAuthProtection from "./src/context/AuthContext";
import FlashMessage from "react-native-flash-message";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
import ShowCode from "./src/pages/user/ShowCode";
import QrCodeScannerJoinClass from "./src/pages/user/QrCodeScannerJoinClass";
import ViewSubclassesMember from "./src/pages/user/ViewSubclassesMember";
import UpdateProfile from "./src/pages/user_profiles/UpdateProfile";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import TeacherScanner from "./src/pages/user/TeacherScanner";
import EditCard from "./src/pages/user/EditCard";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const navigation = useNavigation();
  const { darkMode } = useContext(ThemeContext);

  const tabBarBackgroundColor = darkMode ? "#333" : "#fff";
  const tabBarActiveColor = darkMode ? "#fff" : "#2F3791";
  const tabBarInactiveColor = darkMode ? "#888" : "gray";
  const headerBackgroundColor = darkMode ? "#333" : "#fff";
  const headerTintColor = darkMode ? "#fff" : "#000";

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
                  backgroundColor: focused
                    ? tabBarActiveColor
                    : tabBarBackgroundColor,
                  height: 2,
                  width: 70,
                }}
              />
              <Icon name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: tabBarActiveColor,
        tabBarInactiveTintColor: tabBarInactiveColor,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: tabBarBackgroundColor,
        },
        headerStyle: {
          backgroundColor: headerBackgroundColor,
        },
        headerTintColor: headerTintColor,
      })}
    >
      <Tab.Screen
        name="MyClasses"
        component={MyClasses}
        options={{
          tabBarVisible: false,
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
                  color: tabBarActiveColor,
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

const HeaderRight = ({ classId, token, code, classProfile, className }) => {
  const navigation = useNavigation();
  const { darkMode } = useContext(ThemeContext);

  const buttonColor = darkMode ? "#fff" : "#2F3791";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          marginRight: 10,
          padding: 5,
          width: 30,
          height: 30,
          borderRadius: 15,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() =>
          navigation.navigate("ShowCode", {
            code,
            classId,
            token,
            classProfile,
            className,
          })
        }
      >
        <MaterialCommunityIcons
          name="qrcode"
          size={20}
          style={{
            color: darkMode ? "#fff" : "#2F3791",
            opacity: 0.9,
          }}
        />
      </TouchableOpacity>
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
            color: darkMode ? "#fff" : "#2F3791",
            opacity: 0.9,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const ProtectedComponent = withAuthProtection(TabNavigator);
const GenerateCardComponent = withAuthProtection(GenerateCard);
const EditCardComponent = withAuthProtection(EditCard);
const CreateClassComponent = withAuthProtection(CreateClass);
const UpdateClassComponent = withAuthProtection(UpdateClass);
const CreateSubClassesComponent = withAuthProtection(CreateSubClasses);
const ViewSubClassesComponent = withAuthProtection(ViewSubClasses);
const EditMySubClassComponent = withAuthProtection(EditMySubClass);
const CheckMemberComponent = withAuthProtection(CheckMember);
const showCodeComponent = withAuthProtection(ShowCode);
const QrCodeScannerJoinClassComponent = withAuthProtection(
  QrCodeScannerJoinClass
);
const TeacherScannerComponent = withAuthProtection(TeacherScanner);
const ViewSubclassesMemberComponent = withAuthProtection(ViewSubclassesMember);
const UpdatePropertiesComponent = withAuthProtection(UpdateProfile);

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <NavigationContainer>
          <StatusBar
            barStyle={darkMode ? "light-content" : "dark-content"}
            backgroundColor={darkMode ? "#333" : "#fff"}
          />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              headerStyle: {
                backgroundColor: darkMode ? "#333" : "#fff",
              },
              headerTintColor: darkMode ? "#fff" : "#000",
              contentStyle: {
                backgroundColor: darkMode ? "#333" : "#fff",
              },
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
                    code={route.params.code}
                    classProfile={route.params.classProfile}
                    className={route.params.className}
                  />
                ),
                headerTitle: () => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("viewMembers", {
                        classId: route.params.classId,
                        token: route.params.token,
                      })
                    }
                  >
                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: 14,
                        color: darkMode ? "#fff" : "#000",
                        maxWidth: 150,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {route.params.className}
                    </Text>
                  </TouchableOpacity>
                ),
                title: "Back",
              })}
            />
            <Stack.Screen
              name="SubClass"
              component={SubClasses}
              options={({ route, navigation }) => ({
                headerShown: true,
                title: route.params.className,
                headerTitle: () => (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ViewSubclassesMember", {
                        classId: route.params.classId,
                        token: route.params.token,
                      })
                    }
                  >
                    <Text
                      style={{
                        fontWeight: "600",
                        fontSize: 16,
                        color: darkMode ? "#fff" : "#000",
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {route.params.className}
                    </Text>
                  </TouchableOpacity>
                ),
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
              name="EditCard"
              component={EditCardComponent}
              options={{ title: "My Card", headerShown: true }}
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
              options={({ route }) => ({
                headerShown: true,
                headerTitle: () => (
                  <Text
                    style={{
                      maxWidth: 150,
                      fontWeight: "600",
                      fontSize: 16,
                      color: darkMode ? "#fff" : "#000",
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {route.params.className}
                  </Text>
                ),
              })}
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
            <Stack.Screen
              name="ShowCode"
              component={showCodeComponent}
              options={{
                headerShown: true,
                title: "Invite Code",
              }}
            />
            <Stack.Screen
              name="Scanner"
              component={QrCodeScannerJoinClassComponent}
              options={{
                headerShown: true,
                title: "Scan Code",
              }}
            />
            <Stack.Screen
              name="TeacherScanner"
              component={TeacherScannerComponent}
              options={{
                headerShown: true,
                title: "Scan Code",
              }}
            />
            <Stack.Screen
              name="ViewSubclassesMember"
              component={ViewSubclassesMemberComponent}
              options={{
                headerShown: true,
                title: "Members",
              }}
            />
            <Stack.Screen
              name="UpdateProfile"
              component={UpdatePropertiesComponent}
              options={{
                headerShown: true,
                title: "Update Profile",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <FlashMessage position="top" />
      </ThemeContext.Provider>
    </GestureHandlerRootView>
  );
}
