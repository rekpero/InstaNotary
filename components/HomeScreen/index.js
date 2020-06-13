import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  FlatList,
  TextInput,
  AsyncStorage,
  Image,
  ToastAndroid,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import styles from "./styles";
import { WebService } from "../../services";
import { AuthContext } from "../../hooks";
import { sortNotaries } from "../../utils";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";

import moment from "moment";

console.disableYellowBox = true;

export default class HomeScreen extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);

    this.state = {
      bounceValue: new Animated.Value(210),
      isHidden: true,
      searchText: "",
    };
  }

  _menu = null;

  setMenuRef = (ref) => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };

  componentDidMount() {
    const { state, authContext } = this.context;
    this.getPermissionAsync();
    authContext.fetchNotaryItem(state.userMobileNumber);
  }

  // sort notary
  handleSortNotaries = (type) => {
    const { authContext, state } = this.context;

    const finalNotaries = sortNotaries(state.allNotaries, type);

    authContext.setAllNotaries(finalNotaries);
    this.hideMenu();
  };

  // get all the permissions
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      let permission1 = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      let permission2 = await Permissions.askAsync(Permissions.CAMERA);
      if (
        permission1.status !== "granted" &&
        permission2.status !== "granted"
      ) {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  // get the document files
  _pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      if (result.type === "success") {
        this._toggleSubView();

        this.props.navigation.navigate("NotaryDetail", {
          file: result,
          fileType: "file",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // get image from the camera
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
        this._toggleSubView();

        this.props.navigation.navigate("NotaryDetail", {
          file: result,
          fileType: "image",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // get image from the gallery
  _pickImageFromSystem = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
      });
      if (!result.cancelled) {
        this._toggleSubView();
        this.props.navigation.navigate("NotaryDetail", {
          file: result,
          fileType: "image",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // send to add text view
  _addText = () => {
    this._toggleSubView();
    this.props.navigation.navigate("NotaryDetail", {
      fileType: "text",
    });
  };

  // toggle the bottom subView
  _toggleSubView = () => {
    const { isHidden } = this.state;
    var toValue = 210;

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

  logout = async () => {
    try {
      await AsyncStorage.removeItem("mobileNumber");
      const { authContext } = this.context;
      authContext.signOut();
    } catch (error) {
      console.log(error);
      // Error saving data
    }
  };

  // get icons for extensions
  getIconForFile = (ext) => {
    switch (ext) {
      case "jpg":
        return (
          <Image
            source={require("../../assets/image.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "jpeg":
        return (
          <Image
            source={require("../../assets/image.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "png":
        return (
          <Image
            source={require("../../assets/image.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "gif":
        return (
          <Image
            source={require("../../assets/image.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "tiff":
        return (
          <Image
            source={require("../../assets/image.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "zip":
        return (
          <Image
            source={require("../../assets/zip.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "pdf":
        return (
          <Image
            source={require("../../assets/pdf.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "xls":
        return (
          <Image
            source={require("../../assets/xls.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "xlsx":
        return (
          <Image
            source={require("../../assets/xls.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "txt":
        return (
          <Image
            source={require("../../assets/txt.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "rtf":
        return (
          <Image
            source={require("../../assets/rtf.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "rar":
        return (
          <Image
            source={require("../../assets/rar.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "ppt":
        return (
          <Image
            source={require("../../assets/ppt.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "pps":
        return (
          <Image
            source={require("../../assets/pps.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "doc":
        return (
          <Image
            source={require("../../assets/doc.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "docx":
        return (
          <Image
            source={require("../../assets/doc.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "text":
        return (
          <Image
            source={require("../../assets/text.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "file":
        return (
          <Image
            source={require("../../assets/file.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "mp4":
        return (
          <Image
            source={require("../../assets/video.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "mpeg":
        return (
          <Image
            source={require("../../assets/video.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "mpg":
        return (
          <Image
            source={require("../../assets/video.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "mov":
        return (
          <Image
            source={require("../../assets/video.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "mkv":
        return (
          <Image
            source={require("../../assets/video.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "m4v":
        return (
          <Image
            source={require("../../assets/video.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "avi":
        return (
          <Image
            source={require("../../assets/video.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "3gp":
        return (
          <Image
            source={require("../../assets/video.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "3g2":
        return (
          <Image
            source={require("../../assets/video.png")}
            style={styles.fileIcon}
          ></Image>
        );
      case "wmv":
        return (
          <Image
            source={require("../../assets/video.png")}
            style={styles.fileIcon}
          ></Image>
        );
      default:
        return (
          <Image
            source={require("../../assets/file.png")}
            style={styles.fileIcon}
          ></Image>
        );
    }
  };

  // show toaster notification
  notifyMessage = (msg) => {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg, "", [], { cancelable: true });
    }
  };

  // delete notary files
  deleteNotary = async (item) => {
    console.log(item);
    const res = await WebService.deleteNotaryItems(item.phoneNumber, item.id);
    this.notifyMessage(res.message);
    const { state, authContext } = this.context;
    authContext.fetchNotaryItem(state.userMobileNumber);
  };

  // refresh notary file list
  refreshList = () => {
    const { state, authContext } = this.context;
    authContext.fetchNotaryItem(state.userMobileNumber);
  };

  // filter notary file list for search
  filterNotaryList = (search) => {
    const { authContext, state } = this.context;

    const filteredNotaryList = state.backupNotaries.filter(
      (notary) => notary.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
    );
    this.setState({ searchText: search }, () => {
      authContext.setAllNotaries(filteredNotaryList);
    });
  };

  // open view screen for notary item
  viewNotary = (item) => {
    this.setState({ isMailLoaded: false });
    this.props.navigation.navigate("NotaryView", {
      notary: item,
    });
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
    let { isHidden } = this.state;
    const { state } = this.context;
    return (
      <View style={styles.homeContainer}>
        <View style={styles.toolbarContainer}>
          <Image
            source={{
              uri: `https://cdn.discordapp.com/attachments/698447732028735528/712240046144749641/Bluzelle_-_Screen_-_Symbol_-_Big_-_Blue.png`,
            }}
            style={styles.sponsorIcon}
          ></Image>
          <Text style={styles.title}>InstaNotary.</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={this.logout}>
            <Image
              source={require("../../assets/system-icons/off.png")}
              style={styles.systemIcon}
            ></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchSection}>
            <Image
              source={require("../../assets/system-icons/search.png")}
              style={styles.systemIcon}
            ></Image>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              returnKeyType="search"
              autoCorrect={false}
              onChangeText={(search) => this.filterNotaryList(search)}
            />
          </View>
          <Menu
            ref={this.setMenuRef}
            button={
              <TouchableOpacity
                style={styles.sortButton}
                onPress={this.showMenu}
              >
                <Image
                  source={require("../../assets/system-icons/sorting.png")}
                  style={styles.systemIcon}
                ></Image>
              </TouchableOpacity>
            }
          >
            <MenuItem onPress={(e) => this.handleSortNotaries("date")}>
              Sort By Date
            </MenuItem>
            <MenuDivider />
            <MenuItem onPress={(e) => this.handleSortNotaries("name")}>
              Sort By Name
            </MenuItem>
          </Menu>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={this.refreshList}
          >
            <Image
              source={require("../../assets/system-icons/refresh.png")}
              style={styles.systemIcon}
            ></Image>
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          {state.allNotaries.length ? (
            <FlatList
              data={state.allNotaries}
              onRefresh={() => this.refreshList()}
              refreshing={state.isFetching}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={styles.notaryItemContainer}
                    index={index}
                    onPress={(e) => this.viewNotary(item)}
                  >
                    <View style={styles.notaryItemType}>
                      {this.getIconForFile(item.type)}
                    </View>
                    <View style={styles.notaryItemDetails}>
                      <View style={styles.notaryItemDetailsHeader}>
                        <Text
                          style={styles.notaryItemDetailsHeaderTitle}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.name}
                        </Text>
                        <Text style={styles.notaryItemDetailsHeaderTime}>
                          {moment(item.time).fromNow()}
                        </Text>
                        <TouchableOpacity
                          onPress={(e) => this.deleteNotary(item)}
                        >
                          <Text style={styles.notaryItemDetailsHeaderDelete}>
                            <Image
                              source={require("../../assets/system-icons/trash.png")}
                              style={styles.trashIcon}
                            ></Image>
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={styles.notaryItemDetailsDescriptionContainer}
                      >
                        <Text
                          numberOfLines={1}
                          style={styles.notaryItemDetailsHash}
                        >
                          {item.hash}
                        </Text>
                      </View>
                      <View
                        style={styles.notaryItemDetailsDescriptionContainer}
                      >
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={styles.notaryItemDetailsDescription}
                        >
                          {item.description}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View style={styles.emptyImageContainer}>
              <Image
                source={require("../../assets/empty.png")}
                style={styles.emptyIcon}
              ></Image>
              <Text style={styles.emptyTitle}>You have no Notaries</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.fabButton}
          onPress={() => {
            this._toggleSubView();
          }}
        >
          <Image
            source={require("../../assets/system-icons/plus.png")}
            style={styles.systemIcon}
          ></Image>
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
              <Image
                source={require("../../assets/system-icons/close.png")}
                style={styles.closeIcon}
              ></Image>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.subViewButtonContainer}>
            <TouchableOpacity
              style={[styles.importButton, styles.marginSet]}
              onPress={this._pickImageFromCamera}
            >
              <Image
                source={require("../../assets/system-icons/camera.png")}
                style={styles.systemIcon}
              ></Image>
              <Text style={styles.importText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.importButton}
              onPress={this._pickImageFromSystem}
            >
              <Image
                source={require("../../assets/system-icons/gallery.png")}
                style={styles.systemIcon}
              ></Image>
              <Text style={styles.importText}>Gallery</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subViewButtonContainer}>
            <TouchableOpacity
              style={[styles.importButton, styles.marginSet]}
              onPress={this._pickDocument}
            >
              <Image
                source={require("../../assets/system-icons/folder.png")}
                style={styles.systemIcon}
              ></Image>
              <Text style={styles.importText}>Document</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.importButton}
              onPress={this._addText}
            >
              <Image
                source={require("../../assets/system-icons/text.png")}
                style={styles.systemIcon}
              ></Image>
              <Text style={styles.importText}>Text</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }
}
