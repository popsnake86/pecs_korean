import { Alert } from "react-native";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  orderBy,
  limit,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "./firebase";

export const getCards = async (userID, parent) => {
  try {
    const q = query(
      collection(db, "cards"),
      where("userID", "==", userID),
      where("parent", "==", parent),
      orderBy("order", "asc")
    );
    const querySnapshot = await getDocs(q);

    let result = [];
    querySnapshot.forEach((item) => {
      result.push({
        key: item.id,
        cardId: item.id,
        cardName: item.data().cardName,
        imageUrl: item.data().imageUrl,
        parent: item.data().parent,
        isFolder: item.data().isFolder,
        isEnabled: item.data().isEnabled,
        order: item.data().order,
      });
    });
    return result;
  } catch (error) {
    Alert.alert("getCards error:");
    console.error(error);
    return [];
  }
};

export const addCard = async (
  userID,
  cardName,
  imageUrl,
  isFolder,
  isEnabled,
  parent,
  order
) => {
  try {
    const fileName = imageUrl.split("/").pop();
    //const order = await getLastOrderNumber(userID, parent);

    const result = await setDoc(doc(collection(db, "cards")), {
      userID: userID,
      cardName: cardName,
      imageUrl: fileName,
      isFolder: isFolder,
      parent: parent,
      //order: order + 1,
      order: order,
      isEnabled: isEnabled,
    });
  } catch (error) {
    Alert.alert("addCard error");
    console.error("addCard error", error);
  }
};

export const editCard = async (
  userID,
  cardId,
  cardName,
  imageUrl,
  isEnabled,
  parent,
  order
) => {
  try {
    const fileName = imageUrl.split("/").pop();
    //const order = await getLastOrderNumber(userID, parent);

    const result = await updateDoc(doc(db, "cards", cardId), {
      cardName: cardName,
      imageUrl: fileName,
      parent: parent,
      //order: order + 1,
      order: order,
      isEnabled: isEnabled,
    });
  } catch (error) {
    Alert.alert("editCard error");
    console.error("editCard error", error);
  }
};

export const massEditCard = async () => {
  try {
    const batch = writeBatch(db);
    const ref = collection(db, "cards");

    const querySnapshot = await getDocs(ref);
    querySnapshot.forEach((docSnapshot) => {
      const docRef = doc(db, "cards", docSnapshot.id);
      batch.update(docRef, { isEnabled: true });
    });

    await batch.commit();
  } catch (error) {
    console.error("massEditCard error", error);
  }
};
//massEditCard();

export const deleteCard = async (cardId) => {
  try {
    const cardRef = doc(db, "cards", cardId);
    await deleteDoc(cardRef);
  } catch (error) {
    Alert.alert("deleteCard error");
    console.error("deleteCard error", error);
  }
};

export const updateOrder = async (cardId, order) => {
  try {
    const cardRef = doc(db, "cards", cardId);
    await setDoc(cardRef, { order: order }, { merge: true });
  } catch (error) {
    Alert.alert("updateOrder error");
    console.error(error);
  }
};

export const getLastOrderNumber = async (userID, parent) => {
  try {
    let order = 0;

    const q = query(
      collection(db, "cards"),
      where("userID", "==", userID),
      where("parent", "==", parent),
      orderBy("order", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return order;
    }

    querySnapshot.forEach((item) => {
      order = item.data().order;
    });
    return order + 1;
  } catch (error) {
    Alert.alert("getLastOrderNumber error");
    console.error(error);
    return 9999;
  }
};

export const getFolderList = async (userID) => {
  try {
    const q = query(
      collection(db, "cards"),
      where("userID", "==", userID),
      where("parent", "==", ""),
      where("isFolder", "==", true),
      orderBy("order", "asc")
    );
    const querySnapshot = await getDocs(q);

    let result = [];
    querySnapshot.forEach((item) => {
      result.push({
        cardId: item.id,
        cardName: item.data().cardName,
      });
    });
    return result;
  } catch (error) {
    Alert.alert("getFolderList error");
    console.error(error);
  }
};

export const isEmptyUnderTheFolder = async (userID, parent) => {
  try {
    const q = query(
      collection(db, "cards"),
      where("userID", "==", userID),
      where("parent", "==", parent)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    Alert.alert("isEmptyUnderTheFolder error");
    console.error(error);
    return false;
  }
};

export const getSpeechRateList = async () => {
  try {
    const ref = collection(db, "settings/list/speechRate");
    const querySnapshot = await getDocs(ref);

    let result = [];
    querySnapshot.forEach((item) => {
      result.push({
        code: item.id,
        description: item.data().description,
      });
    });
    return result;
  } catch (error) {
    Alert.alert("getSpeechRateList error:");
    console.error(error);
    return [];
  }
};

export const getSpeechRate = async (userID) => {
  try {
    const ref = doc(db, "settings", userID);
    const result = await getDoc(ref);
    return result.data().speechRate;
  } catch (error) {
    Alert.alert("getSpeechRate error");
    console.error(error);
  }
};

export const editSpeechRate = async (userID, speechRate) => {
  try {
    const ref = doc(db, "settings", userID);
    await setDoc(ref, { speechRate: speechRate }, { merge: true });
  } catch (error) {
    Alert.alert("setSpeechRate error");
    console.error(error);
  }
};

export const getSpeechPitchList = async () => {
  try {
    const ref = collection(db, "settings/list/speechPitch");
    const querySnapshot = await getDocs(ref);

    let result = [];
    querySnapshot.forEach((item) => {
      result.push({
        code: item.id,
        description: item.data().description,
      });
    });
    return result;
  } catch (error) {
    Alert.alert("getSpeechPitchList error:");
    console.error(error);
    return [];
  }
};

export const getSpeechPitch = async (userID) => {
  try {
    const ref = doc(db, "settings", userID);
    const result = await getDoc(ref);
    return result.data().speechPitch;
  } catch (error) {
    Alert.alert("getSpeechPitch error");
    console.error(error);
  }
};

export const editSpeechPitch = async (userID, speechPitch) => {
  try {
    const ref = doc(db, "settings", userID);
    await setDoc(ref, { speechPitch: speechPitch }, { merge: true });
  } catch (error) {
    Alert.alert("setSpeechPitch error");
    console.error(error);
  }
};

export const getSpeechVolumeList = async () => {
  try {
    const ref = collection(db, "settings/list/speechVolume");
    const querySnapshot = await getDocs(ref);

    let result = [];
    querySnapshot.forEach((item) => {
      result.push({
        code: item.id,
        description: item.data().description,
      });
    });
    return result;
  } catch (error) {
    Alert.alert("getSpeechVolumeList error:");
    console.error(error);
    return [];
  }
};

export const getSpeechVolume = async (userID) => {
  try {
    const ref = doc(db, "settings", userID);
    const result = await getDoc(ref);
    return result.data().speechVolume;
  } catch (error) {
    Alert.alert("getSpeechVolume error");
    console.error(error);
  }
};

export const editSpeechVolume = async (userID, speechVolume) => {
  try {
    const ref = doc(db, "settings", userID);
    await setDoc(ref, { speechVolume: speechVolume }, { merge: true });
  } catch (error) {
    Alert.alert("setSpeechVolume error");
    console.error(error);
  }
};
