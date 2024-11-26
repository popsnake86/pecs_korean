import { useEffect, useState, useRef } from "react";
import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import IconButton from "./UI/IconButton";

export default function Modal99({ isVisible, onClose, onCorrectAnswer }) {
  const inputRef = useRef(null);

  const [numberA, setNumberA] = useState(0);
  const [numberB, setNubmerB] = useState(0);
  const [rightAnswer, setRightAnswer] = useState(99);
  const [userAnswer, setUserAnswer] = useState("");

  const generate99Problem = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const c = a * b;
    setNumberA(a);
    setNubmerB(b);
    setRightAnswer(c);
  };

  const callKeyboard = () => {
    setTimeout(() => {
      if (inputRef.current) {
        //Keyboard.dismiss();
        inputRef.current.focus();
      }
    }, 500);
  };

  useEffect(() => {
    if (isVisible) {
      generate99Problem();
      setUserAnswer("");
    }
  }, [isVisible]);

  useEffect(() => {
    if (userAnswer == rightAnswer) {
      onCorrectAnswer();
    }
  }, [userAnswer]);

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onShow={callKeyboard}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.exitContainer}>
            <IconButton
              icon={"close-circle-outline"}
              size={30}
              color={"black"}
              onPress={onClose}
            />
          </View>
          <View style={styles.iconContainer}>
            <Ionicons name={"lock-closed-outline"} size={80} color={"black"} />
          </View>
          <View style={styles.problemContainer}>
            <Text style={styles.problemText}>
              {numberA} X {numberB} =
            </Text>
            <TextInput
              value={userAnswer}
              style={styles.userAnswer}
              maxLength={2}
              onChangeText={setUserAnswer}
              keyboardType="numeric"
              ref={inputRef}
              autoFocus={true}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  exitContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  iconContainer: {
    alignItems: "center",
    margin: 50,
  },
  problemContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  problemText: {
    fontWeight: "bold",
    fontSize: 20,
  },
  userAnswer: {
    height: 30,
    width: 30,
    fontWeight: "bold",
    fontSize: 20,
    backgroundColor: "orange",
  },
});
