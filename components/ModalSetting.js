import { Modal, Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ModalSetting({
  isVisible,
  title,
  items,
  code,
  onPress,
}) {
  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalLabel}>
            <Text style={styles.modalTitleText}>{title}</Text>
          </View>
          {items.map((item) => (
            <TouchableOpacity
              key={item.code}
              style={styles.radioButtonItem}
              onPress={() => onPress(item.code)}
            >
              <Ionicons
                name={
                  code === item.code ? "radio-button-on" : "radio-button-off"
                }
                size={24}
                color="black"
              />
              <Text style={styles.modalItemText}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalLabel: {
    marginBottom: 20,
  },
  modalTitleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  radioButtonItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  modalItemText: {
    marginLeft: 10,
    fontSize: 16,
  },
});
