import { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import * as Speech from "expo-speech";

import ModalFolder from "../components/ModalFolder";
import CardList from "../components/UI/CardList";
import Card from "../components/UI/Card";
import IconButton from "../components/UI/IconButton";
import { getWindowWidth } from "../components/UI/Dimensions";
import EmptyMessage from "../components/UI/EmptyMessage";

import { AuthContext } from "../store/auth-context";
import {
  getSpeechRate,
  getSpeechPitch,
  getSpeechVolume,
} from "../firebase/firestore";

const windowWidth = getWindowWidth();

export default function PecsScreen() {
  const authCtx = useContext(AuthContext);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalFolderVisible, setIsModalFolderVisible] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [isPlayingIndex, setIsPlayingIndex] = useState(null);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [speechVolume, setSpeechVolume] = useState(1.0);

  useFocusEffect(
    useCallback(() => {
      setSelectedCards([]);
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      const getSpeechRateFromFirestore = async () => {
        try {
          const result = await getSpeechRate(authCtx.userID);
          setSpeechRate(Number(result));
        } catch (error) {
          console.error(error);
        }
      };
      const getSpeechPitchFromFirestore = async () => {
        try {
          const result = await getSpeechPitch(authCtx.userID);
          setSpeechPitch(Number(result));
        } catch (error) {
          console.error(error);
        }
      };
      const getSpeechVolumeFromFirestore = async () => {
        try {
          const result = await getSpeechVolume(authCtx.userID);
          setSpeechVolume(Number(result));
        } catch (error) {
          console.error(error);
        }
      };
      if (authCtx.userID) {
        getSpeechRateFromFirestore();
        getSpeechPitchFromFirestore();
        getSpeechVolumeFromFirestore();
      }
    }, [authCtx.userID])
  );

  function DrawSelectedCardList() {
    if (selectedCards.length === 0) {
      return <EmptyMessage text="  선택된 카드가 없습니다" />;
    }

    return selectedCards.map((item, index) => (
      <View
        style={[
          styles.selectedCard,
          isPlayingIndex === index && styles.playingCard,
        ]}
        key={index}
      >
        <Card item={item} onSelect={() => {}} cardSize={5.8} />
      </View>
    ));
  }

  const BackHandler = useCallback(() => {
    if (selectedCards.length >= 1) {
      setSelectedCards((prevList) => prevList.slice(0, -1));
    }
  }, [selectedCards]);

  const PlayHandler = async () => {
    if (selectedCards.length >= 1) {
      for (const [index, item] of selectedCards.entries()) {
        await PlayVoice(item.cardName, index);
      }
    }
  };

  const PlayVoice = (text, index) => {
    return new Promise((resolve) => {
      setIsPlayingIndex(index);
      Speech.speak(text, {
        language: "ko-KR",
        rate: speechRate,
        pitch: speechPitch,
        volume: speechVolume,
        onDone: () => {
          setIsPlayingIndex(null);
          resolve();
        },
      });
    });
  };

  const cardSelectHandler = useCallback(
    (item) => {
      if (item.isFolder === true) {
        setSelectedFolder(item);
        setIsModalFolderVisible(true);
      } else {
        if (
          selectedCards.length < 5 &&
          isPlayingIndex === null &&
          item.isEnabled === true
        ) {
          const newCard = { ...item, isPlaying: false };
          setSelectedCards((prevCards) => [...prevCards, newCard]);
          PlayVoice(item.cardName, selectedCards.length);
        }
      }
    },
    [selectedCards, isPlayingIndex, speechRate, speechPitch, speechVolume]
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
            size={windowWidth / 10}
            color={"black"}
            onPress={BackHandler}
          />
        </View>
      </View>

      <View style={styles.playContainer}>
        <View style={styles.play}>
          <IconButton
            icon={"play-circle-outline"}
            size={windowWidth / 10}
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
  },
  selectedCardContainer: {
    flex: 6,
    flexDirection: "row",
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "flex-start",
    margin: 7,
    borderRadius: 6,
  },
  selectedCard: {
    width: windowWidth / 6,
  },
  playingCard: {
    opacity: 0.8,
    backgroundColor: "green",
  },
  back: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
  playContainer: {
    height: windowWidth / 8,
    flexDirection: "row",
    backgroundColor: "lightgray",
    marginBottom: 7,
    marginHorizontal: 7,
    borderRadius: 6,
  },
  play: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
  },
  bodyContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gray",
  },
});
