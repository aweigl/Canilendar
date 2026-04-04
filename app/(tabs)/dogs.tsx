import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { LoadingView } from "@/components/loading-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { InputField } from "@/components/ui/input-field";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useCanilendar } from "@/context/canilendar-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

const EMPTY_DOG = {
  name: "",
  address: "",
  ownerPhone: "",
  notes: "",
};

export default function DogsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const { dogs, appointments, isLoaded, saveDog, deleteDog } = useCanilendar();
  const [isEditing, setIsEditing] = useState(false);
  const [editingDogId, setEditingDogId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_DOG);

  useEffect(() => {
    if (isLoaded && dogs.length === 0) {
      setIsEditing(true);
    }
  }, [dogs.length, isLoaded]);

  if (!isLoaded) {
    return <LoadingView />;
  }

  function resetForm() {
    setEditingDogId(null);
    setForm(EMPTY_DOG);
    setIsEditing(false);
  }

  function beginCreateDog() {
    setEditingDogId(null);
    setForm(EMPTY_DOG);
    setIsEditing(true);
  }

  function beginEditDog(dogId: string) {
    const dog = dogs.find((item) => item.id === dogId);

    if (!dog) {
      return;
    }

    setEditingDogId(dog.id);
    setForm({
      name: dog.name,
      address: dog.address,
      ownerPhone: dog.ownerPhone,
      notes: dog.notes ?? "",
    });
    setIsEditing(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.address.trim() || !form.ownerPhone.trim()) {
      Alert.alert(
        t("dogs.alerts.missingDogDetailsTitle"),
        t("dogs.alerts.missingDogDetailsBody"),
      );
      return;
    }

    saveDog({
      id: editingDogId ?? undefined,
      name: form.name,
      address: form.address,
      ownerPhone: form.ownerPhone,
      notes: form.notes,
    });

    resetForm();
  }

  function handleDelete(dogId: string) {
    const dog = dogs.find((item) => item.id === dogId);

    if (!dog) {
      return;
    }

    Alert.alert(
      t("dogs.alerts.deleteTitle", { name: dog.name }),
      t("dogs.alerts.deleteBody"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => {
            const didDelete = deleteDog(dogId);

            if (!didDelete) {
              Alert.alert(
                t("dogs.alerts.stillScheduledTitle"),
                t("dogs.alerts.stillScheduledBody"),
              );
            }
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: palette.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <ThemedText
              type="eyebrow"
              lightColor={palette.support}
              darkColor={palette.support}
            >
              {t("dogs.eyebrow")}
            </ThemedText>
            <ThemedText type="title" style={styles.title}>
              {t("dogs.title")}
            </ThemedText>
            <ThemedText
              lightColor={palette.textMuted}
              darkColor={palette.textMuted}
            >
              {t("dogs.description")}
            </ThemedText>
          </View>
          <AppButton
            label={isEditing ? t("common.cancel") : t("dogs.addDog")}
            onPress={isEditing ? resetForm : beginCreateDog}
            variant={isEditing ? "secondary" : "primary"}
            icon={isEditing ? "square.and.pencil" : "plus.circle.fill"}
          />
        </View>

        {isEditing ? (
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
            <AppButton
              label={editingDogId ? t("dogs.saveChanges") : t("dogs.createDog")}
              onPress={handleSave}
              icon={editingDogId ? "square.and.pencil" : "plus.circle.fill"}
            />
          </ThemedView>
        ) : null}

        <View style={styles.list}>
          {dogs.length === 0 ? (
            <ThemedView
              style={[
                styles.emptyState,
                {
                  backgroundColor: palette.surface,
                  borderColor: palette.border,
                },
              ]}
            >
              <ThemedText type="sectionTitle" style={styles.emptyTitle}>
                {t("dogs.emptyTitle")}
              </ThemedText>
              <ThemedText
                lightColor={palette.textMuted}
                darkColor={palette.textMuted}
              >
                {t("dogs.emptyDescription")}
              </ThemedText>
            </ThemedView>
          ) : (
            dogs.map((dog) => {
              const appointmentCount = appointments.filter(
                (appointment) => appointment.dogId === dog.id,
              ).length;

              return (
                <View
                  key={dog.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: palette.surface,
                      borderColor: palette.accent,
                      shadowColor: palette.shadow,
                    },
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardCopy}>
                      <ThemedText type="sectionTitle" style={styles.cardTitle}>
                        {dog.name}
                      </ThemedText>
                      <ThemedText
                        lightColor={palette.textMuted}
                        darkColor={palette.textMuted}
                      >
                        {dog.address}
                      </ThemedText>
                      <ThemedText
                        lightColor={palette.textMuted}
                        darkColor={palette.textMuted}
                      >
                        {dog.ownerPhone}
                      </ThemedText>
                    </View>
                    <View
                      style={[
                        styles.countPill,
                        {
                          backgroundColor: palette.supportSoft,
                          borderColor: palette.support,
                        },
                      ]}
                    >
                      <ThemedText
                        lightColor={palette.onSupport}
                        darkColor={palette.onSupport}
                        style={styles.countText}
                      >
                        {t("dogs.upcomingAppointments", { count: appointmentCount })}
                      </ThemedText>
                    </View>
                  </View>

                  {dog.notes ? (
                    <ThemedText
                      lightColor={palette.textMuted}
                      darkColor={palette.textMuted}
                    >
                      {dog.notes}
                    </ThemedText>
                  ) : null}

                  <View style={styles.actions}>
                    <AppButton
                      label={t("common.edit")}
                      onPress={() => beginEditDog(dog.id)}
                      variant="secondary"
                      icon="square.and.pencil"
                    />
                    <AppButton
                      label={t("common.delete")}
                      onPress={() => handleDelete(dog.id)}
                      variant="ghost"
                      icon="trash.fill"
                    />
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    gap: Spacing.md,
    padding: 20,
    paddingBottom: 140,
  },
  header: {
    gap: Spacing.md,
  },
  headerCopy: {
    gap: Spacing.xs,
  },
  title: {
    fontSize: 34,
  },
  editor: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.sm,
    padding: 18,
  },
  editorTitle: {
    fontSize: 22,
  },
  list: {
    gap: Spacing.sm,
  },
  emptyState: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.xs,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 22,
  },
  card: {
    borderRadius: Radius.card,
    borderWidth: 2.5,
    gap: Spacing.sm,
    padding: 18,
    marginBottom: 2,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2,
  },
  cardHeader: {
    gap: Spacing.xs,
  },
  cardCopy: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 28,
    lineHeight: 32,
  },
  countPill: {
    alignSelf: "flex-start",
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
});
