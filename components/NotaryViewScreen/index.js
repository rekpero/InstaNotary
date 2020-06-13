import * as React from "react";
import { WebView } from "react-native-webview";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Animated,
  Linking,
} from "react-native";

import moment from "moment";
import styles from "./styles";

console.disableYellowBox = true;

export default function NotaryViewScreen({ route, navigation }) {
  const { notary } = route.params;
  const [isHidden, setIsHidden] = React.useState(true);
  const [bounceValue, setBounceValue] = React.useState(new Animated.Value(320));
  const [downloadFile, setDownloadFile] = React.useState(false);

  const goBack = () => {
    navigation.goBack();
  };

  // check gview viewable extensions
  const checkGViewSupportedExt = (pType) => {
    if (pType === "pdf" || pType === "doc" || pType === "docx") {
      return true;
    }
    return false;
  };

  // open file in browser
  const handleOpenFile = async () => {
    const url = `${
      checkGViewSupportedExt(notary.type) && !downloadFile
        ? "http://docs.google.com/gview?embedded=true&url="
        : ""
    }https://ipfs.io/ipfs/${notary.hash}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  // check viewable extensions
  const previewAbleExt = (pType) => {
    if (
      pType === "jpg" ||
      pType === "jpeg" ||
      pType === "png" ||
      pType === "gif" ||
      pType === "tiff" ||
      pType === "text" ||
      pType === "pdf" ||
      pType === "doc" ||
      pType === "docx" ||
      pType === "mp4" ||
      pType === "3g2" ||
      pType === "3gp" ||
      pType === "avi" ||
      pType === "m4v" ||
      pType === "mkv" ||
      pType === "mov" ||
      pType === "mpg" ||
      pType === "mpeg" ||
      pType === "wmv" ||
      pType === "vcf"
    ) {
      return true;
    }
    return false;
  };

  // toggle subview
  const _toggleSubView = () => {
    var toValue = 320;

    if (isHidden) {
      toValue = 0;
    }
    Animated.spring(bounceValue, {
      toValue: toValue,
      velocity: 3,
      tension: 2,
      friction: 8,
    }).start();

    setIsHidden(!isHidden);
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
        <View style={styles.toolbarTitle}>
          <Text style={styles.title}>Notary Details</Text>
          <Text style={styles.subtitle}>{notary.hash}</Text>
        </View>
        <View style={styles.toolbarAction}>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => {
              _toggleSubView();
            }}
          >
            <Image
              source={require("../../assets/system-icons/info.png")}
              style={styles.toolbarIcons}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleOpenFile}
          >
            <Image
              source={require("../../assets/system-icons/globe.png")}
              style={styles.toolbarIcons}
            ></Image>
          </TouchableOpacity>
        </View>
      </View>
      {previewAbleExt(notary.type) || downloadFile ? (
        <WebView
          source={{
            uri: `${
              checkGViewSupportedExt(notary.type) && !downloadFile
                ? "http://docs.google.com/gview?embedded=true&url="
                : ""
            }https://ipfs.io/ipfs/${notary.hash}`,
          }}
          style={styles.webview}
          scalesPageToFit={
            Platform.OS === "ios" || notary.type === "text" ? false : true
          }
        />
      ) : (
        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/fileback1.png")}
            style={styles.fileIcon}
          ></Image>
          <Text style={styles.title}>No preview available</Text>
          <Text style={styles.noPreviewText}>
            Please click on download button on the toolbar to open the item in
            browser
          </Text>
        </View>
      )}

      {!isHidden && (
        <TouchableWithoutFeedback onPress={(e) => _toggleSubView()}>
          <View style={styles.backdrop}></View>
        </TouchableWithoutFeedback>
      )}
      <Animated.View
        style={[styles.subView, { transform: [{ translateY: bounceValue }] }]}
      >
        <View style={styles.subViewHeaderContainer}>
          <Text style={styles.subViewTitle}>Notary Detail Info.</Text>
          <TouchableWithoutFeedback onPress={_toggleSubView}>
            <Image
              source={require("../../assets/system-icons/close.png")}
              style={styles.closeIcon}
            ></Image>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.subViewDetailContainer}>
          <View style={styles.subViewDetailItems}>
            <Text style={styles.detailTitle}>Name: </Text>
            <Text style={styles.detailText}>{notary.name}</Text>
          </View>
          <View style={styles.subViewDetailItems}>
            <Text style={styles.detailTitle}>Description: </Text>
            <Text style={styles.detailText}>{notary.description}</Text>
          </View>
          <View style={styles.subViewDetailItems}>
            <Text style={styles.detailTitle}>Hash: </Text>
            <Text style={styles.detailText}>{notary.hash}</Text>
          </View>
          <View style={styles.subViewDetailItems}>
            <Text style={styles.detailTitle}>IPFS Link: </Text>
            <Text style={styles.detailText}>
              https://ipfs.io/ipfs/{notary.hash}
            </Text>
          </View>
          <View style={styles.subViewDetailItems}>
            <Text style={styles.detailTitle}>Created On: </Text>
            <Text style={styles.detailText}>
              {moment(notary.time).format("LLLL")}
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
