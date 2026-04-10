import { Colors, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { type DogFormState } from "@/lib/dog-photos";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { AddressAutocompleteField } from "./address-autocomplete-field";
import { AppButton } from "./app-button";
import { DogPhotoUploader } from "./dog-photo-uploader";
import { InputField } from "./input-field";
import { KeyboardAwareScrollView } from "./keyboard-aware-scroll-view";

export type DogEditFormProps = {
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
};

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
}: DogEditFormProps) => {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? "light"];
  const { t } = useTranslation();

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
        {cancelEdit ? (
          <AppButton
            variant="ghost"
            icon="chevron.left"
            onPress={cancelEdit}
            label={t("dogs.cancel")}
            style={styles.backButton}
          />
        ) : null}
        <ThemedText type="sectionTitle" style={styles.editorTitle}>
          {editingDogId ? t("dogs.editorEditTitle") : t("dogs.editorAddTitle")}
        </ThemedText>

        <DogPhotoUploader
          busy={photoBusy}
          name={form.name}
          onPickFromCamera={pickFromCamera}
          onPickFromLibrary={pickFromLibrary}
          onRemove={removePhoto}
          photoUri={form.photoUri}
        />
        <InputField
          label={t("appointment.dogName")}
          onChangeText={(value) =>
            setForm((current) => ({ ...current, name: value }))
          }
          placeholder={t("dogs.placeholders.dogName")}
          value={form.name}
        />
        <AddressAutocompleteField
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
    marginBottom: Spacing.lg,
  },
  backButton: {
    alignSelf: "flex-start",
    minHeight: 40,
    paddingHorizontal: 0,
  },
});
