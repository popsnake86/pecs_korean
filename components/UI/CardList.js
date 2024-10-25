import { useContext, useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { DraggableGrid } from "react-native-draggable-grid";
import { useFocusEffect } from "@react-navigation/native";

import Card from "./Card";
import EmptyMessage from "./EmptyMessage";

import { getCards, updateOrder } from "../../firebase/firestore";
import { AuthContext } from "../../store/auth-context";

export default function CardList({ onSelect, numColumns, parent, isEditMode }) {
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const getCardsFromFirestore = async () => {
        try {
          if (authCtx.userID) {
            const list = await getCards(authCtx.userID, parent);
            setData(list || []);
          }
        } catch (error) {
          Alert.alert("getCardsFromFirestore Error");
        } finally {
          setIsLoading(false);
        }
      };
      getCardsFromFirestore();
    }, [authCtx.userID, parent])
  );

  const handleDragRelease = (updatedItems) => {
    const reOrderedItems = reOrder(updatedItems);
    setData(reOrderedItems);
  };

  const reOrder = (items) => {
    let result = items;
    let index = 0;

    items.forEach((item) => {
      index = index + 1;
      item.order = index;
      updateOrder(item.cardId, item.order);
    });

    return result;
  };

  if (isLoading) {
    return <EmptyMessage text="데이터를 불러오는 중입니다..." />;
  }

  if (data.length < 1) {
    return <EmptyMessage text="카드가 없습니다" />;
  }

  return (
    <View style={styles.view}>
      {isEditMode ? (
        <ScrollView>
          <DraggableGrid
            data={data}
            keyExtractor={(item) => item.key}
            numColumns={numColumns}
            delayLongPress={1000}
            renderItem={(gridItem) => (
              <View>
                <Card item={gridItem} cardSize={4} />
              </View>
            )}
            onItemPress={(item) => {
              onSelect(item);
            }}
            onDragRelease={(changedItem) => {
              handleDragRelease(changedItem);
            }}
          />
        </ScrollView>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.key}
          numColumns={numColumns}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                onSelect(item);
              }}
            >
              <View>
                <Card item={item} cardSize={4} />
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    width: "100%",
  },
  list: {
    flex: 1,
  },
});
