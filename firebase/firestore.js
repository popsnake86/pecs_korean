import { Alert } from "react-native";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  orderBy,
  limit,
  query,
  updateDoc,
  where,
  deleteDoc,
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
        order: item.data().order,
      });
    });
    return result;
  } catch (error) {
    Alert.alert("getCards error:");
    console.log(error);
    return [];
  }
};

export const addCard = async (userID, cardName, imageUrl, isFolder, parent) => {
  try {
    const fileName = imageUrl.split("/").pop();
    const order = await getLastOrderNumber(userID, parent);

    const result = await setDoc(doc(collection(db, "cards")), {
      userID: userID,
      cardName: cardName,
      imageUrl: fileName,
      isFolder: isFolder,
      parent: parent,
      order: order + 1,
    });
  } catch (error) {
    Alert.alert("addCard error");
    console.log("addCard error", error);
  }
};

export const editCard = async (userID, cardId, cardName, imageUrl, parent) => {
  try {
    const fileName = imageUrl.split("/").pop();
    const order = await getLastOrderNumber(userID, parent);

    const result = await updateDoc(doc(db, "cards", cardId), {
      cardName: cardName,
      imageUrl: fileName,
      parent: parent,
      isFolder: false,
      order: order + 1,
    });
  } catch (error) {
    Alert.alert("editCard error");
    console.log("editCard error", error);
  }
};

export const deleteCard = async (cardId) => {
  try {
    const cardRef = doc(db, "cards", cardId);
    await deleteDoc(cardRef);
  } catch (error) {
    Alert.alert("deleteCard error");
    console.log("deleteCard error", error);
  }
};

export const updateOrder = async (cardId, order) => {
  try {
    const cardRef = doc(db, "cards", cardId);
    await setDoc(cardRef, { order: order }, { merge: true });
  } catch (error) {
    Alert.alert("updateOrder error");
    console.log(error);
  }
};

const getLastOrderNumber = async (userID, parent) => {
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
    return order;
  } catch (error) {
    Alert.alert("getLastOrderNumber error");
    console.log(error);
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
    console.log(error);
  }
};
