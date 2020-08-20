import * as React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
} from "react-native";
import styles from "./style";

console.disableYellowBox = true;

export default function AboutScreen({ navigation }) {
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.homeContainer}>
      <View style={styles.toolbarContainer}>
        <TouchableWithoutFeedback onPress={goBack} style={styles.backContainer}>
          <Image
            source={require("../../assets/system-icons/back.png")}
            style={styles.backIcon}
          ></Image>
        </TouchableWithoutFeedback>
        <Text style={styles.title}>About</Text>
      </View>
      <ScrollView style={styles.bodyContainer}>
        <Text style={styles.subtitle}>
          The application aims to give users a way to instantly notarize any
          data or file they want with current date time and location.
        </Text>
        <Text style={styles.subtitle}>
          Built on top of <Text style={styles.highlight}>Bluzelle</Text> and{" "}
          <Text style={styles.highlight}>IPFS</Text> to provide a secure way of
          storing data and keep track of any modifications made on the notary.
        </Text>
        <Text style={styles.bodyTitle}>About Bluzelle</Text>
        <Text style={styles.subtitle}>
          Bluzelle is a decentralized, scalable database service that aims to
          provide an effective data storage solution for newly emerging
          blockchain ecosystem.
        </Text>
        <Text style={styles.subtitle}>
          It provides a solution to the scaling problems that developers of
          decentralized application (dApps) face while using centralized
          infrastructure and traditional cloud-based databases.
        </Text>
        <Text style={styles.bodyTitle}>About IPFS</Text>
        <Text style={styles.subtitle}>
          The InterPlanetary File System (IPFS) is a protocol and peer-to-peer
          network for storing and sharing data in a distributed file system.
          IPFS uses content-addressing to uniquely identify each file in a
          global namespace connecting all computing devices.
        </Text>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <Text style={styles.bottomTitle}>Built with 💜 by rekpero.</Text>
      </View>
    </View>
  );
}
