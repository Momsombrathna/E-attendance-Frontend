import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://e-attendance-backend.onrender.com";

if (!API_URL) {
  throw new Error("API is not defined");
}

const getUSerData = async () => {
  try {
    const result = await AsyncStorage.multiGet([
      "token",
      "userId",
      "profile",
      "email",
    ]);
    const data = {};
    result.forEach(([key, value]) => {
      data[key] = value;
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

let userToken, userId, userProfile, userEmail;

getUSerData().then((data) => {
  userToken = data.token;
  userId = data.userId;
  userProfile = data.profile;
  userEmail = data.email;
});

export { API_URL, userToken, userId, userProfile, userEmail };
