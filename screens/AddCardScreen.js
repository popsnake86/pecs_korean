import { useEffect, useState } from "react";
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
import { getCardByText, insertCard } from "../data/database";

export default function AddCardScreen({ navigation, route }) {
  //const [id, setId] = useState();
  const cardType = route.params.type;
  const [cardTypeText, setCardTypeText] = useState("");
  const [cardText, setCardText] = useState("");
  const [cardImageUrl, setCardImageUrl] = useState("");
  //const [isCardDefault, setIsCardDefault] = useState("");

  useEffect(() => {
    if (cardType === "S") {
      setCardTypeText("주어");
    } else if (cardType === "O") {
      setCardTypeText("목적어");
    } else if (cardType === "V") {
      setCardTypeText("서술어");
    }
  }, []);

  function takeImageHandler(imageUri) {
    setCardImageUrl(imageUri);
  }

  async function saveHandler() {
    if (cardText === "") {
      Alert.alert("오류", "카드 이름을 입력하세요");
      return;
    }

    if (cardImageUrl === "") {
      Alert.alert("오류", "카드 사진을 추가하세요");
      return;
    }

    const isExists = await checkCardNameExists(cardText);
    if (isExists) {
      Alert.alert("오류", `${cardText}은(는) 이미 등록된 카드입니다 `);
      return;
    }

    await saveCard(cardType, cardText, cardImageUrl)
      .then(() => {
        navigation.navigate("DeckManagementScreen");
      })
      .catch((error) => {
        Alert.alert("Error", error);
      });
  }

  async function checkCardNameExists(text) {
    let isExists = false;

    await getCardByText(text)
      .then((result) => {
        if (result.length > 0) {
          isExists = true;
        }
      })
      .catch((error) => {
        Alert.alert("오류", error);
        isExists = true;
      });
    return isExists;
  }

  async function saveCard(type, text, imageUrl) {
    insertCard(type, text, imageUrl)
      .then(() => {})
      .catch((error) => {
        Alert.alert("오류", error);
      });
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.label}>타입</Text>
        <TextInput
          value={cardTypeText}
          readOnly="true"
          style={[styles.input, styles.inputReadOnly]}
        />
      </View>
      <View>
        <Text style={styles.label}>이름</Text>
        <TextInput
          value={cardText}
          onChangeText={setCardText}
          style={styles.input}
        />
      </View>
      <ImagePicker onTakeImage={takeImageHandler} />

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
