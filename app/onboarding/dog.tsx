import { router } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet } from "react-native";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { DogPhotoUploader } from "@/components/ui/dog-photo-uploader";
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
  const [isFormVisible, setIsFormVisible] = useState(Boolean(seededDog));
  const originalPhotoUriRef = useRef<string | null>(
    seededDog?.photoUri ?? null,
  );
  const latestPhotoUriRef = useRef<string | null>(seededDog?.photoUri ?? null);

  useEffect(() => {
    originalPhotoUriRef.current = seededDog?.photoUri ?? null;
    latestPhotoUriRef.current = seededDog?.photoUri ?? null;
    setPhotoUri(seededDog?.photoUri ?? null);
    if (seededDog?.id) {
      setIsFormVisible(true);
    }
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
        t("dogs.alerts.missingDogDetailsTitle"),
        t("dogs.alerts.missingDogDetailsBody"),
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

  function handlePrimaryAction() {
    if (!isFormVisible) {
      setIsFormVisible(true);
      return;
    }

    handleContinue();
  }

  return (
    <OnboardingShell
      step={2}
      title={t("onboarding.dog.title")}
      description={t("onboarding.dog.description")}
      illustration="dog"
      footer={
        <AppButton
          label={
            isFormVisible
              ? isEditing
                ? t("onboarding.dog.saveAndContinue")
                : t("onboarding.dog.createCta")
              : t("onboarding.dog.createCta")
          }
          onPress={handlePrimaryAction}
          icon="pawprint.fill"
        />
      }
    >
      {isFormVisible ? (
        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
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
            <DogPhotoUploader
              busy={photoBusy}
              name={name}
              onPickFromCamera={() => {
                handlePickPhoto("camera");
              }}
              onPickFromLibrary={() => {
                handlePickPhoto("library");
              }}
              onRemove={handleRemovePhoto}
              photoUri={photoUri}
            />
          </ThemedView>
          <InputField
            label={t("appointment.dogName")}
            onChangeText={setName}
            placeholder={t("dogs.placeholders.dogName")}
            value={name}
          />
          <InputField
            label={t("appointment.pickupAddress")}
            onChangeText={setAddress}
            placeholder={t("dogs.placeholders.pickupAddress")}
            value={address}
          />
          <InputField
            keyboardType="phone-pad"
            label={t("appointment.ownerPhone")}
            onChangeText={setOwnerPhone}
            placeholder={t("dogs.placeholders.ownerPhone")}
            value={ownerPhone}
          />
          <InputField
            label={t("dogs.notes")}
            multiline
            onChangeText={setNotes}
            placeholder={t("dogs.placeholders.notes")}
            value={notes}
          />
        </ThemedView>
      ) : null}
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
    borderRadius: Radius.controlLarge,
    borderWidth: 1,
    padding: Spacing.md,
  },
});
