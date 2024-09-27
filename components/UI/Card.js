import { useContext, useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { getCardImageUrl } from "../../firebase/storage";
import { AuthContext } from "../../store/auth-context";
import { getWindowWidth } from "./Dimensions";

const windowWidth = getWindowWidth();

export default function Card({ item, onSelect, cardSize }) {
  const authCtx = useContext(AuthContext);
  const userID = authCtx.userID;

  const [realImageUrl, setRealImageUrl] = useState(null);

  useEffect(() => {
    const getRealUrl = async () => {
      if (item.imageUrl) {
        const url = await getCardImageUrl(userID, item.imageUrl);
        setRealImageUrl(url);
      }
    };
    getRealUrl();
  }, []);

  if (item.isFolder === true) {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() => onSelect(item)}
      >
        <View
          style={[
            styles.folderContainer,
            {
              width: windowWidth / cardSize - 10,
              height: windowWidth / cardSize - 10,
            },
          ]}
        >
          <View style={styles.folderTab}>
            <View style={styles.folderTabLeft} />
            <View style={styles.folderTabRight} />
          </View>
          <View style={styles.folderBody}>
            <View
              style={[
                styles.imageContainer,
                {
                  width: windowWidth / cardSize - 40,
                  height: windowWidth / cardSize - 40,
                },
              ]}
            >
              {realImageUrl === null ? (
                <Text>Loading...</Text>
              ) : (
                <Image source={{ uri: realImageUrl }} style={styles.image} />
              )}
            </View>
          </View>
        </View>
        <View style={styles.title}>
          <Text style={styles.name}>{item.cardName}</Text>
        </View>
      </Pressable>
    );
  } else {
    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() => onSelect(item)}
      >
        <View
          style={[
            styles.imageContainer,
            {
              width: windowWidth / cardSize - 10,
              height: windowWidth / cardSize - 10,
            },
          ]}
        >
          {realImageUrl === null ? (
            <Text>Loading...</Text>
          ) : (
            <Image source={{ uri: realImageUrl }} style={styles.image} />
          )}
        </View>
        <View style={styles.title}>
          <Text style={styles.name}>{item.cardName}</Text>
        </View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    borderRadius: 6,
    elevation: 2,
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 2,
    backgroundColor: "white",
    margin: 4,
  },
  pressed: {
    opacity: 0.8,
  },
  folderContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  folderTab: {
    flex: 1,
    flexDirection: "row",
  },
  folderTabLeft: {
    flex: 2,
    marginTop: 6,
    marginLeft: 6,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#ffcc00",
  },
  folderTabRight: {
    flex: 3,
    borderTopRightRadius: 10,
    backgroundColor: "white",
  },
  folderBody: {
    flex: 6,
    padding: 8,
    backgroundColor: "#ffcc00",
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageInFolderContainer: {
    borderRadius: 6,
    overflow: "hidden",
  },
  imageContainer: {
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    //flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: 12,
  },
});
