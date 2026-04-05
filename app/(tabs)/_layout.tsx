import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.tint,
        tabBarInactiveTintColor: palette.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: palette.card,
          borderTopColor: palette.border,
          height: 88,
          paddingBottom: 12,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("tabs.calendar"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              name="calendar.circle.fill"
              palette={palette}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dogs"
        options={{
          title: t("tabs.dogs"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              name="pawprint.circle.fill"
              palette={palette}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("tabs.settings"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              name="gearshape.fill"
              palette={palette}
            />
          ),
        }}
      />
    </Tabs>
  );
}

function TabIcon({
  color,
  focused,
  name,
  palette,
}: {
  color: string;
  focused: boolean;
  name: React.ComponentProps<typeof IconSymbol>["name"];
  palette: typeof Colors.light;
}) {
  return (
    <View pointerEvents="none" style={styles.iconWrap}>
      <IconSymbol
        color={focused ? palette.tabIconSelected : color}
        name={name}
        size={focused ? 24 : 22}
        weight={focused ? "bold" : "medium"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    alignItems: "center",
    height: 42,
    justifyContent: "center",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    width: 46,
  },
});
