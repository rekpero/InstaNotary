import { ToastAndroid, Alert } from "react-native";
import { ROOT_URL } from "../config";
class Webservice {
  notifyMessage = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg, "", [], { cancelable: true });
    }
  };
  uploadFileToServer = async (file, fileDetails) => {
    const data = new FormData();

    let uriParts = file.uri.split(".");
    let fileType = uriParts[uriParts.length - 1];

    data.append("fileData", {
      uri: file.uri,
      name: `photo.${fileType}`,
      type: `${file.type}/${fileType}`,
    });
    const finalFileDetails = { ...fileDetails, type: fileType };
    data.append("fileDetails", JSON.stringify(finalFileDetails));
    const config = {
      method: "POST",
      headers: {
        Accept: "multipart/form-data",
      },
      body: data,
    };
    return fetch(`${ROOT_URL}/uploadNotary/file`, config)
      .then((res) => res.json())
      .catch((err) => {
        console.log("Error", err);
        this.notifyMessage(err.message);
      });
  };

  uploadTextToServer = async (textDetails) => {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(textDetails),
    };
    return fetch(`${ROOT_URL}/uploadNotary/text`, config)
      .then((res) => res.json())
      .catch((err) => {
        console.log("Error", err);
      });
  };

  getNotaryItemsByNumber = async (phoneNumber) => {
    return fetch(`${ROOT_URL}/notary/phone/` + phoneNumber)
      .then((res) => res.json())
      .catch((err) => {
        console.log("Error", err);
      });
  };

  deleteNotaryItems = async (phoneNumber, id) => {
    const config = {
      method: "DELETE",
    };
    return fetch(`${ROOT_URL}/notary/phone/${phoneNumber}/${id}`, config)
      .then((res) => res.json())
      .catch((err) => {
        console.log("Error", err);
      });
  };
}

export default new Webservice();
