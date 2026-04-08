import { Colors, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { AppButton } from "./app-button";
import { InputField } from "./input-field";

export const DogEditForm = ({
  editingDogId,
  form,
  style,
  setForm,
  handleSave,
  cancelEdit,
}: {
  editingDogId: string | null;
  form: {
    name: string;
    address: string;
    ownerPhone: string;
    notes: string;
  };
  style?: StyleProp<ViewStyle>;
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      address: string;
      ownerPhone: string;
      notes: string;
    }>
  >;
  cancelEdit?: () => void;
  handleSave?: () => void;
}) => {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? "light"];

  const { t } = useTranslation();

  return (
    <ScrollView
      contentContainerStyle={[
        style,
        { gap: Spacing.xl, paddingTop: Spacing.md, paddingBottom: Spacing.md },
      ]}
      showsVerticalScrollIndicator={false}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  editor: {
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: Spacing.md,
    padding: 24,
  },
  editorTitle: {
    fontSize: 22,
  },
});
