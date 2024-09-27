import { useContext, useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import ImagePicker from "../components/ImagePicker";
import OutlinedButton from "../components/UI/OutlinedButton";
import RadioButtons from "../components/UI/RadioButtons";

import { addCard, getFolderList } from "../firebase/firestore";
import { storeStorage } from "../firebase/storage";
import { AuthContext } from "../store/auth-context";

export default function AddCardScreen({ navigation, route }) {
  const authCtx = useContext(AuthContext);
  const userID = authCtx.userID;

  const [cardName, setCardName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const isFolder = route.params.isFolder;
  const [parent, setParent] = useState("");
  const [folderList, setFolderList] = useState([]);

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
    await addCard(userID, cardName, imageUrl, isFolder, parent)
      .then(() => {
        storeStorage(userID, imageUrl);
      })
      .then(() => {
        navigation.navigate("DeckManagementScreen");
      });
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.label}>카드 이름</Text>
        <TextInput
          value={cardName}
          onChangeText={setCardName}
          style={styles.input}
        />
      </View>
      <ImagePicker onTakeImage={takeImageHandler} />

      {isFolder ? "" : <DrawFolderRadioButtonList />}

      <OutlinedButton onPress={saveHandler} icon="save">
        카드 생성
      </OutlinedButton>
      <View style={styles.marginBottom} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  input: {
    marginVertical: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomWidth: 2,
    backgroundColor: "orange",
  },
  inputReadOnly: {
    backgroundColor: "gray",
  },
  marginBottom: {
    marginBottom: 40,
  },
});
