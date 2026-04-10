import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useDogContactActions } from "@/hooks/use-dog-contact-actions";
import type { DogProfile } from "@/types/domain";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { ScrollView, XStack, YStack } from "tamagui";
import { ThemedText } from "../themed-text";
import { DogAvatar } from "./dog-avatar";
import { IconButton } from "./icon-button";
import { IconSymbol } from "./icon-symbol";
import { InputField } from "./input-field";

export interface DogTableEntry extends DogProfile {
  selected?: boolean;
}

export type DogTableRowProps = {
  dog: DogTableEntry;
  index: number;
  onRowClick?: (dogId: string) => void;
  editDog?: (dogId: string) => void;
  deleteDog?: (dogId: string) => void;
};

export const DogTableRow = ({
  dog,
  index,
  onRowClick,
  editDog,
  deleteDog,
}: DogTableRowProps) => {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? "light"];
  const { t } = useTranslation();
  const { openDogAddress, openDogOwnerPhone } = useDogContactActions();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onRowClick?.(dog.id)}
      onLongPress={() => editDog?.(dog.id)}
      style={({ pressed }) => [
        {
          backgroundColor: palette.background,
          borderRadius: 14,
          borderWidth: dog.selected ? 1 : 0.5,
          borderColor: dog.selected ? palette.success : palette.border,
          padding: Spacing.md,
          alignItems: "center",
          gap: Spacing.md,
        },
        pressed && {
          backgroundColor: palette.surface,
          opacity: 0.96,
        },
      ]}
    >
      <XStack
        style={{
          alignItems: "center",
          gap: Spacing.md,
        }}
      >
        <DogAvatar name={dog.name} photoUri={dog.photoUri} index={index} />
        <YStack flex={1}>
          <ThemedText
            type="defaultSemiBold"
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {dog.name}
          </ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
            style={{ opacity: 0.8 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {dog.address}
          </ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
            style={{ opacity: 0.7 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {dog.ownerPhone}
          </ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
            style={{ opacity: 0.7 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {dog.notes}
          </ThemedText>
        </YStack>
        <YStack>
          {dog.selected ? (
            <ThemedText
              lightColor={palette.success}
              darkColor={palette.success}
              style={{ opacity: 0.7 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {t("dog.selected")}
            </ThemedText>
          ) : null}
          {dog.address.trim() ? (
            <IconButton
              accessibilityLabel={t("dogs.actions.openInMaps")}
              onPress={() => {
                openDogAddress(dog.address);
              }}
              icon={
                <IconSymbol name="map.fill" size={20} color={palette.info} />
              }
            />
          ) : null}
          {dog.ownerPhone.trim() ? (
            <IconButton
              accessibilityLabel={t("dogs.actions.callOwner")}
              onPress={() => {
                openDogOwnerPhone(dog.ownerPhone);
              }}
              icon={
                <IconSymbol
                  name="phone.fill"
                  size={20}
                  color={palette.support}
                />
              }
            />
          ) : null}
          {editDog ? (
            <IconButton
              onPress={() => editDog(dog.id)}
              icon={
                <IconSymbol
                  name="square.and.pencil"
                  size={20}
                  color={palette.accent}
                />
              }
            />
          ) : null}
          {deleteDog ? (
            <IconButton
              onPress={() => deleteDog(dog.id)}
              icon={
                <IconSymbol
                  name="trash.fill"
                  size={20}
                  color={palette.danger}
                />
              }
            />
          ) : null}
        </YStack>
      </XStack>
    </Pressable>
  );
};

export type DogTableProps = {
  dogs: DogTableEntry[];
  withSearch?: boolean;
  style?: StyleProp<ViewStyle>;
  onRowClick?: (dogId: string) => void;
  editDog?: (dogId: string) => void;
  deleteDog?: (dogId: string) => void;
};

export function DogTable({
  dogs,
  withSearch = true,
  style,
  editDog,
  deleteDog,
  onRowClick,
}: DogTableProps) {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? "light"];
  const [query, setQuery] = useState("");

  const { t } = useTranslation();

  const filtered = dogs.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <YStack
      style={[
        style,
        {
          flex: 1,
          paddingTop: Spacing.md,
          paddingBottom: Spacing.md,
          gap: Spacing.md,
          marginTop: 0,
        },
      ]}
    >
      {withSearch ? (
        <InputField
          style={{
            backgroundColor: palette.background,
            borderColor: palette.accent,
            borderWidth: 0.5,
            borderRadius: 8,
          }}
          placeholder={t("dogs.search.placeholder")}
          value={query}
          onChangeText={setQuery}
        />
      ) : null}
      <ScrollView
        contentContainerStyle={{ gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((dog, index) => (
          <DogTableRow
            key={dog.id}
            dog={dog}
            index={index}
            onRowClick={onRowClick}
            editDog={editDog}
            deleteDog={deleteDog}
          />
        ))}
      </ScrollView>
    </YStack>
  );
}
