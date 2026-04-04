import { Switch } from "tamagui";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ToggleSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function ToggleSwitch({ checked, onCheckedChange }: ToggleSwitchProps) {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];

  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      unstyled
      style={{
        alignItems: "center",
        backgroundColor: checked ? palette.accentMuted : palette.surfaceMuted,
        borderColor: checked ? palette.accent : palette.border,
        borderRadius: 999,
        borderWidth: 1,
        justifyContent: "center",
        paddingHorizontal: 3,
        width: 56,
      }}
    >
      <Switch.Thumb
        style={{
          backgroundColor: checked ? palette.accent : palette.surface,
          borderRadius: 999,
        }}
      />
    </Switch>
  );
}
