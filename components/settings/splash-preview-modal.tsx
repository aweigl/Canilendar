import { Image, Modal, Pressable, StyleSheet } from "react-native";

type SplashPreviewModalProps = {
  onClose: () => void;
  visible: boolean;
};

export function SplashPreviewModal({
  onClose,
  visible,
}: SplashPreviewModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent={false}
      visible={visible}
    >
      <Pressable onPress={onClose} style={styles.splashPreview}>
        <Image
          resizeMode="contain"
          source={require("../../assets/images/splash-screen.png")}
          style={styles.splashImage}
        />
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  splashPreview: {
    alignItems: "center",
    backgroundColor: "#F8F1E6",
    flex: 1,
    justifyContent: "center",
  },
  splashImage: {
    height: 400,
  },
});
