import * as React from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  AsyncStorage,
  Image,
} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import { firebaseConfig } from "../../constants";
import styles from "./style";
import { AuthContext } from "../../hooks";
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();

const PhoneAuthScreen = ({ navigation }) => {
  const { authContext } = React.useContext(AuthContext);
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [phoneAuthState, setPhoneAuthState] = React.useState("phone");
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const firebaseConfig = firebase.apps.length
    ? firebase.app().options
    : undefined;
  const [message, showMessage] = React.useState(
    !firebaseConfig || Platform.OS === "web"
      ? {
          text:
            "To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.",
        }
      : undefined
  );

  const sendVerification = async () => {
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      setPhoneAuthState("verification");
    } catch (err) {
      showMessage({ text: `Error: ${err.message}`, color: "red" });
    }
  };

  const confirmVerification = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      await firebase.auth().signInWithCredential(credential);
      try {
        await AsyncStorage.setItem("mobileNumber", phoneNumber);
        authContext.signIn(phoneNumber);
        navigation.navigate("Home", {
          loadNotaryItems: true,
        });
      } catch (error) {
        // Error saving data
      }
    } catch (err) {
      showMessage({ text: `Error: ${err.message}`, color: "red" });
    }
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
          <TextInput
            style={styles.phoneNumberInput}
            placeholder="+1 999 999 9999"
            autoFocus
            autocompletetype="tel"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
          />
          <View style={styles.sendVerificationButtonContainer}>
            <TouchableOpacity
              style={styles.sendVerificationButton}
              onPress={sendVerification}
            >
              <Text style={styles.sendVerificationText}>Next</Text>
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
            style={styles.phoneNumberInput}
            editable={!!verificationId}
            placeholder="123456"
            autoFocus
            autocompletetype="tel"
            keyboardType="phone-pad"
            textContentType="telephoneNumber"
            onChangeText={setVerificationCode}
          />
          <View style={styles.sendVerificationButtonContainer}>
            <TouchableOpacity
              style={styles.sendVerificationButton}
              onPress={confirmVerification}
            >
              <Text style={styles.sendVerificationText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default PhoneAuthScreen;
