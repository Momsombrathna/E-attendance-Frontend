import React from "react";
import { Text, Animated, StyleSheet } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";

const styles = StyleSheet.create({
  rightAction: {
    backgroundColor: "color",
    minHeight: 70,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    color: "#fff",
  },
});

const renderRightAction = (text, color, x, progress, onPress, iconName) => {
  const trans = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [x, 0],
  });

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
      <RectButton
        style={[
          styles.rightAction,
          {
            backgroundColor: color,
            minHeight: 70,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
        onPress={onPress}
      >
        <Icon name={iconName} size={24} color="#fff" />
        <Text style={[styles.actionText, { color: "#fff", marginTop: 5 }]}>
          {text}
        </Text>
      </RectButton>
    </Animated.View>
  );
};

export { renderRightAction };
