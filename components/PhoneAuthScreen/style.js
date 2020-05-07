import { StyleSheet } from "react-native";

export default StyleSheet.create({
  homeContainer: {
    flex: 1,
    flexDirection: "column",
    padding: 12,
    backgroundColor: "#f5f5f5",
  },
  phoneNumberInputContainer: {
    flexDirection: "column",
    padding: 24,
  },
  enterPhoneNumberTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 240,
  },
  enterPhoneNumberText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2b2d2f",
  },
  phoneNumberInput: {
    marginTop: 56,
    fontSize: 18,
    borderWidth: 2,
    borderColor: "#15548b",
    borderRadius: 6,
    padding: 8,
    paddingLeft: 18,
    paddingRight: 18,
  },
  sendVerificationButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  sendVerificationButton: {
    justifyContent: "center",
    width: "80%",
    alignItems: "center",
    marginTop: 36,
    borderRadius: 24,
    paddingBottom: 12,
    paddingTop: 12,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: "#15548b",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.8,
    elevation: 10,
    shadowRadius: 15,
    shadowOffset: { width: 2, height: 2 },
  },
  sendVerificationText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
});
