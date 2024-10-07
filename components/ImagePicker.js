import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import {
  launchCameraAsync,
  launchImageLibraryAsync,
  PermissionStatus,
  useCameraPermissions,
  useMediaLibraryPermissions,
} from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import OutlinedButton from "./UI/OutlinedButton";
import { getWindowWidth } from "./UI/Dimensions";

const windowWidth = getWindowWidth();

export default function ImagePicker({ onTakeImage, prevImage }) {
  const [cameraPermissionInformation, requestCameraPermission] =
    useCameraPermissions();
  const [mediaLibraryPermissionInformation, requestMediaLibraryPermission] =
    useMediaLibraryPermissions();

  const [previImage, setPreviImage] = useState(prevImage);
  const [pickedImage, setPickedImage] = useState();
  const localUri = `${FileSystem.cacheDirectory}${prevImage}`;

  async function verifyCameraPermissions() {
    if (
      cameraPermissionInformation.status === PermissionStatus.UNDETERMINED ||
      cameraPermissionInformation.status === PermissionStatus.DENIED
    ) {
      const permissionResponse = await requestCameraPermission();
      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert("권한 없음", "이 앱을 사용하려면 카메라 권한이 필요합니다");
      return false;
    }

    return true;
  }

  async function verifyMediaLibraryPermissions() {
    if (
      mediaLibraryPermissionInformation.status ===
        PermissionStatus.UNDETERMINED ||
      mediaLibraryPermissionInformation.status === PermissionStatus.DENIED
    ) {
      const permissionResponse = await requestMediaLibraryPermission();
      return permissionResponse.granted;
    }

    if (mediaLibraryPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "권한 없음",
        "이 앱을 사용하려면 갤러리 접근 권한이 필요합니다"
      );
      return false;
    }

    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyCameraPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
    });

    setPreviImage(null);
    setPickedImage(image.assets[0].uri);
    onTakeImage(image.assets[0].uri);
  }

  async function pickImageHandler() {
    const hasPermission = await verifyMediaLibraryPermissions();

    if (!hasPermission) {
      return;
    }

    const image = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.3,
    });

    if (!image.canceled) {
      setPreviImage(null);
      setPickedImage(image.assets[0].uri);
      onTakeImage(image.assets[0].uri);
    }
  }

  let imagePreview = <Text>촬영된 사진이 없습니다</Text>;

  if (previImage) {
    imagePreview = <Image source={{ uri: localUri }} style={styles.image} />;
  }

  if (pickedImage) {
    imagePreview = <Image source={{ uri: pickedImage }} style={styles.image} />;
  }

  return (
    <View>
      <View style={styles.imagePreview}>{imagePreview}</View>
      <OutlinedButton onPress={takeImageHandler} icon="camera">
        사진 촬영
      </OutlinedButton>
      <OutlinedButton onPress={pickImageHandler} icon="image">
        갤러리에서 이미지 선택
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
