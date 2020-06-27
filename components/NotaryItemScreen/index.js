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
import * as Location from "expo-location";
import { notifyMessage } from "../../utils";
import styles from "./styles";
import moment from "moment";
import timezone from "moment-timezone";
import { WebService } from "../../services";
import { AuthContext } from "../../hooks";
import { CheckBox } from "native-base";
import * as Permissions from "expo-permissions";

console.disableYellowBox = true;

export default function NotaryItemScreen({ navigation, route }) {
  const { file, fileType } = route.params;
  const { state, authContext } = React.useContext(AuthContext);
  const [loading, setLoading] = React.useState(false);
  const [notaryName, setNotaryName] = React.useState("");
  let fileName = "";
  try {
    if (file) {
      fileName = file.uri.split("/")[file.uri.split("/").length - 1];
    }
  } catch (err) {
    console.log(err);
  }
  const [notaryDescription, setNotaryDescription] = React.useState(fileName);
  const [notaryTextContent, setNotaryTextContent] = React.useState("");
  const [notaryTakeLocation, setNotaryTakeLocation] = React.useState(false);

  const goBack = () => {
    navigation.goBack();
  };

  const handleAskForLocation = async () => {
    if (!notaryTakeLocation) {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== "granted") {
        setNotaryTakeLocation(false);
        notifyMessage("Sorry, we need location to make this work!");
      } else {
        setNotaryTakeLocation(!notaryTakeLocation);
      }
    } else {
      setNotaryTakeLocation(!notaryTakeLocation);
    }
  };

  // send file data to server
  const sendFileData = async () => {
    setLoading(true);
    let region = null;
    if (notaryTakeLocation) {
      console.log("Entering notary location");
      const location = await Location.getCurrentPositionAsync({});

      region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 1.0,
        longitudeDelta: 1.0,
      };
    }
    const timeZone = moment.tz.guess();
    const time = new Date();
    const timeZoneOffset = time.getTimezoneOffset();
    const timeZoneAbbr = moment.tz.zone(timeZone).abbr(timeZoneOffset);
    try {
      let res;
      if (fileType === "text") {
        res = await WebService.uploadTextToServer({
          name: notaryName,
          description: notaryDescription,
          type: fileType,
          phoneNumber: state.userMobileNumber,
          textContent: notaryTextContent,
          isLocationEnabled: notaryTakeLocation,
          region,
          timeZone: timeZoneAbbr,
          time: moment().format(),
        });
        console.log(res);
        notifyMessage(res.message);
        authContext.fetchNotaryItem(state.userMobileNumber);
        setTimeout(async () => {
          navigation.navigate("Home");
        }, 2000);
      } else {
        res = await WebService.uploadFileToServer(
          file,
          {
            name: notaryName,
            description: notaryDescription,
            type: fileType,
            fileName,
            phoneNumber: state.userMobileNumber,
            isLocationEnabled: notaryTakeLocation,
            region,
            timeZone: timeZoneAbbr,
            time: moment().format(),
          },
          (progressEvent) => {
            const { loaded, total } = progressEvent;
            let percent = Math.floor((loaded / total) * 100);
            console.log(`${loaded}kb of ${total}kb | ${percent}%`);
          },
          (res) => {
            console.log(res);
            notifyMessage(res.message);
            authContext.fetchNotaryItem(state.userMobileNumber);
            setTimeout(async () => {
              navigation.navigate("Home");
            }, 2000);
          }
        );
      }
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
        returnKeyType="done"
        value={notaryName}
        onChangeText={(notaryName) => setNotaryName(notaryName)}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.notaryName}
        placeholder="Enter a description"
        autoCorrect={false}
        returnKeyType="done"
        onChangeText={(notaryDescription) =>
          setNotaryDescription(notaryDescription)
        }
        value={notaryDescription}
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
            returnKeyType="done"
            value={notaryTextContent}
            onChangeText={(notaryTextContent) =>
              setNotaryTextContent(notaryTextContent)
            }
          />
        </>
      )}
      <View style={styles.item}>
        <CheckBox
          checked={notaryTakeLocation}
          color="#15548b"
          onPress={() => handleAskForLocation()}
        />
        <Text
          style={{
            ...styles.checkBoxTxt,
            color: notaryTakeLocation ? "#15548b" : "gray",
            fontWeight: notaryTakeLocation ? "bold" : "normal",
          }}
        >
          Store Location
        </Text>
      </View>
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
