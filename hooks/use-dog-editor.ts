import { usePostHog } from "posthog-react-native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

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
import type { ChecklistTarget, DogInput, DogProfile } from "@/types/domain";

type UseDogEditorParams = {
  deleteDog: (dogId: string) => boolean;
  dogs: DogProfile[];
  isLoaded: boolean;
  markChecklistStepSeen: (target: ChecklistTarget) => void;
  saveDog: (input: DogInput) => DogProfile | null;
};

export function useDogEditor({
  deleteDog,
  dogs,
  isLoaded,
  markChecklistStepSeen,
  saveDog,
}: UseDogEditorParams) {
  const { t } = useTranslation();
  const posthog = usePostHog();
  const [isEditing, setIsEditing] = useState(false);
  const [editingDogId, setEditingDogId] = useState<string | null>(null);
  const [form, setForm] = useState<DogFormState>(() => createEmptyDogForm());
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

  function syncFormFromDog(dog?: DogProfile | null) {
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
    setForm(createEmptyDogForm());
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

  function cancelEdit() {
    discardDraftDogPhoto({
      currentPhotoUri: latestPhotoUriRef.current,
      originalPhotoUri: originalPhotoUriRef.current,
    });
    resetForm();
  }

  return {
    beginCreateDog,
    beginEditDog,
    cancelEdit,
    editingDogId,
    form,
    handleDelete,
    handlePickPhoto,
    handleRemovePhoto,
    handleSave,
    isEditing,
    photoBusy,
    setForm,
  };
}
