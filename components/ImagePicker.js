import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import {
  launchCameraAsync,
  PermissionStatus,
  useCameraPermissions,
} from "expo-image-picker";
import OutlinedButton from "./UI/OutlinedButton";
import { getWindowWidth } from "./UI/Dimensions";

const windowWidth = getWindowWidth();

export default function ImagePicker({ onTakeImage }) {
  const [cameraPermissionInformation, requestPermission] =
    useCameraPermissions();

  const [pickedImage, setPickedImage] = useState();

  async function verifyPermissions() {
    if (
      cameraPermissionInformation.status === PermissionStatus.UNDETERMINED ||
      cameraPermissionInformation.status === PermissionStatus.DENIED
    ) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert("권한 없음", "이 앱을 사용하려면 카메라 권한이 필요합니다");
      return false;
    }

    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    setPickedImage(image.assets[0].uri);
    onTakeImage(image.assets[0].uri);
  }

  let imagePreview = <Text>촬영된 사진이 없습니다</Text>;

  if (pickedImage) {
    imagePreview = <Image source={{ uri: pickedImage }} style={styles.image} />;
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlinedButton onPress={takeImageHandler} icon="camera">
        사진 촬영
      </OutlinedButton>
    </View>
  );
}

const styles = StyleSheet.create({
  imagePreview: {
    width: windowWidth - 48,
    height: windowWidth - 48,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "gray",
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
