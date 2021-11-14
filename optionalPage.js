import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function optionalPage() {
  return (
    <View style={styles.loading}>
      <Image
        style={styles.clothes__part2}
        source={require("./img/main_photo.png")}
      />
    </View>
  );
}
const styles = StyleSheet.create({});
