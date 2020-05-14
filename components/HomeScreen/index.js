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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import Constants from "expo-constants";
import { decode } from "base64-arraybuffer";
import * as Permissions from "expo-permissions";
import { Ionicons, Feather, FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "./styles";
import { WebService } from "../../services";
import { AuthContext, StateContext } from "../../hooks";
import moment from "moment";

export default class HomeScreen extends React.Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);

    this.state = {
      bounceValue: new Animated.Value(200),
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

  getAllNotaryItems = async (userMobileNumber) => {
    const allNotaries = await WebService.getNotaryItemsByNumber(
      userMobileNumber
    );
    this.setState({
      allNotaries: allNotaries.notaries,
      backupNotaries: allNotaries.notaries,
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
      if (!result.cancelled) {
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
    var toValue = 200;

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
          <Text style={styles.title}>Instant Notary</Text>
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
              autoFocus
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
              <TouchableOpacity>
                <Text style={styles.menuText}>Sort By Date</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={[styles.menuText, styles.borderTop]}>
                  Sort By Name
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.listContainer}>
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
                    {item.type === "image" && (
                      <FontAwesome name="image" size={36} color="#737373" />
                    )}
                    {item.type === "file" && (
                      <FontAwesome
                        name="file-text-o"
                        size={36}
                        color="#737373"
                      />
                    )}
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
                    <View style={styles.notaryItemDetailsDescriptionContainer}>
                      <Text
                        numberOfLines={1}
                        style={styles.notaryItemDetailsHash}
                      >
                        {item.hash}
                      </Text>
                    </View>
                    <View style={styles.notaryItemDetailsDescriptionContainer}>
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
            onPress={(e) =>
              this.setState({ openSortMenu: !this.state.openSortMenu })
            }
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
