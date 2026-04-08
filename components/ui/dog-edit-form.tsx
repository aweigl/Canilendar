import { Colors, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { type DogFormState } from "@/lib/dog-photos";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { AppButton } from "./app-button";
import { DogAvatar } from "./dog-avatar";
import { InputField } from "./input-field";
import { KeyboardAwareScrollView } from "./keyboard-aware-scroll-view";

export const DogEditForm = ({
  editingDogId,
  form,
  style,
  setForm,
  handleSave,
  cancelEdit,
  pickFromCamera,
  pickFromLibrary,
  removePhoto,
  photoBusy = false,
}: {
  editingDogId: string | null;
  form: DogFormState;
  style?: StyleProp<ViewStyle>;
  setForm: React.Dispatch<React.SetStateAction<DogFormState>>;
  cancelEdit?: () => void;
  handleSave?: () => void;
  pickFromCamera?: () => void;
  pickFromLibrary?: () => void;
  removePhoto?: () => void;
  photoBusy?: boolean;
}) => {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? "light"];

  const { t } = useTranslation();
  const previewName = form.name.trim() || t("appointment.dogName");

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        style,
        { gap: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.md },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
    >
      <ThemedView
        style={[
          styles.editor,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
        ]}
      >
        <ThemedText type="sectionTitle" style={styles.editorTitle}>
          {editingDogId ? t("dogs.editorEditTitle") : t("dogs.editorAddTitle")}
        </ThemedText>
        <View
          style={[
            styles.photoSection,
            {
              backgroundColor: palette.surfaceRaised,
              borderColor: palette.border,
            },
          ]}
        >
          <View style={styles.photoPreviewRow}>
            <DogAvatar name={previewName} photoUri={form.photoUri} size={96} />
            <View style={styles.photoCopy}>
              <ThemedText type="defaultSemiBold">
                {t("dogs.photoLabel")}
              </ThemedText>
              <ThemedText
                type="caption"
                lightColor={palette.textMuted}
                darkColor={palette.textMuted}
              >
                {t("dogs.photoHint")}
              </ThemedText>
            </View>
          </View>
          <View style={styles.photoActions}>
            <AppButton
              disabled={photoBusy}
              icon="camera.fill"
              label={t("dogs.addFromCamera")}
              onPress={() => pickFromCamera?.()}
              style={styles.photoButton}
              variant="secondary"
            />
            <AppButton
              disabled={photoBusy}
              icon="photo.fill"
              label={t("dogs.chooseFromLibrary")}
              onPress={() => pickFromLibrary?.()}
              style={styles.photoButton}
              variant="secondary"
            />
            {form.photoUri ? (
              <AppButton
                disabled={photoBusy}
                icon="cancel.fill.circle"
                label={t("dogs.removePhoto")}
                onPress={() => removePhoto?.()}
                style={styles.photoButton}
                variant="ghost"
              />
            ) : null}
          </View>
        </View>
        <InputField
          label={t("appointment.dogName")}
          onChangeText={(value) =>
            setForm((current) => ({ ...current, name: value }))
          }
          placeholder={t("dogs.placeholders.dogName")}
          value={form.name}
        />
        <InputField
          label={t("appointment.pickupAddress")}
          onChangeText={(value) =>
            setForm((current) => ({ ...current, address: value }))
          }
          placeholder={t("dogs.placeholders.pickupAddress")}
          value={form.address}
        />
        <InputField
          keyboardType="phone-pad"
          label={t("appointment.ownerPhone")}
          onChangeText={(value) =>
            setForm((current) => ({ ...current, ownerPhone: value }))
          }
          placeholder={t("dogs.placeholders.ownerPhone")}
          value={form.ownerPhone}
        />
        <InputField
          label={t("dogs.notes")}
          multiline
          onChangeText={(value) =>
            setForm((current) => ({ ...current, notes: value }))
          }
          placeholder={t("dogs.placeholders.notes")}
          value={form.notes}
        />
        {handleSave ? (
          <AppButton
            style={{ marginTop: Spacing.lg }}
            label={t("dogs.saveChanges")}
            icon={"square.and.pencil"}
            onPress={handleSave}
          />
        ) : null}
        {cancelEdit ? (
          <AppButton
            variant="secondary"
            icon="cancel.fill.circle"
            onPress={cancelEdit}
            label={t("dogs.cancel")}
            style={{ marginTop: Spacing.lg }}
          />
        ) : null}
      </ThemedView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  editor: {
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: Spacing.md,
    padding: 24,
  },
  editorTitle: {
    fontSize: 22,
  },
  photoSection: {
    borderRadius: Radius.controlLarge,
    borderWidth: 1,
    gap: Spacing.md,
    padding: Spacing.md,
  },
  photoPreviewRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.md,
  },
  photoCopy: {
    flex: 1,
    gap: Spacing.xs,
  },
  photoActions: {
    gap: Spacing.sm,
  },
  photoButton: {
    width: "100%",
  },
});
