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
  ToastAndroid,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import { Ionicons, Feather, FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "./styles";
import { WebService } from "../../services";
import { AuthContext } from "../../hooks";
import moment from "moment";

export default class HomeScreen extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);

    this.state = {
      bounceValue: new Animated.Value(210),
      isHidden: true,
      isMailLoaded: false,
      openSortMenu: false,
      searchText: "",
      allNotaries: [],
      backupNotaries: [],
      phoneNumber: "",
    };
  }

  componentDidMount() {
    const { state } = this.context;
    this.getPermissionAsync();
    this.getAllNotaryItems(state.userMobileNumber);
  }

  componentDidUpdate() {
    if (
      this.props.route.params !== undefined &&
      this.props.route.params.loadNotaryItems !== undefined &&
      this.props.route.params.loadNotaryItems === true &&
      !this.state.isMailLoaded
    ) {
      const { state } = this.context;
      this.getAllNotaryItems(state.userMobileNumber);
    }
  }

  handleSortNotaries = (type) => {
    console.log("Entered sort");
    const finalNotaries = this.sortNotaries(this.state.allNotaries, type);
    console.log(finalNotaries);
    this.setState({ allNotaries: finalNotaries, openSortMenu: false });
  };

  sortNotaries = (allNotaries, type) => {
    if (type === "name") {
      console.log("Entered name");
      return allNotaries.sort((a, b) => {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
    } else {
      return allNotaries.sort((a, b) => moment(b.time).diff(moment(a.time)));
    }
  };

  getAllNotaryItems = async (userMobileNumber) => {
    const allNotaries = await WebService.getNotaryItemsByNumber(
      userMobileNumber
    );
    console.log(allNotaries);
    const finalSort = this.sortNotaries(allNotaries.notaries);
    this.setState({
      allNotaries: finalSort,
      backupNotaries: finalSort,
      isMailLoaded: true,
    });
  };

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
    try {
      let result = await DocumentPicker.getDocumentAsync({});
      // console.log(result.type);
      if (result.type === "success") {
        this.setState({ isMailLoaded: false });
        this.props.navigation.navigate("NotaryDetail", {
          file: result,
          fileType: "file",
        });
      }
    } catch (err) {
      console.log(err);
    }
    this._toggleSubView();
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
      // console.log(result.cancelled);
      if (!result.cancelled) {
        this.setState({ isMailLoaded: false });
        this.props.navigation.navigate("NotaryDetail", {
          file: result,
          fileType: "image",
        });
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
      // console.log(result.cancelled);
      if (!result.cancelled) {
        this.setState({ isMailLoaded: false });
        this.props.navigation.navigate("NotaryDetail", {
          file: result,
          fileType: "image",
        });
      }
    } catch (err) {
      console.log(err);
    }
    this._toggleSubView();
  };

  _addText = () => {
    this.setState({ isMailLoaded: false });
    this.props.navigation.navigate("NotaryDetail", {
      fileType: "text",
    });
  };

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

  getIconForFile = (ext) => {
    switch (ext) {
      case "image":
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

  deleteNotary = async (item) => {
    const res = await WebService.deleteNotaryItemsByHash(item.hash);
    ToastAndroid.showWithGravity(
      res.message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
    const { state } = this.context;
    this.getAllNotaryItems(state.userMobileNumber);
  };

  refreshList = () => {
    const { state } = this.context;
    this.getAllNotaryItems(state.userMobileNumber);
  };
  filterNotaryList = (search) => {
    const { backupNotaries } = this.state;
    const filteredNotaryList = backupNotaries.filter(
      (notary) => notary.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
    );
    this.setState({ searchText: search, allNotaries: filteredNotaryList });
  };

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
    let { isHidden, openSortMenu, allNotaries } = this.state;
    return (
      <View style={styles.homeContainer}>
        <View style={styles.toolbarContainer}>
          <Text style={styles.title}>InstaNotary.</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={this.logout}>
            <Ionicons name="ios-power" size={18} color="white" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <View style={styles.searchSection}>
            <Ionicons
              style={styles.searchIcon}
              name="ios-search"
              size={20}
              color="#000"
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              onChangeText={(search) => this.filterNotaryList(search)}
            />
          </View>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={(e) =>
              this.setState({ openSortMenu: !this.state.openSortMenu })
            }
          >
            <MaterialIcons name="sort" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={this.refreshList}
          >
            <MaterialIcons name="refresh" size={18} color="white" />
          </TouchableOpacity>
          {openSortMenu && (
            <View style={styles.sortMenu}>
              <TouchableOpacity
                onPress={(e) => this.handleSortNotaries("date")}
              >
                <Text style={styles.menuText}>Sort By Date</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={(e) => this.handleSortNotaries("name")}
              >
                <Text style={[styles.menuText, styles.borderTop]}>
                  Sort By Name
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.listContainer}>
          {allNotaries.length ? (
            <FlatList
              data={allNotaries}
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
                            <FontAwesome
                              name="trash-o"
                              size={20}
                              color="#737373"
                            />
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
          <Ionicons name="ios-add" size={32} color="white" />
        </TouchableOpacity>

        {!isHidden && (
          <TouchableWithoutFeedback onPress={(e) => this._toggleSubView()}>
            <View style={styles.backdrop}></View>
          </TouchableWithoutFeedback>
        )}

        {openSortMenu && (
          <TouchableWithoutFeedback
            onPress={(e) => {
              console.log("Entered backdrop");
              this.setState({ openSortMenu: !this.state.openSortMenu });
            }}
          >
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
              onPress={this._pickImageFromSystem}
            >
              <Ionicons name="md-images" size={18} color="white" />
              <Text style={styles.importText}>Gallery</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subViewButtonContainer}>
            <TouchableOpacity
              style={[styles.importButton, styles.marginSet]}
              onPress={this._pickDocument}
            >
              <Ionicons name="ios-document" size={18} color="white" />
              <Text style={styles.importText}>Document</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.importButton}
              onPress={this._addText}
            >
              <Feather name="file-text" size={18} color="white" />
              <Text style={styles.importText}>Text</Text>
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
