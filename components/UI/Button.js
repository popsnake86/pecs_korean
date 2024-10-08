import { Pressable, StyleSheet, Text, View } from "react-native";
import { getWindowWidth } from "../UI/Dimensions";

const windowWidth = getWindowWidth();

export default function Button({ children, onPress, mode, style }) {
  return (
    <View style={style}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={[styles.button, mode === "flat" && styles.flat]}>
          <Text style={[styles.buttonText, mode === "flat" && styles.flatText]}>
            {children}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    padding: 8,
    backgroundColor: "green",
  },
  flat: {
    backgroundColor: "transparent",
  },
  buttonText: {
    color: "black",
    textAlign: "center",
    fontSize: windowWidth / 35,
  },
  flatText: {
    //color: GlobalStyles.colors.primary200,
    //fontSize: windowWidth / 35,
  },
  pressed: {
    opacity: 0.75,
    backgroundColor: "red",
    borderRadius: 4,
  },
});
