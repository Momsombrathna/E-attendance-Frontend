import React, { useState, createRef, useEffect } from "react";
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import Logo from "../../../../assets/e-attendance.png";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../../api/config";
import axios from "axios";

export default function VerifyEmailResetPass({ route }) {
  const { email } = route.params;
  const [errors, setErrors] = useState({ otp: "" });
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(120);
  const [loadingResent, setLoadingResent] = useState(false);
  const navigation = useNavigation();

  const [otp, setOtp] = useState(Array(6).fill("")); // Assuming OTP is 6 digits
  const otpTextInput = Array(6)
    .fill()
    .map(() => createRef());

  const handleChange = (index, value) => {
    let otpValues = [...otp];
    otpValues[index] = value;
    setOtp(otpValues);

    // Focus next input after entering a digit
    if (value && index < otpTextInput.length - 1) {
      otpTextInput[index + 1].current.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // On backspace, focus the previous input and clear the current input
    if (e.nativeEvent.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        otpTextInput[index - 1].current.focus();
      }
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setErrors({ otp: "Please enter a 6-digit OTP." });
      return;
    }

    setLoading(true);

    try {
      const otpResponse = await axios.post(
        `${API_URL}/auth/verify-pass-reset-otp`,
        {
          email,
          otp: enteredOtp,
        }
      );
      Alert.alert("Success", otpResponse.data.message);
      navigation.navigate("SetNewPass", { email });
    } catch (error) {
      setErrors({ otp: error.response.data.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoadingResent(true);
    try {
      const otpResponse = await axios.post(
        `${API_URL}/auth/pass-reset-req-otp`,
        {
          email,
        }
      );
      Alert.alert("Success", otpResponse.data.message);
    } catch (error) {
      Alert.alert("Error", error.response.data.message);
    } finally {
      setLoadingResent(false);
    }
    setCounter(120);
  };

  useEffect(() => {
    if (counter === 0) {
      setCounter(null);
      return;
    }

    if (counter === null) {
      return;
    }

    const timerId = setTimeout(() => {
      setCounter(counter - 1);
    }, 1000);

    return () => {
      clearTimeout(timerId);
    };
  }, [counter]);

  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.main}>
          <View style={styles.logo}>
            <Image source={Logo} style={{ width: 110, height: 100 }} />
          </View>
          <Text style={styles.header}>Verify your email with OTP</Text>

          <View
            style={{
              position: "relative",
            }}
          >
            <View style={styles.otpInput}>
              {otp.map((value, index) => (
                <TextInput
                  key={index}
                  style={[styles.input, errors.otp && styles.inputError]}
                  onChangeText={(value) => handleChange(index, value)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  value={value}
                  keyboardType="numeric"
                  maxLength={1}
                  ref={otpTextInput[index]}
                />
              ))}
            </View>
            <View style={styles.errorMessage}>
              {errors.otp ? (
                <Text style={{ color: "red" }}>{errors.otp}</Text>
              ) : null}
            </View>
          </View>

          <TouchableOpacity
            style={styles.btn}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Submit
              </Text>
            )}
          </TouchableOpacity>

          <Text
            style={{
              color: "gray",
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
              height: 50,
              marginTop: 16,
            }}
          >
            Don't receive the code? &nbsp;
            <Text
              style={{
                color: "#2F3791",
                opacity: 0.9,
                height: 50,
                alignContent: "center",
              }}
              onPress={counter === null ? handleResendOtp : null}
            >
              {loadingResent ? (
                <>
                  <Text style={{ paddingLeft: 10 }}>Sending...</Text>
                </>
              ) : counter !== null ? (
                `Resend OTP in ${counter} seconds`
              ) : (
                "Resend OTP."
              )}
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: "100%",
    height: 50,
    backgroundColor: "#2F3791",
    borderRadius: 10,
    opacity: 0.9,
    justifyContent: "center",
    marginTop: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 110,
    height: 100,
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
    color: "#2F3791",
    opacity: 0.8,
  },
  main: {
    width: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  otpInput: {
    width: "full",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 5,
  },
  input: {
    width: 50,
    height: 50,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 16,
    backgroundColor: "#eee",
    margin: 5,
  },
  inputError: {
    borderColor: "red",
  },
  errorMessage: {
    height: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
