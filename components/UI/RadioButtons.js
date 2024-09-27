import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function RadioButtons({ items, code, onPress }) {
  return (
    <View>
      {items.map((item) => (
        <TouchableOpacity
          key={item.code}
          style={styles.radioButtonItem}
          onPress={() => onPress(item.code)}
        >
          <Ionicons
            name={code === item.code ? "radio-button-on" : "radio-button-off"}
            size={24}
            color="black"
          />
          <Text style={styles.text}>{item.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  radioButtonItem: {
    flexDirection: "row",
    marginTop: 10,
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
  },
});
