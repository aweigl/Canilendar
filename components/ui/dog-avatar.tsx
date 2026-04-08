import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { DAY_ACCENTS } from "@/components/week-table";

export function DogAvatar({
  name,
  photoUri,
  size = 46,
  index = 0,
}: {
  name: string;
  photoUri?: string | null;
  size?: number;
  index?: number;
}) {
  const accent = DAY_ACCENTS[index % DAY_ACCENTS.length];
  const initials = name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: accent.soft,
          borderColor: accent.strong,
        },
      ]}
    >
      {photoUri ? (
        <Image
          source={photoUri}
          contentFit="cover"
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <Text
          style={[
            styles.initials,
            {
              color: accent.strong,
              fontSize: Math.max(14, Math.round(size * 0.35)),
            },
          ]}
        >
          {initials || "DG"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    borderWidth: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
  initials: {
    fontWeight: "700",
    opacity: 0.9,
    textTransform: "uppercase",
  },
});
