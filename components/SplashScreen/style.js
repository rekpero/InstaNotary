import { StyleSheet } from "react-native";

export default StyleSheet.create({
  homeContainer: {
    flex: 1,
    flexDirection: "column",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  welcomeContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
  },
  welcomeIcon: {
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 100,
  },
});
