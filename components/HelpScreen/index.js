import * as React from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import styles from "./style";

console.disableYellowBox = true;

export default function HelpScreen({ navigation }) {
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.homeContainer}>
      <View style={styles.toolbarContainer}>
        <TouchableWithoutFeedback onPress={goBack} style={styles.backContainer}>
          <Image
            source={require("../../assets/system-icons/back.png")}
            style={styles.backIcon}
          ></Image>
        </TouchableWithoutFeedback>
        <Text style={styles.title}>Help</Text>
      </View>
      <ScrollView style={styles.bodyContainer}>
        <Text style={styles.subtitle}>
          You can follow the proof-chain for a notarized item by doing the
          following:
        </Text>
        <Text style={styles.listItem}>
          - Open the notarized item in the app.
        </Text>
        <Text style={styles.listItem}>
          - Note down/copy the IPFS hash. This is a unique hash that identifies
          exactly the contents of the item.
        </Text>
        <Text style={styles.listItem}>
          - Click the "TX Link" in the app to see the JSON for the original
          transaction on the Bluzelle blockchain. Note down the date and time.
          Also note down the "ipfsHash" value buried inside the Value field of
          the JSON object.
        </Text>
        <Text style={styles.listItem}>
          - Download the item to your computer or phone. We recommend your
          computer. This only currently works in the app for videos and photos.
          Please download from the IPFS gateway for documents. For text, just
          copy the text to the clipboard.
        </Text>
        <Text style={styles.listItem}>
          - Install the IPFS client to your computer. Goto:
          https://docs.ipfs.io/how-to/command-line-quick-start. If using a
          phone, install a suitable IPFS app.
        </Text>
        <Text style={styles.listItem}>
          {
            "- On your computer, run 'ipfs add -n <filename>', referring to the downloaded item's file. If on a phone, use the IPFS app to compute the IPFS hash. For a text, put the text string into a file manually."
          }
        </Text>
        <Text style={styles.listItem}>
          - Compare the IPFS hash computed in the last step to the IPFS hash
          from the Bluzelle notary app and ensure they match.
        </Text>
        <Text style={styles.subtitle}>
          This completes the proof chain. You can see the notary record was
          created immutably on Bluzelle at the given date and time. You can see
          the "Qm..." IPFS hash of the item's contents in Bluzelle, immutably
          guaranteeing the authenticity of the contents of the item on that date
          and time. And you can confirm that the item's contents, as retrieved
          in the app or from IPFS, has a hash today that matches the hash when
          the item was created.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
