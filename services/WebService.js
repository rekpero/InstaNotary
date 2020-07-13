import { ToastAndroid, Alert } from "react-native";
import { ROOT_URL } from "../config";
import axios from "axios";
class Webservice {
  notifyMessage = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg, "", [], { cancelable: true });
    }
  };
  uploadFileToServer = async (
    file,
    fileDetails,
    onProgressCallback,
    onCompleteCallback
  ) => {
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
      headers: {
        Accept: "multipart/form-data",
      },
      onUploadProgress: onProgressCallback,
    };
    await axios
      .post(`${ROOT_URL}/uploadNotary/file`, data, config)
      .then((res) => {
        console.log("Response", res.data);
        onCompleteCallback(res.data);
      })
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

  overrideNotary = async (notaryId, notaryDetails) => {
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notaryDetails),
    };
    return fetch(`${ROOT_URL}/updateNotary/${notaryId}`, config)
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

  getAppConfig = async () => {
    return fetch(`${ROOT_URL}/appConfigs`)
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
