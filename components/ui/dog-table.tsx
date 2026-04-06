import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { DogProfile } from "@/types/domain";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";
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
        width: 42,
        height: 42,
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

export function DogTable({
  dogs,
  editDog,
  deleteDog,
}: {
  dogs: DogProfile[];
  editDog: (dogId: string) => void;
  deleteDog: (dogId: string) => void;
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
      style={{
        flex: 1,
        padding: Spacing.md,
        gap: Spacing.md,
        marginTop: -35,
      }}
    >
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
      <ScrollView
        contentContainerStyle={{ gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((dog, index) => (
          <XStack
            key={dog.id}
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
              >
                {dog.name}
              </ThemedText>
              <ThemedText
                lightColor={palette.textMuted}
                darkColor={palette.textMuted}
                style={{ opacity: 0.8 }}
              >
                {dog.address}
              </ThemedText>
              <ThemedText
                lightColor={palette.textMuted}
                darkColor={palette.textMuted}
                style={{ opacity: 0.7 }}
              >
                {dog.ownerPhone}
              </ThemedText>
            </YStack>
            <YStack
              style={{
                alignItems: "flex-end",
                gap: Spacing.xs,
              }}
            >
              <View style={{ flexDirection: "row", gap: Spacing.xs }}>
                <Pressable>
                  <IconButton
                    onPress={() => editDog(dog.id)}
                    icon={
                      <IconSymbol
                        name="square.and.pencil"
                        size={24}
                        color={palette.accent}
                      />
                    }
                  />
                </Pressable>
                <Pressable>
                  <IconButton
                    onPress={() => deleteDog(dog.id)}
                    icon={
                      <IconSymbol
                        name="trash.fill"
                        size={24}
                        color={palette.danger}
                      />
                    }
                  />
                </Pressable>
              </View>
            </YStack>
          </XStack>
        ))}
      </ScrollView>
    </YStack>
  );
}
