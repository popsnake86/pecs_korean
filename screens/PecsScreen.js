import { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";

import {
  getSelectedGrammarMode,
  getSelectedReadTwiceMode,
} from "../data/database";
import CardList from "../components/UI/CardList";
import DeckCard from "../components/UI/DeckCard";
import IconButton from "../components/UI/IconButton";
import { getWindowWidth } from "../components/UI/Dimensions";

const windowWidth = getWindowWidth();

export default function PecsScreen() {
  const [grammarMode, setGrammarMode] = useState(null);
  const [readTwiceMode, setReadTwiceMode] = useState(null);
  const [subjectCard, setSubjectCard] = useState(null);
  const [objectCard, setObjectCard] = useState(null);
  const [verbCard, setVerbCard] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubjectSpeaking, setIsSubjectSpeaking] = useState(false);
  const [isObjectSpeaking, setIsObjectSpeaking] = useState(false);
  const [isVerbSpeaking, setIsVerbSpeaking] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getSelectedGrammarMode()
        .then((result) => {
          setGrammarMode(result.code);
        })
        .catch((error) => {
          Alert.alert("오류", error);
        });
      getSelectedReadTwiceMode()
        .then((result) => {
          setReadTwiceMode(result.code);
        })
        .catch((error) => {
          Alert.alert("오류", error);
        });
      setSubjectCard(null);
      setObjectCard(null);
      setVerbCard(null);
    }, [])
  );

  useEffect(() => {
    async function enableAudioInSilentMode() {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
      });
    }
    enableAudioInSilentMode();
  }, []);

  function DrawSubjectList() {
    if (grammarMode === "1" || grammarMode === "2") {
      return <View style={styles.blankList} />;
    }
    return <CardList type="S" onSelect={cardChangeHandler} />;
  }

  function DrawObjectList() {
    return <CardList type="O" onSelect={cardChangeHandler} />;
  }

  function DrawVerbList() {
    if (grammarMode === "1") {
      return;
    }
    return <CardList type="V" onSelect={cardChangeHandler} />;
  }

  function cardChangeHandler(item) {
    if (item.type === "S") {
      setSubjectCard(item);
    } else if (item.type === "O") {
      setObjectCard(item);
    } else if (item.type === "V") {
      setVerbCard(item);
    }
  }

  function DrawSelectedSubjectCard() {
    if (!subjectCard) {
      return <Text style={styles.notSelected}>Not selected</Text>;
    }
    return <DeckCard item={subjectCard} onSelect={() => {}} />;
  }

  function DrawSelectedObjectCard() {
    if (!objectCard) {
      return <Text style={styles.notSelected}>Not selected</Text>;
    }
    return <DeckCard item={objectCard} onSelect={() => {}} />;
  }

  function DrawSelectedVerbCard() {
    if (!verbCard) {
      return <Text style={styles.notSelected}>Not selected</Text>;
    }
    return <DeckCard item={verbCard} onSelect={() => {}} />;
  }

  function DrawPlayButton() {
    return (
      <IconButton
        icon={"play-circle-outline"}
        size={40}
        color={"black"}
        onPress={PlayHandler}
      />
    );
  }

  function PlayHandler() {
    if (!isPlaying) {
      setIsPlaying(true);

      let subjectText = "";
      let objectText = "";
      let verbText = "";

      if (subjectCard) {
        subjectText = subjectCard.text;
      }

      if (objectCard) {
        objectText = objectCard.text;
      }
      if (verbCard) {
        verbText = verbCard.text;
      }

      setIsSubjectSpeaking(true);
      Speech.speak(subjectText, {
        onDone: () => {
          setIsSubjectSpeaking(false);
          setIsObjectSpeaking(true);
          Speech.speak(objectText, {
            onDone: () => {
              setIsObjectSpeaking(false);
              setIsVerbSpeaking(true);
              Speech.speak(verbText, {
                onDone: () => {
                  setIsVerbSpeaking(false);
                  if (readTwiceMode === "Y") {
                    setTimeout(() => {
                      setIsSubjectSpeaking(true);
                      setIsObjectSpeaking(true);
                      setIsVerbSpeaking(true);
                      Speech.speak(
                        subjectText + " " + objectText + " " + verbText,
                        {
                          onDone: () => {
                            setIsSubjectSpeaking(false);
                            setIsObjectSpeaking(false);
                            setIsVerbSpeaking(false);
                            setIsPlaying(false);
                          },
                        }
                      );
                    }, 1000);
                  } else {
                    setIsPlaying(false);
                  }
                },
              });
            },
          });
        },
      });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.cardList}>{DrawSubjectList()}</View>
        <View style={styles.cardList}>{DrawObjectList()}</View>
        <View style={styles.cardList}>{DrawVerbList()}</View>
      </View>
      <View style={styles.bottomContainer}>
        <View
          style={[
            styles.selectedCard,
            { opacity: isSubjectSpeaking ? 0.5 : 1.0 },
          ]}
        >
          {DrawSelectedSubjectCard()}
        </View>
        <View
          style={[
            styles.selectedCard,
            { opacity: isObjectSpeaking ? 0.5 : 1.0 },
          ]}
        >
          {DrawSelectedObjectCard()}
        </View>
        <View
          style={[styles.selectedCard, { opacity: isVerbSpeaking ? 0.5 : 1.0 }]}
        >
          {DrawSelectedVerbCard()}
        </View>
        <View style={styles.play}>{DrawPlayButton()}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  topContainer: {
    flex: 1,
    flexDirection: "row",
    marginTop: 10,
  },
  cardList: {
    justifyContent: "center",
    marginLeft: 10,
  },
  blankList: {
    width: windowWidth / 4,
  },
  bottomContainer: {
    height: windowWidth / 4 + 20 + 20,
    flexDirection: "row",
    backgroundColor: "gray",
  },
  selectedCard: {
    width: windowWidth / 4,
    marginVertical: 10,
    marginLeft: 10,
    borderRadius: 6,
    backgroundColor: "gray",
    justifyContent: "center",
  },
  notSelected: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  play: {
    flex: 1,
    alignContent: "center",
    justifyContent: "center",
  },
});
