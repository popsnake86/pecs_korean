import { useContext } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";

import { logout } from "../firebase/auth";
import { AuthContext } from "../store/auth-context";
import { getWindowWidth } from "../components/UI/Dimensions";

const windowWidth = getWindowWidth();

export default function SettingsScreen({ navigation }) {
  const authCtx = useContext(AuthContext);

  let appVersion = "";
  try {
    appVersion = Constants.expoConfig?.version;
  } catch (error) {
    Alert.alert("appVersion error");
    console.error(error);
  }

  const handleLogout = async () => {
    try {
      const result = await logout();
      authCtx.logout();
    } catch (error) {
      Alert.alert("handleLogout error");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleLogout}>
        <View style={styles.settingItemContainer}>
          <Text style={styles.text}>로그아웃</Text>
          <Ionicons name="chevron-forward-outline" size={windowWidth / 25} />
        </View>
      </Pressable>
      <View style={styles.separator} />

      <Pressable
        onPress={() => {
          navigation.navigate("SettingsVoiceScreen");
        }}
      >
        <View style={styles.settingItemContainer}>
          <Text style={styles.text}>음성 설정</Text>
          <Ionicons name="chevron-forward-outline" size={windowWidth / 25} />
        </View>
      </Pressable>
      <View style={styles.separator} />

      <Pressable
        onPress={() => {
          navigation.navigate("SettingsLicenseScreen");
        }}
      >
        <View style={styles.settingItemContainer}>
          <Text style={styles.text}>오픈소스 라이선스</Text>
          <Ionicons name="chevron-forward-outline" size={windowWidth / 25} />
        </View>
      </Pressable>
      <View style={styles.separator} />

      <View style={styles.infoItemContainer}>
        <Text style={styles.text}>PECS Korean 정보</Text>
      </View>
      <View style={styles.infoItemContainer}>
        <Text style={styles.label2}>앱 버전</Text>
        <Text style={styles.label3}>{appVersion}</Text>
      </View>
      <View style={styles.infoItemContainer}>
        <Text style={styles.label2}>문의</Text>
        <Text style={styles.label3}>popsnake@hotmail.com</Text>
      </View>
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
  label2: {
    marginTop: 5,
    fontSize: windowWidth / 27,
    fontWeight: "bold",
  },
  label3: {
    marginTop: 5,
    fontSize: windowWidth / 27,
  },
  separator: {
    height: 1,
    marginTop: 15,
    backgroundColor: "#ccc",
  },
  infoItemContainer: {
    marginTop: 10,
    marginHorizontal: 18,
  },
});
