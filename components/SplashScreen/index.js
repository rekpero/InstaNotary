import * as React from "react";
import { View, Image } from "react-native";
import styles from "./style";

console.disableYellowBox = true;

export default function SplashScreen() {
  return (
    <View style={styles.homeContainer}>
      <View style={styles.welcomeContainer}>
        <Image
          style={styles.welcomeIcon}
          source={{
            uri: `https://bluzelle.com/assets/img/Bluzelle%20-%20Screen%20-%20Logo%20-%20Big%20-%20Blue.png`,
          }}
        />
      </View>
    </View>
  );
}
