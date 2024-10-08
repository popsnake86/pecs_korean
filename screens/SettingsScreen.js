import { useContext } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";

import ModalSetting from "../components/ModalSetting";
import OutlinedButton from "../components/UI/OutlinedButton";

import { logout } from "../firebase/auth";
import { AuthContext } from "../store/auth-context";

export default function SettingsScreen() {
  const licenses = require("../licenses.json");
  const authCtx = useContext(AuthContext);

  let appVersion = "";
  try {
    appVersion = Constants.expoConfig?.version;
    //appVersion = Constants.manifest2.extra.expoClient.version;
  } catch (error) {
    Alert.alert("appVersion error");
    console.log(error);
  }

  const handleLogout = async () => {
    try {
      const result = await logout();
      authCtx.logout();
    } catch (error) {
      Alert.alert("handleLogout error", error);
    }
  };

  /*
 <TouchableOpacity
        style={styles.settingItemContainer}
        onPress={() => setGrammarModalVisible(true)}
      >
        <View style={styles.labelContainer}>
          <Text style={styles.label1}>펙스 문법</Text>
          <Text style={styles.label3}>
            {grammarItems.length > 0 && grammarValue
              ? grammarItems[parseInt(grammarValue) - 1].description
              : ""}
          </Text>
        </View>
      </TouchableOpacity>
      <ModalSetting
        isVisible={grammarModalVisible}
        title="펙스 문법"
        items={grammarItems}
        code={grammarValue}
        onPress={(code) => {
          setGrammarValue(code);
          setGrammarModalVisible(false);
        }}
      />

      <View style={styles.settingItemContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label1}>반복 읽어주기</Text>
          <Text style={styles.label3}>
            음성재생 시 전체 문장을 한번 더 읽어줍니다
          </Text>
        </View>
        <Switch value={readTwiceValue} onValueChange={setReadTwiceValue} />
      </View>
  */

  return (
    <View style={styles.container}>
      <View style={styles.settingItemContainer}>
        <OutlinedButton icon="log-out-outline" onPress={handleLogout}>
          로그아웃
        </OutlinedButton>
      </View>

      <View style={styles.separator} />

      <View style={styles.infoItemContainer}>
        <Text style={styles.label1}>PECS Korean 정보</Text>
      </View>
      <View style={styles.infoItemContainer}>
        <Text style={styles.label2}>앱 버전</Text>
        <Text style={styles.label3}>{appVersion}</Text>
      </View>
      <View style={styles.infoItemContainer}>
        <Text style={styles.label2}>문의</Text>
        <Text style={styles.label3}>popsnake@hotmail.com</Text>
      </View>
      <View style={styles.infoItemContainer}>
        <Text style={styles.label2}>오픈소스 라이선스</Text>
        <ScrollView>
          {Object.keys(licenses).map((key) => {
            return (
              <View key={key} style={styles.licenseContainer}>
                <Text style={styles.packageName}>{key}</Text>
                <Text style={styles.licenseType}>
                  License: {licenses[key].licenses}
                </Text>
              </View>
            );
          })}
        </ScrollView>
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
  label1: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label2: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: "bold",
  },
  label3: {
    marginTop: 5,
    fontSize: 12,
  },
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
  modalLabel: {
    marginBottom: 20,
  },
  modalTitleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  radioButtonItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  modalItemText: {
    marginLeft: 10,
    fontSize: 16,
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
  licenseContainer: {
    marginBottom: 10,
  },
  packageName: {
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 5,
  },
  licenseType: {
    fontStyle: "italic",
    marginTop: 5,
  },
});
