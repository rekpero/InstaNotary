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
  Clipboard,
  Platform,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { notifyMessage } from "../../utils";
import { appIcon } from "../../constants";
import moment from "moment";
import styles from "./styles";

console.disableYellowBox = true;

export default function NotaryViewScreen({ route, navigation }) {
  const { notary } = route.params;
  const [isHidden, setIsHidden] = React.useState(true);
  const [bounceValue, setBounceValue] = React.useState(new Animated.Value(360));
  const [downloadFile, setDownloadFile] = React.useState(false);
  const [modalType, setModalType] = React.useState("");
  const appIconBase64 = appIcon;

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

  const handleCopyToClipboard = async () => {
    console.log("Entering ");
    await Clipboard.setString(notary.hash);
    notifyMessage("Hash Copied to Clipboard!");
  };

  // toggle subview
  const _toggleSubView = (pMenu) => {
    if (pMenu) {
      setModalType(pMenu);
      var toValue = 360;
      toValue = 0;

      Animated.spring(bounceValue, {
        toValue: toValue,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();

      setIsHidden(false);
    } else {
      var toValue = 360;

      Animated.spring(bounceValue, {
        toValue: toValue,
        velocity: 3,
        tension: 2,
        friction: 8,
      }).start();

      setIsHidden(true);
    }
  };

  const openMapLocation = () => {
    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${notary.region.latitude},${notary.region.longitude}`;
    const label = "Notary stored here";
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url);
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
              _toggleSubView("notaryQrCode");
            }}
          >
            <Image
              source={require("../../assets/system-icons/qrcode.png")}
              style={styles.toolbarIcons}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={() => {
              _toggleSubView("notaryInfo");
            }}
          >
            <Image
              source={require("../../assets/system-icons/info.png")}
              style={styles.toolbarIcons}
            ></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOpenFile}>
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
        <TouchableWithoutFeedback onPress={(e) => _toggleSubView("")}>
          <View style={styles.backdrop}></View>
        </TouchableWithoutFeedback>
      )}
      <Animated.View
        style={[styles.subView, { transform: [{ translateY: bounceValue }] }]}
      >
        <View style={styles.subViewHeaderContainer}>
          {modalType === "notaryInfo" ? (
            <Text style={styles.subViewTitle}>Notary Detail Info.</Text>
          ) : null}
          {modalType === "notaryQrCode" ? (
            <Text style={styles.subViewTitle}>Notary QR Code</Text>
          ) : null}
          <TouchableWithoutFeedback onPress={(e) => _toggleSubView("")}>
            <Image
              source={require("../../assets/system-icons/close.png")}
              style={styles.closeIcon}
            ></Image>
          </TouchableWithoutFeedback>
        </View>
        {modalType === "notaryInfo" ? (
          <View style={styles.subViewDetailContainer}>
            <View style={styles.subViewDetailItems}>
              <Text style={styles.detailTitle}>Name: </Text>
              <Text style={styles.detailText}>{notary.name}</Text>
            </View>
            <View style={styles.subViewDetailItems}>
              <Text style={styles.detailTitle}>Description: </Text>
              <Text style={styles.detailText}>{notary.description}</Text>
            </View>
            <TouchableOpacity
              style={styles.subViewDetailItems}
              onPress={handleCopyToClipboard}
            >
              <Text style={styles.detailTitle}>Hash: </Text>
              <Text style={styles.detailText}>{notary.hash}</Text>
              <TouchableOpacity onPress={handleCopyToClipboard}>
                <Image
                  source={require("../../assets/system-icons/copy.png")}
                  style={[styles.systemIcon, styles.infoButtonIcon]}
                ></Image>
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.subViewDetailItems}
              onPress={handleOpenFile}
            >
              <Text style={styles.detailTitle}>IPFS Link: </Text>
              <Text style={styles.detailText}>
                https://ipfs.io/ipfs/{notary.hash}
              </Text>
              <TouchableOpacity onPress={handleOpenFile}>
                <Image
                  source={require("../../assets/system-icons/ext-link.png")}
                  style={[styles.systemIcon, styles.infoButtonIcon]}
                ></Image>
              </TouchableOpacity>
            </TouchableOpacity>
            {notary.region && (
              <TouchableOpacity
                style={styles.subViewDetailItems}
                onPress={openMapLocation}
              >
                <Text style={styles.detailTitle}>Location: </Text>
                <Text style={styles.detailText}>
                  Lat: {Number.parseFloat(notary.region.latitude).toFixed(2)}
                  {"    "}Long:{" "}
                  {Number.parseFloat(notary.region.longitude).toFixed(2)}
                </Text>
                <TouchableOpacity onPress={openMapLocation}>
                  <Image
                    source={require("../../assets/system-icons/map.png")}
                    style={[styles.systemIcon, styles.infoButtonIcon]}
                  ></Image>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            <View style={styles.subViewDetailItems}>
              <Text style={styles.detailTitle}>Created On: </Text>
              <Text style={styles.detailText}>
                {moment(notary.time).format("dddd, MMMM DD, YYYY HH:mm z") +
                  " " +
                  notary.timeZone}
              </Text>
            </View>
          </View>
        ) : null}
        {modalType === "notaryQrCode" ? (
          <View style={styles.subViewDetailContainer}>
            <Text style={styles.qrCodeText}>
              Scan this QR Code to get the IPFS Link
            </Text>
            <View style={styles.qrCodeContainer}>
              <QRCode
                value={`https://ipfs.io/ipfs/${notary.hash}`}
                logo={{ uri: appIconBase64 }}
                logoSize={81}
                logoBackgroundColor="transparent"
                size={200}
              />
            </View>
          </View>
        ) : null}
      </Animated.View>
    </View>
  );
}
