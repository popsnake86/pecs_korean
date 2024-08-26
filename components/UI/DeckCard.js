import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { getWindowWidth } from "./Dimensions";

const dadImage = require("../../assets/image/subject/dad.png");
const momImage = require("../../assets/image/subject/mom.png");
const waterImage = require("../../assets/image/object/water.jpg");
const jellyImage = require("../../assets/image/object/jelly.jpg");
const cherryImage = require("../../assets/image/object/cherry.jpg");
const simpsonImage = require("../../assets/image/object/simpson.jpg");
const squidPenutImage = require("../../assets/image/object/squidPenut.jpg");
const bananaImage = require("../../assets/image/object/banana.jpg");
const restroomImage = require("../../assets/image/object/restroom.jpeg");
const givemeImage = require("../../assets/image/verb/giveme.jpg");
const wannagoImage = require("../../assets/image/verb/wannago.jpg");

const windowWidth = getWindowWidth();

export default function DeckCard({ item, onSelect }) {
  function DrawImage(item) {
    if (item.isDefault === "X") {
      let imageSource;
      switch (item.id) {
        case "아빠_default":
          imageSource = dadImage;
          break;
        case "엄마_default":
          imageSource = momImage;
          break;
        case "물_default":
          imageSource = waterImage;
          break;
        case "젤리_default":
          imageSource = jellyImage;
          break;
        case "체리_default":
          imageSource = cherryImage;
          break;
        case "심슨과자_default":
          imageSource = simpsonImage;
          break;
        case "오징어땅콩_default":
          imageSource = squidPenutImage;
          break;
        case "바나나_default":
          imageSource = bananaImage;
          break;
        case "화장실_default":
          imageSource = restroomImage;
          break;
        case "주세요_default":
          imageSource = givemeImage;
          break;
        case "갈래요_default":
          imageSource = wannagoImage;
          break;
        default:
          break;
      }

      return <Image source={imageSource} style={styles.image} />;
    } else {
      return <Image source={{ uri: item.imageUrl }} style={styles.image} />;
    }
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => onSelect(item)}
    >
      <View style={styles.imageContainer}>{DrawImage(item)}</View>
      <View style={styles.title}>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </Pressable>
  );
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
    //width: windowWidth / 4,
  },
  pressed: {
    opacity: 0.8,
  },
  imageContainer: {
    flex: 1,
    width: windowWidth / 4,
    height: windowWidth / 4,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    overflow: "hidden",
    //backgroundColor: "green",
  },
  image: {
    //flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  title: {
    //flex: 1,
  },
  text: {
    fontWeight: "bold",
    fontSize: 18,
  },
});
