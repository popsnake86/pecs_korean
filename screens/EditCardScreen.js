import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import OutlinedButton from "../components/UI/OutlinedButton";
import { getWindowWidth } from "../components/UI/Dimensions";
import { deleteCard } from "../data/database";

const windowWidth = getWindowWidth();

export default function EditCardScreen({ navigation, route }) {
  const cardId = route.params.id;
  const cardType = route.params.type;
  const [cardTypeText, setCardTypeText] = useState("");
  const cardText = route.params.text;
  const cardImageUrl = route.params.imageUrl;
  const cardIsDefault = route.params.isDefault;

  useEffect(() => {
    if (cardType === "S") {
      setCardTypeText("주어");
    } else if (cardType === "O") {
      setCardTypeText("목적어");
    } else if (cardType === "V") {
      setCardTypeText("서술어");
    }
  }, []);

  function drawImage() {
    if (cardIsDefault === "") {
      return (
        <View style={styles.imageContainer}>
          <Image source={{ uri: cardImageUrl }} style={styles.image} />
        </View>
      );
    }
    return;
  }

  function closeHandler() {
    navigation.navigate("DeckManagementScreen");
  }

  async function removeHandler() {
    Alert.alert("삭제", `정말로 ${cardText}을(를) 삭제하시겠습니까?`, [
      {
        text: "삭제",
        onPress: removeCard,
      },
      {
        text: "취소",
        onPress: () => {},
      },
    ]);
  }

  async function removeCard() {
    await deleteCard(cardId)
      .then(() => {
        navigation.navigate("DeckManagementScreen");
      })
      .catch((error) => {
        Alert.alert("Error", error);
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
          readOnly="true"
          style={[styles.input, styles.inputReadOnly]}
        />
      </View>
      {drawImage()}
      <OutlinedButton onPress={closeHandler} icon="close-circle-outline">
        닫기
      </OutlinedButton>
      <OutlinedButton onPress={removeHandler} icon="trash-outline">
        삭제
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
    color: "black",
    backgroundColor: "gray",
  },
  imageContainer: {
    width: windowWidth - 48,
    height: windowWidth - 48,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  marginBottom: {
    marginBottom: 40,
  },
});
