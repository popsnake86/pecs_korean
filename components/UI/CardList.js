import { useContext, useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { DraggableGrid } from "react-native-draggable-grid";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";

import Card from "./Card";
//import ModalFolder from "../ModalFolder";
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

  return (
    <View style={styles.view}>
      {data.length < 1 ? (
        <EmptyMessage text="카드가 없습니다" />
      ) : (
        <DraggableGrid
          data={data}
          keyExtractor={(item) => item.key}
          numColumns={numColumns}
          disabledDrag={!isEditMode}
          renderItem={(gridItem, drag, isActive) => (
            <View>
              <Card item={gridItem} cardSize={4} />
            </View>
          )}
          onItemPress={(item) => {
            onSelect(item);
          }}
          onDragRelease={(updatedItems) => {
            const reOrderedItems = reOrder(updatedItems);
            setData(reOrderedItems);
          }}
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
