import { StyleSheet, Dimensions } from "react-native";

const { width: winWidth, height: winHeight } = Dimensions.get("window");

export default StyleSheet.create({
  homeContainer: {
    flex: 1,
    flexDirection: "column",
    padding: 24,
    paddingTop: 48,
    backgroundColor: "#f5f5f5",
  },
  toolbarContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  toolbarTitle: {
    marginLeft: 12,
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  webview: {
    borderRadius: 4,
  },
  fileIcon: {
    height: 500,
    width: 500,
  },
  imageContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  toolbarAction: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  infoButton: {
    marginRight: 12,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    opacity: 0.8,
    position: "absolute",
    top: 0,
    left: 0,
    elevation: 20,
    width: winWidth,
    height: winHeight + 50,
  },
  subView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    height: 280,
    elevation: 100,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 18,
  },
  subViewHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    display: "flex",
  },
  subViewTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 18,
  },
  subViewDetailContainer: {
    flexDirection: "column",
    marginVertical: 10,
  },
  subViewDetailItems: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  detailTitle: {
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 16,
    marginRight: 12,
    width: 90,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
  noPreviewText: {
    textAlign: "center",
    paddingHorizontal: 24,
    marginVertical: 8,
  },
});
