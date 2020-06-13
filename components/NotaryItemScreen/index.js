import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import { notifyMessage } from "../../utils";
import styles from "./styles";
import moment from "moment";
import { WebService } from "../../services";
import { AuthContext } from "../../hooks";

console.disableYellowBox = true;

export default function NotaryItemScreen({ navigation, route }) {
  const { file, fileType } = route.params;
  const { state, authContext } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const [notaryName, setNotaryName] = React.useState("");
  const [notaryDescription, setNotaryDescription] = React.useState("");
  const [notaryTextContent, setNotaryTextContent] = React.useState("");
  let fileName = "";
  try {
    if (file) {
      fileName = file.uri.split("/")[file.uri.split("/").length - 1];
    }
  } catch (err) {
    console.log(err);
  }

  const goBack = () => {
    navigation.goBack();
  };

  // send file data to server
  const sendFileData = async () => {
    setLoading(true);
    try {
      let res;
      if (fileType === "text") {
        res = await WebService.uploadTextToServer({
          name: notaryName,
          description: notaryDescription,
          type: fileType,
          phoneNumber: state.userMobileNumber,
          textContent: notaryTextContent,
          time: moment().format(),
        });
      } else {
        res = await WebService.uploadFileToServer(file, {
          name: notaryName,
          description: notaryDescription,
          type: fileType,
          phoneNumber: state.userMobileNumber,
          time: moment().format(),
        });
      }
      notifyMessage(res.message);
      authContext.fetchNotaryItem(state.userMobileNumber);
      setTimeout(async () => {
        navigation.navigate("Home");
      }, 2000);
    } catch (err) {
      notifyMessage(err.message);
    }
    setLoading(false);
  };
  return (
    <View style={styles.homeContainer}>
      <View style={styles.toolbarContainer}>
        <TouchableWithoutFeedback onPress={goBack}>
          <Image
            source={require("../../assets/system-icons/back.png")}
            style={styles.backIcon}
          ></Image>
        </TouchableWithoutFeedback>
        <Text style={styles.title}>Notary Details</Text>
      </View>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.notaryName}
        placeholder="Enter a name"
        autoFocus
        autoCorrect={false}
        onChangeText={(notaryName) => setNotaryName(notaryName)}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.notaryName}
        placeholder="Enter a description"
        autoCorrect={false}
        onChangeText={(notaryDescription) =>
          setNotaryDescription(notaryDescription)
        }
      />
      {fileType !== "text" ? (
        <>
          <Text style={styles.label}>File</Text>
          <View style={styles.fileContainer}>
            <Image
              source={require("../../assets/system-icons/attach.png")}
              style={styles.systemIcon}
            ></Image>
            <Text style={styles.fileName}>{fileName}</Text>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.notaryName}
            placeholder="Enter your content"
            autoCorrect={false}
            onChangeText={(notaryTextContent) =>
              setNotaryTextContent(notaryTextContent)
            }
          />
        </>
      )}
      <TouchableOpacity
        style={styles.sendVerificationButton}
        onPress={sendFileData}
      >
        {!loading ? (
          <Text style={styles.sendVerificationText}>Notarize</Text>
        ) : (
          <ActivityIndicator size="small" color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
}
