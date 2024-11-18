import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import ModalFolder from "../components/ModalFolder";
import CardList from "../components/UI/CardList";
import OutlinedButton from "../components/UI/OutlinedButton";
import { getWindowWidth } from "../components/UI/Dimensions";

const windowWidth = getWindowWidth();

export default function DeckManagementScreen({ navigation }) {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalFolderVisible, setIsModalFolderVisible] = useState(false);

  function cardSelectHandler(item) {
    if (item.isFolder === true) {
      setSelectedFolder(item);
      setIsModalFolderVisible(true);
    } else {
      setIsModalFolderVisible(false);
      editCardHandler(item);
    }
  }

  function addCardHandler(isFolder) {
    navigation.navigate("AddCardScreen", {
      isFolder: isFolder,
      parent: "",
      isEditMode: false,
    });
  }

  function editCardHandler(item) {
    navigation.navigate("AddCardScreen", {
      cardId: item.cardId,
      cardName: item.cardName,
      imageUrl: item.imageUrl,
      parent: item.parent,
      isFolder: item.isFolder,
      isEditMode: true,
    });
  }

  function editFolderHandler(item) {
    navigation.navigate("AddCardScreen", {
      cardId: item.cardId,
      cardName: item.cardName,
      imageUrl: item.imageUrl,
      parent: "",
      isFolder: item.isFolder,
      isEditMode: true,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        <CardList
          onSelect={cardSelectHandler}
          numColumns={4}
          isEditMode={true}
          parent=""
        />
      </View>
      <View style={styles.bottomContainer}>
        <OutlinedButton
          icon="folder-outline"
          onPress={() => addCardHandler(true)}
        >
          폴더 추가
        </OutlinedButton>
        <OutlinedButton
          icon="add-circle-outline"
          onPress={() => addCardHandler(false)}
        >
          카드 추가
        </OutlinedButton>
      </View>

      <ModalFolder
        isVisible={isModalFolderVisible}
        parent={selectedFolder}
        onEdit={editFolderHandler}
        onPress={cardSelectHandler}
        onClose={() => {
          setIsModalFolderVisible(false);
        }}
        isEditMode={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  bodyContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gray",
  },
  bottomContainer: {
    height: windowWidth / 4,
    //flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
