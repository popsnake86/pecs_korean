import { Modal, Text, StyleSheet, View, ScrollView } from "react-native";
import CardList from "./UI/CardList";
import IconButton from "./UI/IconButton";

export default function ModalFolder({
  isVisible,
  parent,
  onPress,
  onClose,
  isEditMode,
}) {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalLabel}>
            <Text style={styles.modalTitleText}></Text>
            <IconButton
              icon={"close-circle-outline"}
              size={30}
              color={"black"}
              onPress={onClose}
            />
          </View>
          <View style={styles.modalBody}>
            <CardList
              onSelect={onPress}
              numColumns={3}
              parent={parent}
              isEditMode={isEditMode}
            />
          </View>
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
    height: "80%",
    width: "90%",
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
    backgroundColor: "gray",
    alignItems: "center",
  },
});
