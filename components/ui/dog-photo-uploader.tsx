import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { IconSymbol } from "./icon-symbol";

export function DogPhotoUploader({
  name,
  photoUri,
  busy = false,
  onPickFromCamera,
  onPickFromLibrary,
  onRemove,
  style,
}: {
  name: string;
  photoUri?: string | null;
  busy?: boolean;
  onPickFromCamera?: () => void;
  onPickFromLibrary?: () => void;
  onRemove?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const hasPhoto = Boolean(photoUri);
  const previewName = name.trim() || t("appointment.dogName");

  function openSourcePicker() {
    if (busy) {
      return;
    }

    Alert.alert(t("dogs.photoLabel"), t("dogs.photoHint"), [
      {
        text: t("dogs.addFromCamera"),
        onPress: () => {
          onPickFromCamera?.();
        },
      },
      {
        text: t("dogs.chooseFromLibrary"),
        onPress: () => {
          onPickFromLibrary?.();
        },
      },
      { text: t("common.cancel"), style: "cancel" },
    ]);
  }

  return (
    <View style={[styles.wrapper, style]}>
      <Pressable
        accessibilityHint={t("dogs.photoHint")}
        accessibilityLabel={t("dogs.photoLabel")}
        accessibilityRole="button"
        disabled={busy}
        onPress={openSourcePicker}
        style={({ pressed }) => [
          styles.panel,
          {
            backgroundColor: hasPhoto
              ? palette.surfaceMuted
              : palette.surfaceRaised,
            borderColor: hasPhoto ? palette.borderStrong : palette.border,
            opacity: busy ? 0.72 : 1,
            transform: [{ scale: pressed ? 0.985 : 1 }],
          },
        ]}
      >
        {hasPhoto ? (
          <>
            <Image
              source={photoUri}
              contentFit="cover"
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.imageShade} />
            <Pressable
              accessibilityLabel={t("dogs.changePhoto")}
              accessibilityRole="button"
              disabled={busy}
              onPress={openSourcePicker}
              style={[
                styles.editButton,
                {
                  backgroundColor: "rgba(251, 244, 234, 0.94)",
                  borderColor: palette.border,
                },
              ]}
            >
              <IconSymbol name="camera.fill" size={16} color={palette.accent} />
            </Pressable>
            <View style={styles.photoFooter}>
              <ThemedText
                type="defaultSemiBold"
                lightColor={palette.onAccent}
                darkColor={palette.onAccent}
              >
                {previewName}
              </ThemedText>
              <ThemedText
                type="caption"
                lightColor={palette.onAccent}
                darkColor={palette.onAccent}
              >
                {t("dogs.changePhotoHint")}
              </ThemedText>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <View
              style={[
                styles.emptyBadge,
                {
                  backgroundColor: palette.accentSoft,
                  borderColor: palette.accentMuted,
                },
              ]}
            >
              <IconSymbol name="camera.fill" size={24} color={palette.accent} />
            </View>
            <ThemedText
              lightColor={palette.textMuted}
              darkColor={palette.textMuted}
              type="subtitle"
              style={styles.emptyTitle}
            >
              {t("dogs.addPhotoTitle")}
            </ThemedText>
          </View>
        )}
      </Pressable>

      {hasPhoto ? (
        <Pressable
          accessibilityLabel={t("dogs.removePhoto")}
          accessibilityRole="button"
          disabled={busy}
          onPress={onRemove}
          style={styles.removeAction}
        >
          <IconSymbol
            name="cancel.fill.circle"
            size={16}
            color={palette.textMuted}
          />
          <ThemedText
            type="caption"
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
            style={styles.removeLabel}
          >
            {t("dogs.removePhoto")}
          </ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.sm,
  },
  panel: {
    borderRadius: Radius.controlLarge,
    borderWidth: 1,
    minHeight: 208,
    overflow: "hidden",
    position: "relative",
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  emptyBadge: {
    alignItems: "center",
    borderRadius: Radius.pill,
    borderWidth: 1,
    height: 64,
    justifyContent: "center",
    marginBottom: Spacing.md,
    width: 64,
  },
  emptyTitle: {
    textAlign: "center",
  },
  emptyBody: {
    marginTop: Spacing.xs,
    maxWidth: 220,
    textAlign: "center",
  },
  imageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(28, 19, 13, 0.18)",
  },
  editButton: {
    alignItems: "center",
    borderRadius: Radius.pill,
    borderWidth: 1,
    height: 38,
    justifyContent: "center",
    position: "absolute",
    right: Spacing.sm,
    top: Spacing.sm,
    width: 38,
  },
  photoFooter: {
    bottom: Spacing.md,
    left: Spacing.md,
    position: "absolute",
    right: Spacing.md,
  },
  removeAction: {
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    paddingVertical: 4,
  },
  removeLabel: {
    fontFamily: Fonts.sans,
    marginLeft: 6,
  },
});
