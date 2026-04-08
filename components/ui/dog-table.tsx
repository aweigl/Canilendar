import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { DogProfile } from "@/types/domain";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";
import { ThemedText } from "../themed-text";
import { DAY_ACCENTS } from "../week-table";
import { IconButton } from "./icon-button";
import { IconSymbol } from "./icon-symbol";
import { InputField } from "./input-field";

const Avatar = ({ name, index }: { name: string; index: number }) => {
  return (
    <View
      style={{
        width: 46,
        height: 46,
        borderRadius: 99,
        backgroundColor: DAY_ACCENTS[index].soft,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          textTransform: "uppercase",
          opacity: 0.9,
          fontSize: 16,
          fontWeight: "bold",
          color: DAY_ACCENTS[index].strong,
        }}
      >
        {name.slice(0, 2)}
      </Text>
    </View>
  );
};

interface DogTableEntry extends DogProfile {
  selected?: boolean;
}

export const DogTableRow = ({
  dog,
  index,
  onRowClick,
  editDog,
  deleteDog,
}: {
  dog: DogTableEntry;
  index: number;
  onRowClick?: (dogId: string) => void;
  editDog?: (dogId: string) => void;
  deleteDog?: (dogId: string) => void;
}) => {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? "light"];

  const { t } = useTranslation();

  return (
    <XStack
      key={dog.id}
      onPress={() => onRowClick?.(dog.id)}
      style={{
        backgroundColor: palette.background,
        borderRadius: 14,
        borderWidth: 0.5,
        borderColor: palette.border,
        padding: Spacing.md,
        alignItems: "center",
        gap: Spacing.md,
      }}
    >
      <Avatar name={dog.name} index={index} />
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
        {editDog ? (
          <Pressable>
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
          </Pressable>
        ) : null}
        {deleteDog ? (
          <Pressable>
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
          </Pressable>
        ) : null}
      </YStack>
    </XStack>
  );
};

export function DogTable({
  dogs,
  withSearch = true,
  style,
  editDog,
  deleteDog,
  onRowClick,
}: {
  dogs: DogTableEntry[];
  withSearch?: boolean;
  style?: StyleProp<ViewStyle>;
  onRowClick?: (dogId: string) => void;
  editDog?: (dogId: string) => void;
  deleteDog?: (dogId: string) => void;
}) {
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
          marginTop: withSearch ? -35 : 0,
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
          label={t("dogs.search.label")}
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
