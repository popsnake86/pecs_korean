import { useEffect, useState } from "react";
import { Text, Platform, Alert } from "react-native";
import { enableScreens } from "react-native-screens";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

import PecsScreen from "./screens/PecsScreen";
import DeckManagementScreen from "./screens/DeckManagementScreen";
import AddCardScreen from "./screens/AddCardScreen";
import EditCardScreen from "./screens/EditCardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { dbInit, dbInit2 } from "./data/database";
import Modal99 from "./components/Modal99";

if (Platform.OS === "android") {
  enableScreens(true);
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nextRoute, setNextRoute] = useState(null);
  const [navigationRef, setNavigationRef] = useState(null);

  const handleTabPress = (e, navigation, routeName) => {
    e.preventDefault();
    setNavigationRef(navigation);
    setNextRoute(routeName);
    setIsModalVisible(true);
  };

  const onCorrectAnswer = () => {
    setIsModalVisible(false);
    navigationRef.navigate(nextRoute);
  };

  useEffect(() => {
    dbInit()
      .then(() => {
        dbInit2();
      })
      .catch((error) => {
        Alert.alert("에러", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function DeckManagementNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="DeckManagementScreen"
          component={DeckManagementScreen}
          options={{
            title: "덱 설정",
          }}
        />
        <Stack.Screen
          name="AddCardScreen"
          component={AddCardScreen}
          options={{
            title: "카드 생성",
          }}
        />
        <Stack.Screen
          name="EditCardScreen"
          component={EditCardScreen}
          options={{
            title: "카드 변경",
          }}
        />
      </Stack.Navigator>
    );
  }

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name="Pecs"
            component={PecsScreen}
            options={{
              title: "펙스",
              tabBarIcon: () => (
                <MaterialCommunityIcons
                  name="card-multiple-outline"
                  size={24}
                  color="black"
                />
              ),
            }}
          />
          <Tab.Screen
            name="DeckManagement"
            component={DeckManagementNavigator}
            listeners={({ navigation }) => ({
              tabPress: (e) => handleTabPress(e, navigation, "DeckManagement"),
            })}
            options={{
              tabBarLabel: "덱 설정",
              headerShown: false,
              tabBarIcon: () => (
                <Feather name="database" size={24} color="black" />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            listeners={({ navigation }) => ({
              tabPress: (e) => handleTabPress(e, navigation, "Settings"),
            })}
            options={{
              title: "환경 설정",
              tabBarIcon: () => (
                <AntDesign name="setting" size={24} color="black" />
              ),
            }}
          />
        </Tab.Navigator>
        <Modal99
          isVisible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
          }}
          onCorrectAnswer={onCorrectAnswer}
        />
      </NavigationContainer>
    </>
  );
}
