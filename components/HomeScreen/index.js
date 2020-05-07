import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import Constants from "expo-constants";
import { decode } from "base64-arraybuffer";
import * as Permissions from "expo-permissions";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { uploadFileToServer } from "../../services";

export default class HomeScreen extends React.Component {
  state = {
    image: null,
    bounceValue: new Animated.Value(136),
    isHidden: true,
    ipfsHash: "",
  };

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      let { status1 } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      let { status2 } = await Permissions.askAsync(Permissions.CAMERA);
      if (status1 !== "granted" && status2 !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    alert(result.uri);
    console.log(result);
  };

  _pickImageFromCamera = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
        storageOptions: {
          skipBackup: true,
        },
      });
      if (!result.cancelled) {
        uploadFileToServer(result);
      }
    } catch (err) {
      console.log(err);
    }
    this._toggleSubView();
  };

  _pickImageFromSystem = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
      });
      if (!result.cancelled) {
        const ipfsHash = await uploadFileToServer(result);
        console.log(ipfsHash);
        this.setState({ ipfsHash });
      }
    } catch (err) {
      console.log(err);
    }
    this._toggleSubView();
  };

  _toggleSubView = () => {
    const { isHidden } = this.state;
    var toValue = 136;

    if (isHidden) {
      toValue = 0;
    }
    Animated.spring(this.state.bounceValue, {
      toValue: toValue,
      velocity: 3,
      tension: 2,
      friction: 8,
    }).start();

    this.setState({ isHidden: !isHidden });
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    let { isHidden, ipfsHash } = this.state;
    console.log(`https://ipfs.io/ipfs/${ipfsHash}`);
    return (
      <View style={styles.homeContainer}>
        <View style={styles.toolbarContainer}>
          <Text style={styles.title}>Notary</Text>
          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="ios-power" size={18} color="white" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Image
            style={{ width: 200, height: 200 }}
            source={{ uri: `https://ipfs.io/ipfs/${ipfsHash}` }}
          />
        </View>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => {
            this._toggleSubView();
          }}
        >
          <Ionicons name="ios-add" size={32} color="white" />
        </TouchableOpacity>

        {!isHidden && (
          <TouchableWithoutFeedback onPress={(e) => this._toggleSubView()}>
            <View style={styles.backdrop}></View>
          </TouchableWithoutFeedback>
        )}

        <Animated.View
          style={[
            styles.subView,
            { transform: [{ translateY: this.state.bounceValue }] },
          ]}
        >
          <View style={styles.subViewHeaderContainer}>
            <Text style={styles.subViewTitle}>Import from</Text>
            <TouchableWithoutFeedback onPress={this._toggleSubView}>
              <Ionicons name="ios-close" size={28} color="rgba(0, 0, 0, 0.5)" />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.subViewButtonContainer}>
            <TouchableOpacity
              style={[styles.importButton, styles.marginSet]}
              onPress={this._pickImageFromCamera}
            >
              <Ionicons name="ios-camera" size={18} color="white" />
              <Text style={styles.importText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.importButton}
              onPress={this._pickDocument}
            >
              <Ionicons name="ios-document" size={18} color="white" />
              <Text style={styles.importText}>Files</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
        {/* {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )} */}
      </View>
    );
  }
}
