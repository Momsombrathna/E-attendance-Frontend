import React, { useState, useEffect } from "react";
import { API_URL, useUserData } from "../../api/config";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Button,
  ActivityIndicator,
} from "react-native";

export default function ViewSubClasses({ route }) {
  const { subClassId } = route.params;

  return (
    <View>
      <Text>View Sub Classes</Text>
      <Text>{subClassId}</Text>
    </View>
  );
}
