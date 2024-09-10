import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getAllGrammarMode,
  getSelectedGrammarMode,
  getSelectedReadTwiceMode,
  updateGrammarSetting,
  updateReadTwiceSetting,
} from "../data/database";
import ModalSetting from "../components/ModalSetting";

export default function SettingsScreen() {
  const [grammarModalVisible, setGrammarModalVisible] = useState(false);
  const [grammarValue, setGrammarValue] = useState(null);
  const [grammarItems, setGrammarItems] = useState([]);
  const [readTwiceValue, setReadTwiceValue] = useState(false);

  const licenses = require("../licenses.json");

  useEffect(() => {
    getAllGrammarMode()
      .then((result) => {
        const grammarModesArray = [];
        result.forEach((item) => {
          grammarModesArray.push({
            code: item.code,
            description: item.description,
          });
        });
        setGrammarItems(grammarModesArray);
      })
      .catch((error) => {
        console.log(error);
      });

    getSelectedGrammarMode()
      .then((result) => {
        setGrammarValue(result.code);
      })
      .catch((error) => {
        console.log(error);
      });

    getSelectedReadTwiceMode()
      .then((result) => {
        if (result.code === "Y") {
          setReadTwiceValue(true);
        } else {
          setReadTwiceValue(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (grammarValue) {
      updateGrammarSetting(grammarValue)
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
    }
  }, [grammarValue]);

  useEffect(() => {
    const value = readTwiceValue ? "Y" : "N";
    updateReadTwiceSetting(value)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  }, [readTwiceValue]);

  return (
    <View style={styles.container}>
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

      <View style={styles.separator} />

      <View style={styles.infoItemContainer}>
        <Text style={styles.label1}>PECS Korean 정보</Text>
      </View>
      <View style={styles.infoItemContainer}>
        <Text style={styles.label2}>앱 버전</Text>
        <Text style={styles.label3}>v0.3.2</Text>
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
