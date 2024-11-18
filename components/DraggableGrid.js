import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";

export default function DraggableGrid() {
  const numberRows = 4;
  const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [list, setList] = useState([
    {
      cardID: "1111",
      cardName: "1111",
      imageUrl: "",
      isFolder: false,
      order: 1,
    },
    {
      cardID: "2222",
      cardName: "2222",
      imageUrl: "",
      isFolder: false,
      order: 2,
    },
    {
      cardID: "3333",
      cardName: "3333",
      imageUrl: "",
      isFolder: false,
      order: 3,
    },
    {
      cardID: "4444",
      cardName: "4444",
      imageUrl: "",
      isFolder: false,
      order: 4,
    },
    {
      cardID: "5555",
      cardName: "5555",
      imageUrl: "",
      isFolder: false,
      order: 5,
    },
    {
      cardID: "6666",
      cardName: "6666",
      imageUrl: "",
      isFolder: false,
      order: 6,
    },
    {
      cardID: "7777",
      cardName: "7777",
      imageUrl: "",
      isFolder: false,
      order: 7,
    },
    {
      cardID: "8888",
      cardName: "8888",
      imageUrl: "",
      isFolder: false,
      order: 8,
    },
    {
      cardID: "9999",
      cardName: "9999",
      imageUrl: "",
      isFolder: false,
      order: 9,
    },
    ,
  ]);
  const itemPosition = useSharedValue([]);

  useEffect(() => {
    let updatedPosition = [];
    list.forEach((item) => {
      updatedPosition.push({
        left: getPositionLeft(item.order),
        top: getPositionTop(item.order),
      });
    });
    itemPosition.value = updatedPosition;
    console.log("itemPosition", itemPosition.value);
  }, [list]);

  const handleLayout = (event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setLayout({ x, y, width, height });
  };

  const getPositionLeft = (order) => {
    return layout.x + (layout.width / numberRows) * ((order - 1) % numberRows);
  };

  const getPositionTop = (order) => {
    return (
      layout.y +
      (layout.width / numberRows) * Math.floor((order - 1) / numberRows)
    );
  };

  /*
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const pan = Gesture.Pan().onChange((event) => {
    offsetX.value += event.changeX;
    offsetY.value += event.changeY;
  });
*/
  const animatedStyles = useAnimatedStyle(() => ({
    //    transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
  }));

  const ItemList = () => {
    return list.map((item) => (
      <View
        key={item.cardID}
        style={[
          styles.view,
          {
            position: "absolute",
            //left: itemPosition.value[item.order - 1].left,
            //top: itemPosition.value[item.order - 1].top,
            width: layout.width / numberRows,
            height: layout.width / numberRows,
          },
        ]}
      >
        <Text>{item.cardName}</Text>
      </View>
    ));
  };

  return (
    <View style={styles.draggableGrid} onLayout={handleLayout}>
      <Animated.View style={animatedStyles}>
        <ItemList />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  draggableGrid: {
    flex: 1,
    flexDirection: "row",
  },
  view: {
    flex: 1,
    backgroundColor: "gray",
  },
});
