import * as React from "react";
import { WebView } from "react-native-webview";
export default function NotaryViewScreen({ route }) {
  const { notary } = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <WebView
      source={{
        uri: `${
          notary.type === "pdf"
            ? "http://docs.google.com/gview?embedded=true&url="
            : ""
        }https://ipfs.io/ipfs/${notary.hash}`,
      }}
    />
  );
}
