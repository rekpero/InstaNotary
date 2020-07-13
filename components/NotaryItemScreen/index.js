import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  ActivityIndicator,
  Image,
  Animated,
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
  const [modalType, setModalType] = React.useState("");
  const [isHidden, setIsHidden] = React.useState(true);
  const [bounceValue, setBounceValue] = React.useState(new Animated.Value(200));

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
  const [progressPercent, setProgressPercent] = React.useState(0);
  const [overrideNotaryId, setOverrideNotaryId] = React.useState(0);
  const [overrideNotary, setOverrideNotary] = React.useState();

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
    if (fileType !== "text") {
      _toggleSubView("uploadNotary");
    }
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
        if (res.isFilePresent) {
          console.log("Present notary");
          setOverrideNotaryId(res.notaryId);
          setOverrideNotary({
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
          _toggleSubView("overrideConfirm");
        } else {
          authContext.fetchNotaryItem(state.userMobileNumber);
          setTimeout(async () => {
            navigation.navigate("Home");
          }, 2000);
        }
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
            region: notaryTakeLocation ? region : null,
            timeZone: timeZoneAbbr,
            time: moment().format(),
          },
          (progressEvent) => {
            const { loaded, total } = progressEvent;
            let percent = Math.floor((loaded / total) * 100);
            setProgressPercent(percent);
            console.log(`${loaded}kb of ${total}kb | ${percent}%`);
          },
          (res) => {
            console.log(res);
            _toggleSubView("");
            notifyMessage(res.message);
            if (res.isFilePresent) {
              console.log("Present notary");
              setOverrideNotaryId(res.notaryId);
              setOverrideNotary({
                name: notaryName,
                description: notaryDescription,
                type: fileName.split(".")[fileName.split(".").length - 1],
                fileName,
                phoneNumber: state.userMobileNumber,
                isLocationEnabled: notaryTakeLocation,
                region: notaryTakeLocation ? region : null,
                timeZone: timeZoneAbbr,
                time: moment().format(),
              });
              _toggleSubView("overrideConfirm");
            } else {
              authContext.fetchNotaryItem(state.userMobileNumber);
              setTimeout(async () => {
                navigation.navigate("Home");
              }, 2000);
            }
          }
        );
      }
    } catch (err) {
      notifyMessage(err.message);
    }
    setLoading(false);
  };

  // toggle subview
  const _toggleSubView = (pMenu) => {
    if (pMenu) {
      setModalType(pMenu);
      var toValue = 200;
      toValue = 0;

      Animated.spring(bounceValue, {
        toValue: toValue,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();

      setIsHidden(false);
    } else {
      var toValue = 200;

      Animated.spring(bounceValue, {
        toValue: toValue,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();

      setIsHidden(true);
    }
  };

  const updateNotary = async () => {
    setProgressPercent(100);
    setModalType("uploadNotary");
    console.log(overrideNotaryId, overrideNotary);
    const res = await WebService.overrideNotary(
      overrideNotaryId,
      overrideNotary
    );
    console.log(res);
    _toggleSubView("");
    notifyMessage(res.message);
    authContext.fetchNotaryItem(state.userMobileNumber);
    setTimeout(async () => {
      navigation.navigate("Home");
    }, 2000);
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

      {!isHidden && (
        <TouchableWithoutFeedback onPress={(e) => _toggleSubView("")}>
          <View style={styles.backdrop}></View>
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        style={[styles.subView, { transform: [{ translateY: bounceValue }] }]}
      >
        <View style={styles.subViewHeaderContainer}>
          {modalType === "uploadNotary" ? (
            <Text style={styles.subViewTitle}>Uploading File</Text>
          ) : null}
          {modalType === "overrideConfirm" ? (
            <Text style={styles.subViewTitle}>Updated Notary</Text>
          ) : null}
          <TouchableWithoutFeedback onPress={(e) => _toggleSubView("")}>
            <Image
              source={require("../../assets/system-icons/close.png")}
              style={styles.closeIcon}
            ></Image>
          </TouchableWithoutFeedback>
        </View>
        {modalType === "uploadNotary" ? (
          <View style={styles.subViewDetailContainer}>
            {progressPercent < 100 ? (
              <>
                <View style={styles.progressTextContainer}>
                  <Text style={styles.progressText}>
                    {`${progressPercent}%`} Uploaded
                  </Text>
                </View>
                <View
                  style={[styles.progressBar, { width: `${progressPercent}%` }]}
                ></View>
              </>
            ) : (
              <View style={styles.subViewButtonContainer}>
                <ActivityIndicator size="small" color="#15548b" />
                <Text style={{ marginLeft: 12, fontSize: 16 }}>
                  Processing your notary, wait few sec...
                </Text>
              </View>
            )}
          </View>
        ) : null}
        {modalType === "overrideConfirm" ? (
          <View style={styles.subViewDetailContainer}>
            <Text style={styles.progressText}>
              You already have a notary of this file. Do you want to override
              notary #{overrideNotaryId}
            </Text>
            <View style={styles.subViewButtonContainer}>
              <TouchableOpacity
                style={[styles.cancelButton, styles.marginSet]}
                onPress={(e) => _toggleSubView("")}
              >
                <Text style={styles.importText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={(e) => updateNotary()}
              >
                <Text style={styles.importText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}
