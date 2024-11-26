import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getWindowWidth } from "../components/UI/Dimensions";

const windowWidth = getWindowWidth();

export default function SettingsLicenseScreen() {
  const licenses = require("../licenses.json");
  return (
    <ScrollView style={styles.container}>
      {Object.keys(licenses).map((key) => {
        return (
          <View key={key} style={styles.licenseContainer}>
            <Text style={styles.packageName}>{key}</Text>
            <Text style={styles.licenseType}>
              License: {licenses[key].licenses}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  text: {
    fontSize: windowWidth / 25,
    fontWeight: "bold",
  },
  licenseContainer: {
    marginBottom: 10,
  },
  packageName: {
    fontWeight: "bold",
    fontSize: windowWidth / 25,
    marginTop: 5,
  },
  licenseType: {
    fontStyle: "italic",
    marginTop: 5,
  },
});
