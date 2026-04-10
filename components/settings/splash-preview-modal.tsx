import { Modal, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import { LoadingView } from "@/components/loading-view";
import { ThemedText } from "@/components/themed-text";

type SplashPreviewModalProps = {
  onClose: () => void;
  visible: boolean;
};

export function SplashPreviewModal({
  onClose,
  visible,
}: SplashPreviewModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      transparent={false}
      visible={visible}
    >
      <View style={styles.container}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <ThemedText type="meta">{t("common.cancel")}</ThemedText>
        </Pressable>
        <Pressable onPress={onClose} style={styles.preview}>
          <LoadingView />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 56,
    zIndex: 1,
    backgroundColor: "rgba(255, 248, 241, 0.92)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  preview: {
    flex: 1,
  },
});
