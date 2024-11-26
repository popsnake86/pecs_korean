import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export function getWindowWidth() {
  return windowWidth;
}

export function getWindowHeight() {
  return windowHeight;
}
