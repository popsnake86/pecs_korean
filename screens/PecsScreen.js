import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import * as Speech from "expo-speech";
import { Audio } from "expo-av";

import ModalFolder from "../components/ModalFolder";
import CardList from "../components/UI/CardList";
import Card from "../components/UI/Card";
import IconButton from "../components/UI/IconButton";
import { getWindowWidth } from "../components/UI/Dimensions";

const windowWidth = getWindowWidth();

export default function PecsScreen() {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalFolderVisible, setIsModalFolderVisible] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function enableAudioInSilentMode() {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true, // 무음 모드에서 재생 가능하도록 설정
        allowsRecordingIOS: false,
        interruptionModeIOS: 0,
        playsThroughEarpieceIOS: false,
        shouldDuckAndroid: false,
        interruptionModeAndroid: 1,
      });
    }
    enableAudioInSilentMode();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setSelectedCards([]);
    }, [])
  );

  function DrawSelectedCardList() {
    if (selectedCards.length === 0) {
      return <Text>선택된 카드가 없습니다</Text>;
    }

    return selectedCards.map((item, index) => (
      <View style={styles.selectedCard} key={index}>
        <Card item={item} onSelect={() => {}} cardSize={8} />
      </View>
    ));
  }

  const BackHandler = useCallback(() => {
    if (selectedCards.length >= 1) {
      setSelectedCards((prevList) => prevList.slice(0, -1));
    }
  }, [selectedCards]);

  const PlayHandler = useCallback(() => {
    if (selectedCards.length >= 1) {
      let text = "";
      selectedCards.forEach((item) => {
        text = text + item.cardName + " ";
      });
      console.log(text);
      PlayVoice(text);
    }
  }, [selectedCards]);

  const PlayVoice = (text) => {
    console.log(text);
    if (!isPlaying) {
      setIsPlaying(true);
      Speech.speak(text, {
        language: "ko-KR",
        onDone: () => {
          setIsPlaying(false);
        },
      });
    }
  };

  const cardSelectHandler = useCallback(
    (item) => {
      if (item.isFolder === true) {
        setSelectedFolder(item.cardId);
        setIsModalFolderVisible(true);
      } else {
        if (selectedCards.length < 5 && !isPlaying) {
          setSelectedCards((prevCards) => [...prevCards, item]);
          PlayVoice(item.cardName);
        }
      }
    },
    [selectedCards, isPlaying]
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.selectedCardContainer}>
          <DrawSelectedCardList />
        </View>
        <View style={styles.back}>
          <IconButton
            icon={"backspace-outline"}
            size={40}
            color={"black"}
            onPress={BackHandler}
          />
        </View>
      </View>

      <View style={styles.topContainer}>
        <View style={styles.play}>
          <IconButton
            icon={"play-circle-outline"}
            size={40}
            color={"black"}
            onPress={PlayHandler}
          />
        </View>
      </View>

      <View style={styles.bodyContainer}>
        <CardList
          onSelect={cardSelectHandler}
          numColumns={4}
          isEditMode={false}
          parent=""
        />
      </View>

      <ModalFolder
        isVisible={isModalFolderVisible}
        parent={selectedFolder}
        onPress={cardSelectHandler}
        onClose={() => {
          setIsModalFolderVisible(false);
        }}
        isEditMode={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  topContainer: {
    height: windowWidth / 5,
    flexDirection: "row",
    backgroundColor: "gray",
  },
  selectedCardContainer: {
    flex: 6,
    flexDirection: "row",
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "flex-start",
    margin: 7,
    borderRadius: 6,
  },
  selectedCard: {
    width: windowWidth / 6,
  },
  back: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  play: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "green",
    margin: 7,
    borderRadius: 6,
  },
  bodyContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gray",
  },
});
