import { useContext, useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";

import { getCardImageUrl } from "../../firebase/storage";
import { AuthContext } from "../../store/auth-context";
import { getWindowWidth } from "./Dimensions";

const windowWidth = getWindowWidth();

export default function Card({ item, cardSize }) {
  const authCtx = useContext(AuthContext);
  const userID = authCtx.userID;

  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const cacheImage = async () => {
      const fileName = item.imageUrl;

      if (!fileName) {
        return;
      }

      const localUri = `${FileSystem.cacheDirectory}${fileName}`;
      const fileInfo = await FileSystem.getInfoAsync(localUri);

      if (fileInfo.exists) {
        setImageUri(localUri);
      } else {
        const onlineUrl = await getCardImageUrl(userID, item.imageUrl);
        const { uri: newUri } = await FileSystem.downloadAsync(
          onlineUrl,
          localUri
        );
        setImageUri(newUri);
      }
    };

    cacheImage();
  }, [item.imageUrl]);

  if (item.isFolder === true) {
    return (
      <View
        style={[
          styles.card,
          {
            width: windowWidth / cardSize - 10,
            height: windowWidth / cardSize - 10,
          },
        ]}
      >
        <View style={styles.folderContainer}>
          <View style={styles.folderTab}>
            <View style={styles.folderTabLeft} />
            <View style={styles.folderTabRight} />
          </View>
          <View style={styles.folderBody}>
            <View style={[styles.imageInFolderContainer]}>
              {imageUri === null ? (
                <Text>Loading...</Text>
              ) : (
                <Image
                  source={{
                    uri: imageUri,
                  }}
                  style={[styles.image]}
                />
              )}
            </View>
          </View>
        </View>
        <View style={styles.title}>
          <Text style={styles.name}>{item.cardName}</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={[
          styles.card,
          {
            width: windowWidth / cardSize - 10,
            height: windowWidth / cardSize - 10,
          },
        ]}
      >
        <View style={[styles.imageContainer]}>
          {imageUri === null ? (
            <Text>Loading...</Text>
          ) : (
            <Image source={{ uri: imageUri }} style={[styles.image]} />
          )}
          {!item.isEnabled && (
            <View style={styles.overlay}>
              <Text style={styles.cross}>X</Text>
            </View>
          )}
        </View>
        <View style={styles.title}>
          <Text style={styles.name}>{item.cardName}</Text>
        </View>
      </View>
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
    margin: 5,
  },
  pressed: {
    opacity: 0.8,
  },
  folderContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    //height: "90%",
    marginTop: "5%",
  },
  folderTab: {
    //flex: 1,
    height: "10%",
    flexDirection: "row",
  },
  folderTabLeft: {
    flex: 2,
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
    flex: 1,
    width: "100%",
    backgroundColor: "#ffcc00",
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageInFolderContainer: {
    borderRadius: 6,
    width: "80%",
    height: "80%",
    //overflow: "hidden",
  },
  imageContainer: {
    flex: 1,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  image: {
    resizeMode: "cover",
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 반투명 검은 배경
    justifyContent: "center",
    alignItems: "center",
  },
  cross: {
    color: "red",
    fontSize: windowWidth / 6,
    fontWeight: "bold",
  },
  title: {
    //flex: 1,
  },
  name: {
    fontWeight: "bold",
    fontSize: windowWidth / 35,
  },
});
