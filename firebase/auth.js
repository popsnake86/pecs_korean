import { Alert } from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { firebaseConfig } from "./firebase";
import { auth } from "./firebase";

export async function createUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = userCredential._tokenResponse.idToken;
    const userID = userCredential.user.uid;
    return { token, userID };
  } catch (error) {
    Alert.alert("createUser error");
    console.log(error);
  }
}

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = userCredential._tokenResponse.idToken;
    const userID = userCredential.user.uid;
    return { token, userID };
  } catch (error) {
    if (error.code === "auth/invalid-credential") {
      Alert.alert(
        "로그인 실패",
        "로그인할 수 없습니다. 이메일, 비밀번호를 다시 확인해 주세요"
      );
    } else {
      Alert.alert("login error", error);
    }
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("signOut error", error);
  }
}
