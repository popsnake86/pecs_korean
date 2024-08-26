import { StyleSheet, Text, View } from "react-native";

import CardList from "../components/UI/CardList";
import IconButton from "../components/UI/IconButton";
import { getWindowWidth } from "../components/UI/Dimensions";

const windowWidth = getWindowWidth();

export default function DeckManagementScreen({ navigation }) {
  function addCardHandler(type) {
    navigation.navigate("AddCardScreen", { type: type });
  }

  function editCardHandler(item) {
    navigation.navigate("EditCardScreen", {
      id: item.id,
      type: item.type,
      text: item.text,
      imageUrl: item.imageUrl,
      isDefault: item.isDefault,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View>
          <View style={styles.topTextContainer}>
            <Text style={styles.title}>주어</Text>
          </View>
          <View style={styles.cardList}>
            <CardList type="S" onSelect={editCardHandler} />
          </View>
        </View>
        <View>
          <View style={styles.topTextContainer}>
            <Text style={styles.title}>목적어</Text>
          </View>
          <View style={styles.cardList}>
            <CardList type="O" onSelect={editCardHandler} />
          </View>
        </View>
        <View>
          <View style={styles.topTextContainer}>
            <Text style={styles.title}>서술어</Text>
          </View>
          <View style={styles.cardList}>
            <CardList type="V" onSelect={editCardHandler} />
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.addCardButton}>
          <IconButton
            onPress={() => addCardHandler("S")}
            icon="add"
            size={30}
            color={"black"}
          />
        </View>
        <View style={styles.addCardButton}>
          <IconButton
            onPress={() => addCardHandler("O")}
            icon="add"
            size={30}
            color={"black"}
          />
        </View>
        <View style={styles.addCardButton}>
          <IconButton
            onPress={() => addCardHandler("V")}
            icon="add"
            size={30}
            color={"black"}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  topContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
  },
  topTextContainer: {
    alignItems: "center",
    marginLeft: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  cardList: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 10,
  },
  bottomContainer: {
    height: windowWidth / 4 + 20 + 20,
    flexDirection: "row",
  },
  addCardButton: {
    width: windowWidth / 4,
    marginVertical: 10,
    marginLeft: 10,
    borderRadius: 6,
    backgroundColor: "gray",
    justifyContent: "center",
  },
});
