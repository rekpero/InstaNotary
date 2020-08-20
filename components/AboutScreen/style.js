import { StyleSheet } from "react-native";

export default StyleSheet.create({
  homeContainer: {
    flex: 1,
    flexDirection: "column",
    paddingTop: 48,
    backgroundColor: "#f5f5f5",
    position: "relative",
  },
  bodyContainer: {
    flex: 1,
    flexDirection: "column",
    padding: 18,
    paddingTop: 24,
    backgroundColor: "#f5f5f5",
    position: "relative",
  },
  toolbarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 24,
    paddingLeft: 24,
    position: "relative",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3a3a3a",
  },
  bodyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3a3a3a",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 18,
    color: "#3a3a3a",
    marginTop: 12,
  },
  highlight: {
    fontWeight: "bold",
    color: "#15548b",
  },
  bottomTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#3a3a3a",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 36,
    left: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    height: 36,
    width: 36,
    position: "absolute",
    top: -4,
    left: 24,
  },
});
