import { StyleSheet, Text, View } from "react-native";

export default function EmptyMessage({ text }) {
  return (
    <View style={styles.view}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
  },
});
