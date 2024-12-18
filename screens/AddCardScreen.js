import { useContext, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import ImagePicker from "../components/ImagePicker";
import OutlinedButton from "../components/UI/OutlinedButton";
import RadioButtons from "../components/UI/RadioButtons";
import { getWindowWidth } from "../components/UI/Dimensions";
import {
  addCard,
  deleteCard,
  editCard,
  getFolderList,
  getLastOrderNumber,
  isEmptyUnderTheFolder,
} from "../firebase/firestore";
import { storeStorage, deleteStorage } from "../firebase/storage";
import { AuthContext } from "../store/auth-context";

const windowWidth = getWindowWidth();

export default function AddCardScreen({ navigation, route }) {
  const authCtx = useContext(AuthContext);
  const userID = authCtx.userID;
  const isEditMode = route.params.isEditMode;

  const cardId = route.params.cardId;
  const [cardName, setCardName] = useState(route.params.cardName);
  const [imageUrl, setImageUrl] = useState(route.params.imageUrl);
  const isFolder = route.params.isFolder;
  const [isEnabled, setIsEnabled] = useState(route.params.isEnabled ?? true);
  const [parent, setParent] = useState(route.params.parent);
  const order = route.params.order;
  const [folderList, setFolderList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const setFolderRadioButtonList = async () => {
      getFolderList(userID).then((result) => {
        const itemsArray = [];
        itemsArray.push({
          code: "",
          description: "없음",
        });
        result.forEach((item) => {
          itemsArray.push({
            code: item.cardId,
            description: item.cardName,
          });
        });
        return setFolderList(itemsArray);
      });
    };

    if (!isFolder) {
      setFolderRadioButtonList();
    }
  }, []);

  function DrawFolderRadioButtonList() {
    return (
      <>
        <View style={styles.separator} />
        <Text style={styles.label}>소속 폴더</Text>
        <RadioButtons
          items={folderList}
          code={parent}
          onPress={(code) => {
            setParent(code);
          }}
        />
      </>
    );
  }

  function DrawEnableButton() {
    return (
      <>
        <View style={styles.separator} />
        <View style={styles.switch}>
          <Text style={styles.label}>활성화</Text>
          <Switch
            onValueChange={() => {
              setIsEnabled((previousState) => !previousState);
            }}
            value={isEnabled}
          />
        </View>
      </>
    );
  }

  function takeImageHandler(imageUri) {
    setImageUrl(imageUri);
  }

  async function saveHandler() {
    if (cardName === "") {
      Alert.alert("오류", "카드 이름을 입력하세요");
      return;
    }

    if (imageUrl === "") {
      Alert.alert("오류", "카드 사진을 추가하세요");
      return;
    }

    if (isSaving) {
      return;
    }
    setIsSaving(true);

    if (!isEditMode) {
      const newOrder = await getLastOrderNumber(userID, parent);
      await addCard(
        userID,
        cardName,
        imageUrl,
        isFolder,
        isEnabled,
        parent,
        newOrder
      );
      await storeStorage(userID, imageUrl);
      navigation.navigate("DeckManagementScreen");
    } else {
      if (parent === route.params.parent) {
        await editCard(
          userID,
          cardId,
          cardName,
          imageUrl,
          isEnabled,
          parent,
          order
        );
      } else {
        const newOrder = await getLastOrderNumber(userID, parent);
        await editCard(
          userID,
          cardId,
          cardName,
          imageUrl,
          isEnabled,
          parent,
          newOrder
        );
      }

      if (route.params.imageUrl !== imageUrl) {
        await storeStorage(userID, imageUrl);
        await deleteStorage(userID, route.params.imageUrl);
      }
      navigation.navigate("DeckManagementScreen");
    }
    setIsSaving(false);
  }

  async function deleteHandler() {
    if (isSaving) {
      return;
    }

    Alert.alert("카드 삭제", "정말로 삭제하시겠습니까?", [
      {
        text: "취소",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "삭제",
        onPress: async () => {
          setIsSaving(true);

          if (isFolder) {
            const isEmpty = await isEmptyUnderTheFolder(userID, cardId);
            if (!isEmpty) {
              Alert.alert("오류", "비어있지 않은 폴더는 삭제할 수 없습니다");
              setIsSaving(false);
              return;
            }
          }

          await deleteCard(cardId);
          await deleteStorage(userID, route.params.imageUrl);
          navigation.navigate("DeckManagementScreen");
          setIsSaving(false);
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={[
          styles.scrollView,
          windowWidth > 500 ? styles.containerForPads : "",
        ]}
      >
        <View>
          <Text style={styles.label}>
            {isFolder ? "폴더 이름" : "카드 이름"}
          </Text>
          <TextInput
            value={cardName}
            onChangeText={setCardName}
            style={styles.input}
          />
        </View>
        <ImagePicker onTakeImage={takeImageHandler} prevImage={imageUrl} />

        {!isFolder && folderList.length > 0 ? (
          <>
            <DrawFolderRadioButtonList />
          </>
        ) : (
          ""
        )}

        {!isFolder ? (
          <>
            <DrawEnableButton />
          </>
        ) : (
          ""
        )}

        <View style={styles.separator} />
        <OutlinedButton onPress={saveHandler} icon="save">
          {!isEditMode
            ? isFolder
              ? "폴더 생성"
              : "카드 생성"
            : isFolder
            ? "폴더 변경"
            : "카드 변경"}
        </OutlinedButton>

        {isEditMode ? (
          <OutlinedButton onPress={deleteHandler} icon="trash-outline">
            {isFolder ? "폴더 삭제" : "카드 삭제"}
          </OutlinedButton>
        ) : (
          ""
        )}

        <View style={styles.marginBottom} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  containerForPads: {
    maxWidth: windowWidth * 0.7,
    minWidth: windowWidth * 0.5,
  },
  label: {
    fontWeight: "bold",
    fontSize: windowWidth / 35,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: windowWidth / 35,
    borderBottomWidth: 2,
    backgroundColor: "orange",
  },
  inputReadOnly: {
    backgroundColor: "gray",
  },
  marginBottom: {
    marginBottom: 40,
  },
  separator: {
    height: 1,
    marginVertical: 15,
    backgroundColor: "#ccc",
  },
  switch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
