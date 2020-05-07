import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

import styles from "./styles";
import { WebService } from "../../services";

export default function NotaryItemScreen({ navigation }) {
  const [notaryName, setNotaryName] = React.useState("");
  const [notaryDescription, setNotaryDescription] = React.useState("");

  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.homeContainer}>
      <View style={styles.toolbarContainer}>
        <TouchableWithoutFeedback onPress={goBack}>
          <FontAwesome5 name="arrow-left" size={20} color="black" />
        </TouchableWithoutFeedback>
        <Text style={styles.title}>Notary Details</Text>
      </View>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.notaryName}
        placeholder="Enter a name"
        autoFocus
        onChangeText={(notaryName) => setNotaryName(notaryName)}
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.notaryDescription}
        placeholder="Enter a description"
        multiline
        editable
        numberOfLines={4}
        onChangeText={(notaryDescription) =>
          setNotaryDescription(notaryDescription)
        }
      />
      <Text style={styles.label}>File</Text>
      <View style={styles.fileContainer}>
        <MaterialIcons name="attach-file" size={24} color="black" />
        <Text style={styles.fileName}>Notary Details</Text>
      </View>
      <TouchableOpacity style={styles.sendVerificationButton}>
        <Text style={styles.sendVerificationText}>Notarize</Text>
      </TouchableOpacity>
    </View>
  );
}
