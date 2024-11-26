import { Modal, Text, StyleSheet, View } from "react-native";
import RadioButtons from "./UI/RadioButtons";

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
          <RadioButtons items={items} code={code} onPress={onPress} />
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
