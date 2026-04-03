import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingView } from '@/components/loading-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/app-button';
import { InputField } from '@/components/ui/input-field';
import { Colors, Fonts } from '@/constants/theme';
import { useCanilander } from '@/context/canilander-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

const EMPTY_DOG = {
  name: '',
  address: '',
  ownerPhone: '',
  notes: '',
};

export default function DogsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const { dogs, appointments, isLoaded, saveDog, deleteDog } = useCanilander();
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
      notes: dog.notes ?? '',
    });
    setIsEditing(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.address.trim() || !form.ownerPhone.trim()) {
      Alert.alert('Missing dog details', 'Please add a name, address, and owner phone number.');
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
      `Delete ${dog.name}?`,
      'This only works when the dog has no scheduled appointments.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const didDelete = deleteDog(dogId);

            if (!didDelete) {
              Alert.alert(
                'Dog still scheduled',
                "Remove or reassign this dog's appointments before deleting the profile."
              );
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <ThemedText style={styles.title}>Dogs</ThemedText>
            <ThemedText lightColor={palette.muted} darkColor={palette.muted}>
              Keep client details reusable so appointments can be added in seconds.
            </ThemedText>
          </View>
          <AppButton
            label={isEditing ? 'Cancel' : 'Add dog'}
            onPress={isEditing ? resetForm : beginCreateDog}
            variant={isEditing ? 'secondary' : 'primary'}
          />
        </View>

        {isEditing ? (
          <ThemedView
            style={[
              styles.editor,
              {
                backgroundColor: palette.card,
                borderColor: palette.border,
              },
            ]}>
            <ThemedText style={styles.editorTitle}>
              {editingDogId ? 'Edit dog profile' : 'Add a dog profile'}
            </ThemedText>
            <InputField
              label="Dog name"
              onChangeText={(value) => setForm((current) => ({ ...current, name: value }))}
              placeholder="Milo"
              value={form.name}
            />
            <InputField
              label="Pickup address"
              onChangeText={(value) => setForm((current) => ({ ...current, address: value }))}
              placeholder="12 Bark Street"
              value={form.address}
            />
            <InputField
              keyboardType="phone-pad"
              label="Owner phone"
              onChangeText={(value) => setForm((current) => ({ ...current, ownerPhone: value }))}
              placeholder="+49 123 456 789"
              value={form.ownerPhone}
            />
            <InputField
              label="Notes"
              multiline
              onChangeText={(value) => setForm((current) => ({ ...current, notes: value }))}
              placeholder="Gate code, feeding note, leash routine..."
              value={form.notes}
            />
            <AppButton label={editingDogId ? 'Save changes' : 'Create dog'} onPress={handleSave} />
          </ThemedView>
        ) : null}

        <View style={styles.list}>
          {dogs.length === 0 ? (
            <ThemedView
              style={[
                styles.emptyState,
                {
                  backgroundColor: palette.card,
                  borderColor: palette.border,
                },
              ]}>
              <ThemedText style={styles.emptyTitle}>No dogs saved yet</ThemedText>
              <ThemedText lightColor={palette.muted} darkColor={palette.muted}>
                Add your first dog so future appointments can be scheduled from a saved profile.
              </ThemedText>
            </ThemedView>
          ) : (
            dogs.map((dog) => {
              const appointmentCount = appointments.filter((appointment) => appointment.dogId === dog.id).length;

              return (
                <ThemedView
                  key={dog.id}
                  style={[
                    styles.card,
                    {
                      backgroundColor: palette.card,
                      borderColor: palette.border,
                    },
                  ]}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardCopy}>
                      <ThemedText style={styles.cardTitle}>{dog.name}</ThemedText>
                      <ThemedText lightColor={palette.muted} darkColor={palette.muted}>
                        {dog.address}
                      </ThemedText>
                      <ThemedText lightColor={palette.muted} darkColor={palette.muted}>
                        {dog.ownerPhone}
                      </ThemedText>
                    </View>
                    <ThemedView style={[styles.countPill, { backgroundColor: palette.backgroundMuted }]}>
                      <ThemedText style={styles.countText}>{appointmentCount} upcoming templates</ThemedText>
                    </ThemedView>
                  </View>

                  {dog.notes ? (
                    <ThemedText lightColor={palette.muted} darkColor={palette.muted}>
                      {dog.notes}
                    </ThemedText>
                  ) : null}

                  <View style={styles.actions}>
                    <AppButton label="Edit" onPress={() => beginEditDog(dog.id)} variant="secondary" />
                    <AppButton label="Delete" onPress={() => handleDelete(dog.id)} variant="ghost" />
                  </View>
                </ThemedView>
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
    gap: 18,
    padding: 20,
    paddingBottom: 140,
  },
  header: {
    gap: 16,
  },
  headerCopy: {
    gap: 6,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 34,
    fontWeight: '700',
  },
  editor: {
    borderRadius: 28,
    borderWidth: 1,
    gap: 14,
    padding: 18,
  },
  editorTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 22,
    fontWeight: '700',
  },
  list: {
    gap: 14,
  },
  emptyState: {
    borderRadius: 28,
    borderWidth: 1,
    gap: 10,
    padding: 20,
  },
  emptyTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    gap: 14,
    padding: 18,
  },
  cardHeader: {
    gap: 10,
  },
  cardCopy: {
    gap: 4,
  },
  cardTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  countPill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  countText: {
    fontFamily: Fonts.rounded,
    fontSize: 13,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
});
