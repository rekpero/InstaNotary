import { ToastAndroid, Alert } from "react-native";
import moment from "moment";

console.disableYellowBox = true;

export const notifyMessage = (msg) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert(msg, "", [], { cancelable: true });
  }
};

export const sortNotaries = (allNotaries, type, order) => {
  if (type === "name") {
    return allNotaries.sort((a, b) => {
      if (order) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
      } else {
        if (a.name < b.name) {
          return 1;
        }
        if (a.name > b.name) {
          return -1;
        }
      }
      return 0;
    });
  } else {
    return allNotaries.sort((a, b) => {
      if (order) {
        return moment(b.time).diff(moment(a.time));
      } else {
        return moment(a.time).diff(moment(b.time));
      }
    });
  }
};
