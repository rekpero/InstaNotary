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
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";

import moment from "moment";
import styles from "./styles";

console.disableYellowBox = true;

export default function NotaryViewScreen({ route, navigation }) {
  const { notary } = route.params;
  const [isHidden, setIsHidden] = React.useState(true);
  const [bounceValue, setBounceValue] = React.useState(new Animated.Value(280));
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
    var toValue = 280;

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
          <FontAwesome5 name="arrow-left" size={20} color="black" />
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
            <FontAwesome5 name="info-circle" size={24} color="#15548b" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={handleOpenFile}
          >
            <Ionicons name="md-cloud-download" size={32} color="#15548b" />
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
            <Ionicons name="ios-close" size={28} color="rgba(0, 0, 0, 0.5)" />
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
