import { useCallback, useContext, useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import ModalSetting from "../components/ModalSetting";
import { getWindowWidth } from "../components/UI/Dimensions";
import { AuthContext } from "../store/auth-context";
import {
  getSpeechRate,
  getSpeechRateList,
  getSpeechPitch,
  getSpeechPitchList,
  getSpeechVolume,
  getSpeechVolumeList,
  editSpeechRate,
  editSpeechPitch,
  editSpeechVolume,
} from "../firebase/firestore";

const windowWidth = getWindowWidth();

export default function SettingsVoiceScreen() {
  const authCtx = useContext(AuthContext);
  const [speechRate, setSpeechRate] = useState("");
  const [speechRateList, setSpeechRateList] = useState([]);
  const [speechRateModalVisible, setSpeechRateModalVisible] = useState(false);
  const [speechPitch, setSpeechPitch] = useState("");
  const [speechPitchList, setSpeechPitchList] = useState([]);
  const [speechPitchModalVisible, setSpeechPitchModalVisible] = useState(false);
  const [speechVolume, setSpeechVolume] = useState("");
  const [speechVolumeList, setSpeechVolumeList] = useState([]);
  const [speechVolumeModalVisible, setSpeechVolumeModalVisible] =
    useState(false);

  useEffect(() => {
    const getSpeechRateListFromFirestore = async () => {
      try {
        const list = await getSpeechRateList();
        setSpeechRateList(list);
      } catch (error) {
        console.error(error);
      }
    };
    const getSpeechPitchListFromFirestore = async () => {
      try {
        const list = await getSpeechPitchList();
        setSpeechPitchList(list);
      } catch (error) {
        console.error(error);
      }
    };
    const getSpeechVolumeListFromFirestore = async () => {
      try {
        const list = await getSpeechVolumeList();
        setSpeechVolumeList(list);
      } catch (error) {
        console.error(error);
      }
    };
    getSpeechRateListFromFirestore();
    getSpeechPitchListFromFirestore();
    getSpeechVolumeListFromFirestore();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const getSpeechRateFromFirestore = async () => {
        try {
          const result = await getSpeechRate(authCtx.userID);
          setSpeechRate(result);
        } catch (error) {
          console.error(error);
        }
      };
      const getSpeechPitchFromFirestore = async () => {
        try {
          const result = await getSpeechPitch(authCtx.userID);
          setSpeechPitch(result);
        } catch (error) {
          console.error(error);
        }
      };
      const getSpeechVolumeFromFirestore = async () => {
        try {
          const result = await getSpeechVolume(authCtx.userID);
          setSpeechVolume(result);
        } catch (error) {
          console.error(error);
        }
      };
      getSpeechRateFromFirestore();
      getSpeechPitchFromFirestore();
      getSpeechVolumeFromFirestore();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          setSpeechRateModalVisible(true);
        }}
      >
        <View style={styles.settingItemContainer}>
          <Text style={styles.text}>음성 재생 속도</Text>
          <Text style={styles.text}>{speechRate}</Text>
        </View>
      </Pressable>
      <ModalSetting
        isVisible={speechRateModalVisible}
        title="음성 재생 속도"
        items={speechRateList}
        code={speechRate}
        onPress={(code) => {
          setSpeechRate(code);
          editSpeechRate(authCtx.userID, code);
          setSpeechRateModalVisible(false);
        }}
      />
      <View style={styles.separator} />

      <Pressable
        onPress={() => {
          setSpeechPitchModalVisible(true);
        }}
      >
        <View style={styles.settingItemContainer}>
          <Text style={styles.text}>음성 높낮이</Text>
          <Text style={styles.text}>{speechPitch}</Text>
        </View>
      </Pressable>
      <ModalSetting
        isVisible={speechPitchModalVisible}
        title="음성 높낮이"
        items={speechPitchList}
        code={speechPitch}
        onPress={(code) => {
          setSpeechPitch(code);
          editSpeechPitch(authCtx.userID, code);
          setSpeechPitchModalVisible(false);
        }}
      />
      <View style={styles.separator} />

      <Pressable
        onPress={() => {
          setSpeechVolumeModalVisible(true);
        }}
      >
        <View style={styles.settingItemContainer}>
          <Text style={styles.text}>음성 크기</Text>
          <Text style={styles.text}>{speechVolume}</Text>
        </View>
      </Pressable>
      <ModalSetting
        isVisible={speechVolumeModalVisible}
        title="음성 크기"
        items={speechVolumeList}
        code={speechVolume}
        onPress={(code) => {
          setSpeechVolume(code);
          editSpeechVolume(authCtx.userID, code);
          setSpeechVolumeModalVisible(false);
        }}
      />
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  settingItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 18,
    marginTop: 18,
  },
  text: {
    fontSize: windowWidth / 25,
    fontWeight: "bold",
  },
  separator: {
    height: 1,
    marginTop: 15,
    backgroundColor: "#ccc",
  },
});
