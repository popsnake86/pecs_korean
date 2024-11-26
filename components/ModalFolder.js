import {
  Modal,
  Text,
  StyleSheet,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CardList from "./UI/CardList";
import IconButton from "./UI/IconButton";
import { getWindowWidth } from "./UI/Dimensions";

const windowWidth = getWindowWidth();

export default function ModalFolder({
  isVisible,
  parent,
  onEdit,
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
            {isEditMode ? (
              <Pressable
                onPress={() => {
                  onEdit(parent);
                  onClose();
                }}
              >
                <Ionicons name="create-outline" size={windowWidth / 10} />
              </Pressable>
            ) : (
              <View />
            )}

            <Text style={styles.modalTitleText}>
              {parent && parent.cardName}
            </Text>
            <IconButton
              icon={"close-circle-outline"}
              size={windowWidth / 10}
              color={"black"}
              onPress={onClose}
            />
          </View>
          <View style={styles.modalBody}>
            <CardList
              onSelect={onPress}
              numColumns={3}
              parent={parent && parent.cardId}
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
    marginTop: "22%",
    backgroundColor: "white",
    //padding: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    //marginBottom: 20,
  },
  modalTitleText: {
    fontSize: windowWidth / 15,
    fontWeight: "bold",
  },
  modalBody: {
    flex: 1,
    backgroundColor: "gray",
    width: "100%",
    alignItems: "center",
  },
});
