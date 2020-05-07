import * as React from "react";
import { Button, Image, View, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import styles from "./styles";

export default class LoginScreen extends React.Component {
  state = {
    image: null,
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

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: true,
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  render() {
    let { image } = this.state;

    return (
      <View style={styles.homeContainer}>
        <View style={styles.toolbarContainer}>
          <Text>Hii</Text>
          <Button title="Add Files" onPress={this._pickImage} />
        </View>

        {/* {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )} */}
      </View>
    );
  }
}
