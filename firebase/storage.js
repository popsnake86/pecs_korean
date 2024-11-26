import { Alert } from "react-native";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

export async function getCardImageUrl(userID, fileName) {
  const storageRef = ref(storage, `${userID}/cards/${fileName}`);
  const url = await getDownloadURL(storageRef);
  return url;
}

export async function storeStorage(userID, image) {
  if (!image) return;

  try {
    const fileName = image.split("/").pop();
    const storageRef = ref(storage, `${userID}/cards/${fileName}`);
    const response = await fetch(image);
    const blob = await response.blob();

    await uploadBytes(storageRef, blob)
      .then(() => {
        return true;
      })
      .catch((error) => {
        Alert.alert("uploadBytes Error");
        return false;
      });
  } catch (error) {
    Alert.alert("storeStorage Error");
    console.error(error);
  }
}

export async function deleteStorage(userID, image) {
  try {
    const fileName = image.split("/").pop();
    const storageRef = ref(storage, `${userID}/cards/${fileName}`);

    await deleteObject(storageRef).then(() => {
      return true;
    });
  } catch (error) {
    Alert.alert("storeStorage Error");
    console.error(error);
  }
}
