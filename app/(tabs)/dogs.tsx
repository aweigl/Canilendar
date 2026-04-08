import { usePostHog } from "posthog-react-native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LoadingView } from "@/components/loading-view";
import { ThemedText } from "@/components/themed-text";
import { DogEditForm } from "@/components/ui/dog-edit-form";
import { DogTable } from "@/components/ui/dog-table";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useCanilendar } from "@/context/canilendar-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  cleanupReplacedDraftDogPhoto,
  createDogFormState,
  createEmptyDogForm,
  deleteDogPhoto,
  discardDraftDogPhoto,
  pickDogPhoto,
  type DogFormState,
  type DogPhotoErrorReason,
  type DogPhotoSource,
} from "@/lib/dog-photos";

const EMPTY_DOG = createEmptyDogForm();

export default function DogsScreen() {
  const { t } = useTranslation();
  const posthog = usePostHog();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const { deleteDog, dogs, isLoaded, markChecklistStepSeen, saveDog } =
    useCanilendar();
  const [isEditing, setIsEditing] = useState(false);
  const [editingDogId, setEditingDogId] = useState<string | null>(null);
  const [form, setForm] = useState<DogFormState>(EMPTY_DOG);
  const [photoBusy, setPhotoBusy] = useState(false);
  const originalPhotoUriRef = useRef<string | null>(null);
  const latestPhotoUriRef = useRef<string | null>(null);

  useEffect(() => {
    latestPhotoUriRef.current = form.photoUri;
  }, [form.photoUri]);

  useEffect(() => {
    if (isLoaded && dogs.length === 0) {
      setIsEditing(true);
    }
  }, [dogs.length, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      markChecklistStepSeen("dogs");
    }
  }, [isLoaded, markChecklistStepSeen]);

  useEffect(() => {
    return () => {
      discardDraftDogPhoto({
        currentPhotoUri: latestPhotoUriRef.current,
        originalPhotoUri: originalPhotoUriRef.current,
      });
    };
  }, []);

  if (!isLoaded) {
    return <LoadingView />;
  }

  function syncFormFromDog(dog?: (typeof dogs)[number] | null) {
    const nextForm = createDogFormState(dog);

    originalPhotoUriRef.current = nextForm.photoUri;
    latestPhotoUriRef.current = nextForm.photoUri;
    setEditingDogId(dog?.id ?? null);
    setForm(nextForm);
  }

  function resetForm() {
    originalPhotoUriRef.current = null;
    latestPhotoUriRef.current = null;
    setEditingDogId(null);
    setForm(EMPTY_DOG);
    setIsEditing(false);
  }

  function beginCreateDog() {
    syncFormFromDog(null);
    setIsEditing(true);
  }

  function beginEditDog(dogId: string) {
    const dog = dogs.find((item) => item.id === dogId);

    if (!dog) {
      return;
    }

    syncFormFromDog(dog);
    setIsEditing(true);
  }

  function showPhotoError(reason: DogPhotoErrorReason) {
    const keyPrefix =
      reason === "camera-permission"
        ? "cameraPermission"
        : reason === "library-permission"
          ? "libraryPermission"
          : "photoProcessing";

    Alert.alert(
      t(`dogs.alerts.${keyPrefix}Title`),
      t(`dogs.alerts.${keyPrefix}Body`),
    );
  }

  async function handlePickPhoto(source: DogPhotoSource) {
    setPhotoBusy(true);

    const result = await pickDogPhoto(source);

    setPhotoBusy(false);

    if (result.canceled) {
      return;
    }

    if ("errorReason" in result) {
      showPhotoError(result.errorReason);
      return;
    }

    await cleanupReplacedDraftDogPhoto({
      currentPhotoUri: latestPhotoUriRef.current,
      nextPhotoUri: result.photoUri,
      originalPhotoUri: originalPhotoUriRef.current,
    });

    latestPhotoUriRef.current = result.photoUri;
    setForm((current) => ({ ...current, photoUri: result.photoUri }));
  }

  function handleRemovePhoto() {
    const currentPhotoUri = latestPhotoUriRef.current;

    if (currentPhotoUri && currentPhotoUri !== originalPhotoUriRef.current) {
      deleteDogPhoto(currentPhotoUri);
    }

    latestPhotoUriRef.current = null;
    setForm((current) => ({ ...current, photoUri: null }));
  }

  function handleSave() {
    if (!form.name.trim() || !form.address.trim() || !form.ownerPhone.trim()) {
      Alert.alert(
        t("dogs.alerts.missingDogDetailsTitle"),
        t("dogs.alerts.missingDogDetailsBody"),
      );
      return;
    }

    const savedDog = saveDog({
      id: editingDogId ?? undefined,
      name: form.name,
      address: form.address,
      ownerPhone: form.ownerPhone,
      notes: form.notes,
      photoUri: form.photoUri ?? undefined,
    });

    if (!savedDog) {
      return;
    }

    originalPhotoUriRef.current = savedDog.photoUri ?? null;
    latestPhotoUriRef.current = savedDog.photoUri ?? null;

    posthog.capture("dog_saved", {
      is_edit: Boolean(editingDogId),
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

            if (didDelete) {
              posthog.capture("dog_deleted");
            } else {
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

  const cancelEdit = () => {
    discardDraftDogPhoto({
      currentPhotoUri: latestPhotoUriRef.current,
      originalPhotoUri: originalPhotoUriRef.current,
    });
    resetForm();
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[
        styles.safeArea,
        {
          backgroundColor: palette.background,
        },
      ]}
    >
      <View style={(styles.header, { padding: Spacing.md })}>
        <View style={styles.headerCopy}>
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
      </View>
      {isEditing ? (
        <DogEditForm
          style={{
            paddingLeft: Spacing.lg,
            paddingRight: Spacing.lg,
          }}
          editingDogId={editingDogId}
          form={form}
          setForm={setForm}
          cancelEdit={cancelEdit}
          handleSave={handleSave}
          pickFromCamera={() => {
            handlePickPhoto("camera");
          }}
          pickFromLibrary={() => {
            handlePickPhoto("library");
          }}
          removePhoto={handleRemovePhoto}
          photoBusy={photoBusy}
        />
      ) : (
        <>
          <DogTable
            style={{
              paddingLeft: Spacing.lg,
              paddingRight: Spacing.lg,
            }}
            dogs={dogs}
            editDog={beginEditDog}
            deleteDog={handleDelete}
          />
          <Pressable
            accessibilityLabel={t("home.newAppointment")}
            accessibilityRole="button"
            onPress={beginCreateDog}
            style={({ pressed }) => [
              styles.fab,
              {
                backgroundColor: pressed
                  ? palette.accentPressed
                  : palette.accent,
                bottom: Spacing.md,
                borderColor: palette.accentPressed,
                shadowColor: palette.shadow,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              },
            ]}
          >
            <IconSymbol name="user.plus" size={28} color={palette.onAccent} />
          </Pressable>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    gap: Spacing.xl,
    padding: 24,
  },
  header: {
    gap: Spacing.lg,
  },
  headerCopy: {
    gap: Spacing.sm,
  },
  title: {
    fontSize: 34,
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
  list: {
    gap: Spacing.md,
  },
  emptyState: {
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: Spacing.sm,
    padding: 24,
  },
  emptyTitle: {
    fontSize: 22,
  },
  card: {
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: Spacing.md,
    padding: 22,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2,
  },
  cardHeader: {
    gap: Spacing.sm,
  },
  cardCopy: {
    gap: 6,
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
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  fab: {
    alignItems: "center",
    borderRadius: Radius.pill,
    borderWidth: 1,
    height: 62,
    justifyContent: "center",
    position: "absolute",
    right: 20,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    width: 62,
    elevation: 5,
  },
});
