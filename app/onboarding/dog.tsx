import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, StyleSheet } from "react-native";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { InputField } from "@/components/ui/input-field";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useCanilendar } from "@/context/canilendar-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function OnboardingDogScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const { dogs, saveDog } = useCanilendar();
  const seededDog = dogs[0];
  const [name, setName] = useState(seededDog?.name ?? "");
  const [address, setAddress] = useState(seededDog?.address ?? "");
  const [ownerPhone, setOwnerPhone] = useState(seededDog?.ownerPhone ?? "");
  const [notes, setNotes] = useState(seededDog?.notes ?? "");
  const isEditing = useMemo(() => Boolean(seededDog), [seededDog]);

  function handleContinue() {
    if (!name.trim() || !address.trim() || !ownerPhone.trim()) {
      Alert.alert("Missing details", "Add the dog name, address, and owner phone number first.");
      return;
    }

    const savedDog = saveDog({
      id: seededDog?.id,
      name,
      address,
      ownerPhone,
      notes,
    });

    if (!savedDog) {
      return;
    }

    router.push("/onboarding/appointment" as never);
  }

  return (
    <OnboardingShell
      step={2}
      totalSteps={5}
      eyebrow="First dog"
      title="Save the client once"
      description="This becomes the profile you can reuse in future appointments from the Dogs tab."
    >
      <ThemedView
        style={[
          styles.card,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
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
});
