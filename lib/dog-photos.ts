import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

import { createId } from "@/lib/ids";
import type { DogProfile } from "@/types/domain";

export type DogPhotoSource = "camera" | "library";
export type DogPhotoErrorReason =
  | "camera-permission"
  | "library-permission"
  | "processing-failed";

export type DogPhotoPickResult =
  | {
      canceled: true;
    }
  | {
      canceled: false;
      photoUri: string;
    }
  | {
      canceled: false;
      errorReason: DogPhotoErrorReason;
    };

export type DogFormState = {
  name: string;
  address: string;
  ownerPhone: string;
  notes: string;
  photoUri: string | null;
};

const DOG_PHOTO_DIRECTORY = FileSystem.documentDirectory
  ? `${FileSystem.documentDirectory}dog-photos`
  : null;

function normalizePhotoUri(value: string | null | undefined) {
  return value?.trim() ? value : null;
}

function getPhotoExtension({
  fileName,
  mimeType,
  uri,
}: Pick<ImagePicker.ImagePickerAsset, "fileName" | "mimeType" | "uri">) {
  const normalizedName = fileName?.split(".").pop()?.toLowerCase();

  if (normalizedName) {
    return normalizedName === "jpeg" ? "jpg" : normalizedName;
  }

  const normalizedMime = mimeType?.split("/").pop()?.toLowerCase();

  if (normalizedMime) {
    return normalizedMime === "jpeg" ? "jpg" : normalizedMime;
  }

  const cleanUri = uri.split("?")[0];
  const normalizedUriExtension = cleanUri.split(".").pop()?.toLowerCase();

  if (normalizedUriExtension && normalizedUriExtension !== cleanUri) {
    return normalizedUriExtension === "jpeg" ? "jpg" : normalizedUriExtension;
  }

  return "jpg";
}

async function persistImageAsset(asset: ImagePicker.ImagePickerAsset) {
  if (!DOG_PHOTO_DIRECTORY) {
    return asset.uri;
  }

  await FileSystem.makeDirectoryAsync(DOG_PHOTO_DIRECTORY, {
    intermediates: true,
  });

  const extension = getPhotoExtension(asset);
  const destinationUri = `${DOG_PHOTO_DIRECTORY}/${createId()}.${extension}`;

  await FileSystem.copyAsync({
    from: asset.uri,
    to: destinationUri,
  });

  return destinationUri;
}

async function requestSourcePermission(source: DogPhotoSource) {
  if (source === "camera") {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    return permission.granted ? null : "camera-permission";
  }

  if (Platform.OS === "web") {
    return null;
  }

  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  return permission.granted ? null : "library-permission";
}

export async function pickDogPhoto(
  source: DogPhotoSource,
): Promise<DogPhotoPickResult> {
  const deniedReason = await requestSourcePermission(source);

  if (deniedReason) {
    return {
      canceled: false,
      errorReason: deniedReason,
    };
  }

  try {
    const pickerResult =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            mediaTypes: ["images"],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [1, 1],
            mediaTypes: ["images"],
            quality: 0.8,
            selectionLimit: 1,
          });

    if (pickerResult.canceled || !pickerResult.assets[0]?.uri) {
      return { canceled: true };
    }

    return {
      canceled: false,
      photoUri: await persistImageAsset(pickerResult.assets[0]),
    };
  } catch {
    return {
      canceled: false,
      errorReason: "processing-failed",
    };
  }
}

export function isManagedDogPhotoUri(uri?: string | null) {
  return Boolean(
    DOG_PHOTO_DIRECTORY && uri && normalizePhotoUri(uri)?.startsWith(DOG_PHOTO_DIRECTORY),
  );
}

export async function deleteDogPhoto(uri?: string | null) {
  const normalizedUri = normalizePhotoUri(uri);

  if (!normalizedUri || !isManagedDogPhotoUri(normalizedUri)) {
    return;
  }

  try {
    await FileSystem.deleteAsync(normalizedUri, { idempotent: true });
  } catch {
    // Best-effort cleanup for local media files.
  }
}

export async function cleanupReplacedDraftDogPhoto({
  currentPhotoUri,
  nextPhotoUri,
  originalPhotoUri,
}: {
  currentPhotoUri?: string | null;
  nextPhotoUri?: string | null;
  originalPhotoUri?: string | null;
}) {
  const normalizedCurrentPhotoUri = normalizePhotoUri(currentPhotoUri);
  const normalizedNextPhotoUri = normalizePhotoUri(nextPhotoUri);
  const normalizedOriginalPhotoUri = normalizePhotoUri(originalPhotoUri);

  if (
    normalizedCurrentPhotoUri &&
    normalizedCurrentPhotoUri !== normalizedNextPhotoUri &&
    normalizedCurrentPhotoUri !== normalizedOriginalPhotoUri
  ) {
    await deleteDogPhoto(normalizedCurrentPhotoUri);
  }
}

export async function discardDraftDogPhoto({
  currentPhotoUri,
  originalPhotoUri,
}: {
  currentPhotoUri?: string | null;
  originalPhotoUri?: string | null;
}) {
  await cleanupReplacedDraftDogPhoto({
    currentPhotoUri,
    nextPhotoUri: originalPhotoUri,
    originalPhotoUri,
  });
}

export function createEmptyDogForm(): DogFormState {
  return {
    name: "",
    address: "",
    ownerPhone: "",
    notes: "",
    photoUri: null,
  };
}

export function createDogFormState(dog?: Partial<DogProfile> | null): DogFormState {
  return {
    name: dog?.name ?? "",
    address: dog?.address ?? "",
    ownerPhone: dog?.ownerPhone ?? "",
    notes: dog?.notes ?? "",
    photoUri: normalizePhotoUri(dog?.photoUri),
  };
}
