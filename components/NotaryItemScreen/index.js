import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  ToastAndroid,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

import styles from "./styles";
import moment from "moment";
import { WebService } from "../../services";
import { AuthContext } from "../../hooks";

export default function NotaryItemScreen({ navigation, route }) {
  const { file, fileType } = route.params;
  const { state } = React.useContext(AuthContext);
  const [notaryName, setNotaryName] = React.useState("");
  const [notaryDescription, setNotaryDescription] = React.useState("");
  const fileName = file.uri.split("/")[file.uri.split("/").length - 1];

  const goBack = () => {
    navigation.goBack();
  };
  const sendFileData = async () => {
    const res = await WebService.uploadFileToServer(file, {
      name: notaryName,
      description: notaryDescription,
      type: fileType,
      phoneNumber: state.userMobileNumber,
      time: moment().format(),
    });
    ToastAndroid.showWithGravity(
      res.message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
    setTimeout(() => {
      navigation.navigate("Home", {
        loadNotaryItems: true,
      });
    }, 2000);
  };
  return (
    <View style={styles.homeContainer}>
      <View style={styles.toolbarContainer}>
        <TouchableWithoutFeedback onPress={goBack}>
          <FontAwesome5 name="arrow-left" size={20} color="black" />
        </TouchableWithoutFeedback>
        <Text style={styles.title}>Notary Details</Text>
      </View>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.notaryName}
        placeholder="Enter a name"
        autoFocus
        onChangeText={(notaryName) => setNotaryName(notaryName)}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.notaryDescription}
        placeholder="Enter a description"
        multiline
        editable
        numberOfLines={4}
        onChangeText={(notaryDescription) =>
          setNotaryDescription(notaryDescription)
        }
      />
      <Text style={styles.label}>File</Text>
      <View style={styles.fileContainer}>
        <MaterialIcons name="attach-file" size={24} color="black" />
        <Text style={styles.fileName}>{fileName}</Text>
      </View>
      <TouchableOpacity
        style={styles.sendVerificationButton}
        onPress={sendFileData}
      >
        <Text style={styles.sendVerificationText}>Notarize</Text>
      </TouchableOpacity>
    </View>
  );
}
