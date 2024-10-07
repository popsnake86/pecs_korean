import { useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, Platform } from "react-native";
import { enableScreens } from "react-native-screens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import PecsScreen from "./screens/PecsScreen";
import DeckManagementScreen from "./screens/DeckManagementScreen";
import AddCardScreen from "./screens/AddCardScreen";
import SettingsScreen from "./screens/SettingsScreen";
import AuthContextProvider, { AuthContext } from "./store/auth-context";

if (Platform.OS === "android") {
  enableScreens(true);
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
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
            component={SettingsScreen}
            options={{
              title: "환경설정",
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
