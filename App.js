import { useContext, useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, Platform } from "react-native";
import { enableScreens } from "react-native-screens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import PecsScreen from "./screens/PecsScreen";
import DeckManagementScreen from "./screens/DeckManagementScreen";
import AddCardScreen from "./screens/AddCardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import SettingsVoiceScreen from "./screens/SettingsVoiceScreen";
import SettingsLicenseScreen from "./screens/SettingsLicenseScreen";
import RNGH from "./screens/RNGH";
import AuthContextProvider, { AuthContext } from "./store/auth-context";

if (Platform.OS === "android") {
  enableScreens(true);
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  useEffect(() => {
    async function enableAudioInSilentMode() {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        playsThroughEarpieceIOS: true,
        allowsRecordingIOS: false,
        interruptionModeIOS: 0,
        playsThroughEarpieceIOS: false,
        shouldDuckAndroid: false,
        interruptionModeAndroid: 1,
      });
    }
    enableAudioInSilentMode();
  }, []);

  useEffect(() => {
    let soundObject;

    async function playSilentSound() {
      try {
        soundObject = new Audio.Sound();
        await soundObject.loadAsync(require("./assets/sound/nonesound.mp3"));
        await soundObject.setIsLoopingAsync(true);
        await soundObject.playAsync();
      } catch (error) {
        Alert.alert("playSilentSound error");
        console.log("Error playing silent sound:", error);
      }
    }

    playSilentSound();

    // 컴포넌트가 unmount 될 때 무음 소리 정지
    return () => {
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, []);

  const Root = () => {
    const [isTryingLogin, setIsTryingLogin] = useState(true);

    const authCtx = useContext(AuthContext);

    useEffect(() => {
      async function fetchToken() {
        const storedToken = await AsyncStorage.getItem("token");

        if (storedToken) {
          authCtx.authenticate(storedToken);
        }
        setIsTryingLogin(false);
      }

      fetchToken();
    }, []);

    if (isTryingLogin) {
      return <Text>로딩중...</Text>;
    }

    return <Navigation />;
  };

  function Navigation() {
    const authCtx = useContext(AuthContext);

    return (
      <NavigationContainer>
        {!authCtx.isAuthenticated && <AuthStack />}
        {authCtx.isAuthenticated && <AuthenticatedStack />}
      </NavigationContainer>
    );
  }

  const AuthStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "black",
          contentStyle: { backgroundColor: "gray" },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    );
  };

  const AuthenticatedStack = () => {
    const authCtx = useContext(AuthContext);

    return (
      <GestureHandlerRootView>
        <Tab.Navigator initialRouteName="Pecs" screenOptions={{}}>
          <Tab.Screen
            name="Pecs"
            component={PecsScreen}
            options={{
              headerShown: false,
              tabBarLabel: "펙스",
              tabBarIcon: () => (
                <Ionicons name="grid-outline" size={20} color="black" />
              ),
            }}
          />
          <Tab.Screen
            name="DeckManagement"
            component={DeckManagementNavigator}
            options={{
              headerShown: false,
              tabBarLabel: "카드설정",
              tabBarIcon: () => (
                <Ionicons name="folder-outline" size={20} color="black" />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingNavigator}
            options={{
              headerShown: false,
              tabBarLabel: "환경설정",
              tabBarIcon: () => (
                <Ionicons name="settings-outline" size={20} color="black" />
              ),
            }}
          />
        </Tab.Navigator>
      </GestureHandlerRootView>
    );
  };

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
            title: "카드 설정",
          }}
        />
      </Stack.Navigator>
    );
  }

  function SettingNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            title: "환경 설정",
          }}
        />
        <Stack.Screen
          name="SettingsVoiceScreen"
          component={SettingsVoiceScreen}
          options={{
            title: "음성 설정",
          }}
        />
        <Stack.Screen
          name="SettingsLicenseScreen"
          component={SettingsLicenseScreen}
          options={{
            title: "오픈소스 라이선스",
          }}
        />
        <Stack.Screen
          name="RNGH"
          component={RNGH}
          options={{
            title: "실험실",
          }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <AuthContextProvider>
          <Root />
        </AuthContextProvider>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// Build
// android : eas build --platform android --profile preview
// ios : eas build --platform ios --profile production
// npm install -g eas-cli
