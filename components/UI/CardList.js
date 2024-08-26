import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import DeckCard from "./DeckCard";
import { getAllCard } from "../../data/database";

export default function CardList({ type, onSelect }) {
  const isFocused = useIsFocused();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (isFocused) {
      getAllCard(type)
        .then((result) => {
          const itemsArray = [];
          result.forEach((item) => {
            itemsArray.push({
              id: item.id,
              type: item.type,
              text: item.text,
              imageUrl: item.imageUrl,
              isDefault: item.isDefault,
            });
          });
          setItems(itemsArray);
        })
        .catch((error) => {
          Alert.alert("오류", error);
        });
    }
  }, [isFocused]);

  if (items.length === 0) {
    return <Text style={styles.warning}>등록된 카드가 없습니다</Text>;
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      style={styles.list}
      renderItem={({ item }) => (
        <View style={styles.view}>
          <DeckCard item={item} onSelect={onSelect} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  warning: {
    fontWeight: "bold",
    fontSize: 18,
  },
  list: {
    flex: 1,
  },
  view: {
    marginBottom: 10,
  },
});
