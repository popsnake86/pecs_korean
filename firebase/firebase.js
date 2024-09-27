import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase 프로젝트 설정 정보
export const firebaseConfig = {
  apiKey: "AIzaSyC0RiHrRUc2nNcqIPDHIC-R3YUOqGM_eio",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "pecs-korean",
  storageBucket: "pecs-korean.appspot.com",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
