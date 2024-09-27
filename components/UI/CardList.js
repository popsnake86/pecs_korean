import { useContext, useCallback, useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Card from "./Card";
//import ModalFolder from "../ModalFolder";
import EmptyMessage from "./EmptyMessage";

import { getCards } from "../../firebase/firestore";
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

  if (isLoading) {
    return <EmptyMessage text="데이터를 불러오는 중입니다..." />;
  }

  return (
    <>
      <View style={styles.cardList}>
        {data.length < 1 ? (
          <EmptyMessage text="카드가 없습니다" />
        ) : (
          <FlatList
            data={data}
            keyExtractor={(data) => data.id}
            style={styles.list}
            numColumns={numColumns}
            renderItem={({ item }) => (
              <View>
                <Card item={item} onSelect={onSelect} cardSize={4} />
              </View>
            )}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});
