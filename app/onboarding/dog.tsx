import { router } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet } from "react-native";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { DogAvatar } from "@/components/ui/dog-avatar";
import { InputField } from "@/components/ui/input-field";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useCanilendar } from "@/context/canilendar-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  cleanupReplacedDraftDogPhoto,
  deleteDogPhoto,
  discardDraftDogPhoto,
  pickDogPhoto,
  type DogPhotoErrorReason,
  type DogPhotoSource,
} from "@/lib/dog-photos";

export default function OnboardingDogScreen() {
  const { t } = useTranslation();
  const posthog = usePostHog();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const { dogs, saveDog } = useCanilendar();
  const seededDog = dogs[0];
  const [name, setName] = useState(seededDog?.name ?? "");
  const [address, setAddress] = useState(seededDog?.address ?? "");
  const [ownerPhone, setOwnerPhone] = useState(seededDog?.ownerPhone ?? "");
  const [notes, setNotes] = useState(seededDog?.notes ?? "");
  const [photoUri, setPhotoUri] = useState<string | null>(
    seededDog?.photoUri ?? null,
  );
  const [photoBusy, setPhotoBusy] = useState(false);
  const isEditing = useMemo(() => Boolean(seededDog), [seededDog]);
  const originalPhotoUriRef = useRef<string | null>(
    seededDog?.photoUri ?? null,
  );
  const latestPhotoUriRef = useRef<string | null>(seededDog?.photoUri ?? null);

  useEffect(() => {
    originalPhotoUriRef.current = seededDog?.photoUri ?? null;
    latestPhotoUriRef.current = seededDog?.photoUri ?? null;
    setPhotoUri(seededDog?.photoUri ?? null);
  }, [seededDog?.id, seededDog?.photoUri]);

  useEffect(() => {
    latestPhotoUriRef.current = photoUri;
  }, [photoUri]);

  useEffect(() => {
    return () => {
      discardDraftDogPhoto({
        currentPhotoUri: latestPhotoUriRef.current,
        originalPhotoUri: originalPhotoUriRef.current,
      });
    };
  }, []);

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
    setPhotoUri(result.photoUri);
  }

  function handleRemovePhoto() {
    const currentPhotoUri = latestPhotoUriRef.current;

    if (currentPhotoUri && currentPhotoUri !== originalPhotoUriRef.current) {
      deleteDogPhoto(currentPhotoUri);
    }

    latestPhotoUriRef.current = null;
    setPhotoUri(null);
  }

  function handleContinue() {
    if (!name.trim() || !address.trim() || !ownerPhone.trim()) {
      Alert.alert(
        "Missing details",
        "Add the dog name, address, and owner phone number first.",
      );
      return;
    }

    const savedDog = saveDog({
      id: seededDog?.id,
      name,
      address,
      ownerPhone,
      notes,
      photoUri: photoUri ?? undefined,
    });

    if (!savedDog) {
      return;
    }

    originalPhotoUriRef.current = savedDog.photoUri ?? null;
    latestPhotoUriRef.current = savedDog.photoUri ?? null;

    posthog.capture("onboarding_dog_step_completed", {
      is_edit: isEditing,
    });

    router.push("/onboarding/appointment");
  }

  return (
    <OnboardingShell
      step={2}
      totalSteps={5}
      eyebrow="First dog"
      title="Save your first dog profile."
      description="This becomes the profile you can reuse in future appointments from the Dogs tab."
    >
      <ThemedView
        style={[
          styles.card,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
        <ThemedView
          style={[
            styles.photoCard,
            {
              backgroundColor: palette.surfaceRaised,
              borderColor: palette.border,
            },
          ]}
        >
          <DogAvatar
            name={name.trim() || t("appointment.dogName")}
            photoUri={photoUri}
            size={96}
          />
          <AppButton
            disabled={photoBusy}
            icon="camera.fill"
            label={t("dogs.addFromCamera")}
            onPress={() => {
              handlePickPhoto("camera");
            }}
            variant="secondary"
          />
          <AppButton
            disabled={photoBusy}
            icon="photo.fill"
            label={t("dogs.chooseFromLibrary")}
            onPress={() => {
              handlePickPhoto("library");
            }}
            variant="secondary"
          />
          {photoUri ? (
            <AppButton
              disabled={photoBusy}
              icon="cancel.fill.circle"
              label={t("dogs.removePhoto")}
              onPress={handleRemovePhoto}
              variant="ghost"
            />
          ) : null}
        </ThemedView>
        <InputField
          label="Dog name"
          onChangeText={setName}
          placeholder="Milo"
          value={name}
        />
        <InputField
          label="Pickup address"
          onChangeText={setAddress}
          placeholder="12 Bark Street"
          value={address}
        />
        <InputField
          keyboardType="phone-pad"
          label="Owner phone"
          onChangeText={setOwnerPhone}
          placeholder="+49 123 456 789"
          value={ownerPhone}
        />
        <InputField
          label="Notes"
          multiline
          onChangeText={setNotes}
          placeholder="Gate code, leash note, feeding routine..."
          value={notes}
        />
      </ThemedView>

      <AppButton
        label={isEditing ? "Save and continue" : "Create dog"}
        onPress={handleContinue}
        icon="pawprint.fill"
      />
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.md,
    padding: Spacing.md,
  },
  photoCard: {
    alignItems: "stretch",
    borderRadius: Radius.controlLarge,
    borderWidth: 1,
    gap: Spacing.sm,
    padding: Spacing.md,
  },
});
