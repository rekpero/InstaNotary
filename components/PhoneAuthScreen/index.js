import * as React from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Image,
  ActivityIndicator,
} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import { firebaseConfig, countryCodes } from "../../constants";
import styles from "./style";
import { AuthContext } from "../../hooks";
import RNPickerSelect from "react-native-picker-select";
import { notifyMessage } from "../../utils";
import {
  MAGIC_NUMBER,
  MAGIC_NUMBER_COUNTRY_CODE,
  MAGIC_NUMBER_AUTH,
} from "../../config";

console.disableYellowBox = true;

// import RNOtpVerify from "react-native-otp-verify";
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const PhoneAuthScreen = ({ navigation }) => {
  const { authContext } = React.useContext(AuthContext);
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [phoneAuthState, setPhoneAuthState] = React.useState("phone");
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const [sendVerificationLoading, setSendVerificationLoading] = React.useState(
    false
  );
  const [verifyLoading, setVerifyLoading] = React.useState(false);
  const [countryCode, setCountryCode] = React.useState("+1");
  const firebaseConfig = firebase.apps.length
    ? firebase.app().options
    : undefined;

  // send the verification code
  const sendVerification = async () => {
    setSendVerificationLoading(true);
    if (MAGIC_NUMBER_AUTH) {
      if (
        MAGIC_NUMBER_COUNTRY_CODE === countryCode &&
        MAGIC_NUMBER === phoneNumber
      ) {
        try {
          await AsyncStorage.setItem("mobileNumber", countryCode + phoneNumber);
          authContext.signIn(countryCode + phoneNumber);
          navigation.navigate("Home", {
            loadNotaryItems: true,
          });
        } catch (error) {
          // Error saving data
          console.log(error.message);
        }
      } else {
        handleSetVerification();
      }
    } else {
      handleSetVerification();
    }
    setSendVerificationLoading(false);
  };

  const handleSetVerification = async () => {
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        countryCode + phoneNumber,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      setPhoneAuthState("verification");
    } catch (err) {
      notifyMessage(`Error: ${err.message}`);
    }
  };

  // confirmation of verification code
  const confirmVerification = async () => {
    setVerifyLoading(true);
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await firebase.auth().signInWithCredential(credential);
      try {
        await AsyncStorage.setItem("mobileNumber", countryCode + phoneNumber);
        authContext.signIn(countryCode + phoneNumber);
        navigation.navigate("Home", {
          loadNotaryItems: true,
        });
      } catch (error) {
        // Error saving data
        console.log(error.message);
      }
    } catch (err) {
      notifyMessage(`Error: ${err.message}`);
    }
    setVerifyLoading(false);
  };

  // get all the country code
  const getCountryCodes = () => {
    return countryCodes.map((countryCode, i) => ({
      label: countryCode.name + " - " + countryCode.code,
      value: countryCode.code,
      key: countryCode.code,
    }));
  };

  return (
    <View style={styles.homeContainer}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        title="Prove you are human!"
        cancelLabel="Close"
      />
      {phoneAuthState === "phone" && (
        <View style={styles.phoneNumberInputContainer}>
          <Image
            style={styles.welcomeIcon}
            source={{
              uri: `https://bluzelle.com/assets/img/Bluzelle%20-%20Screen%20-%20Logo%20-%20Big%20-%20Blue.png`,
            }}
          />
          <View style={styles.enterPhoneNumberTextContainer}>
            <Text style={styles.enterPhoneNumberText}>Enter phone number</Text>
          </View>
          <View style={styles.phoneNumberContainer}>
            <RNPickerSelect
              value={countryCode}
              hideIcon={true}
              style={{
                inputIOS: {
                  fontSize: 15,
                  paddingHorizontal: 4,
                  paddingRight: 4, // to ensure the text is never behind the icon
                  maxWidth: 150,
                },
                inputAndroid: {
                  fontSize: 15,
                  paddingRight: 36, // to ensure the text is never behind the icon
                  maxWidth: 150,
                },
              }}
              onValueChange={(value) => setCountryCode(value)}
              itemKey={countryCode}
              useNativeAndroidPickerStyle={false}
              items={getCountryCodes()}
            />
            <TextInput
              style={styles.phoneNumberInput}
              placeholder="999 999 9999"
              autoFocus
              autocompleteType="tel"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              returnKeyType="done"
              autoCorrect={false}
              onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
            />
          </View>
          <View style={styles.sendVerificationButtonContainer}>
            <TouchableOpacity
              style={styles.sendVerificationButton}
              onPress={sendVerification}
            >
              {!sendVerificationLoading ? (
                <Text style={styles.sendVerificationText}>Next</Text>
              ) : (
                <ActivityIndicator size="small" color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
      {phoneAuthState === "verification" && (
        <View style={styles.phoneNumberInputContainer}>
          <Image
            style={styles.welcomeIcon}
            source={{
              uri: `https://bluzelle.com/assets/img/Bluzelle%20-%20Screen%20-%20Logo%20-%20Big%20-%20Blue.png`,
            }}
          />
          <View style={styles.enterPhoneNumberTextContainer}>
            <Text style={styles.enterPhoneNumberText}>
              Enter Verification code
            </Text>
          </View>
          <TextInput
            style={styles.verificationInput}
            editable={!!verificationId}
            placeholder="123456"
            autoFocus
            autocompletetype="tel"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            returnKeyType="done"
            autoCorrect={false}
            onChangeText={setVerificationCode}
          />
          <View style={styles.sendVerificationButtonContainer}>
            <TouchableOpacity
              style={styles.sendVerificationButton}
              onPress={confirmVerification}
            >
              {!verifyLoading ? (
                <Text style={styles.sendVerificationText}>Confirm</Text>
              ) : (
                <ActivityIndicator size="small" color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default PhoneAuthScreen;
