import AsyncStorage from "@react-native-async-storage/async-storage";
import { E_ATTENDANCE_DEPLOY_URL } from "@env";

const API_URL = E_ATTENDANCE_DEPLOY_URL;

if (!API_URL) {
  throw new Error("API is not defined");
}

const getUserData = () => {
  return AsyncStorage.getItem("userData").then((data) => {
    if (data) {
      return JSON.parse(data);
      console.log(data);
    }
    return null;
  });
};

export { getUserData, API_URL };
