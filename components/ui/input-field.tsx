import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from "react-native";
import { Input, Label, YStack } from "tamagui";

import { ThemedText } from "@/components/themed-text";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type SupportedInputProps = Pick<
  TextInputProps,
  | "autoCapitalize"
  | "autoComplete"
  | "autoCorrect"
  | "editable"
  | "inputMode"
  | "keyboardType"
  | "maxLength"
  | "numberOfLines"
  | "onBlur"
  | "onChangeText"
  | "onFocus"
  | "placeholder"
  | "returnKeyType"
  | "secureTextEntry"
  | "textContentType"
  | "value"
>;

type InputFieldProps = SupportedInputProps & {
  label: string;
  hint?: string;
  error?: string;
  multiline?: boolean;
  style?: StyleProp<TextStyle>;
};

export function InputField({
  label,
  hint,
  error,
  multiline,
  onBlur,
  onFocus,
  style,
  ...rest
}: InputFieldProps) {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const [isFocused, setIsFocused] = useState(false);
  const helperText = error ?? hint;
  const helperColor = error ? palette.danger : palette.textMuted;
  const minHeight = multiline ? 80 : 56;
  const fieldStyle = [
    styles.input,
    {
      backgroundColor: palette.surface,
      borderColor: error
        ? palette.danger
        : isFocused
          ? palette.accent
          : palette.border,
      color: palette.text,
      minHeight,
      textAlignVertical: multiline ? "top" : "center",
    },
    style as any,
  ] as const;
  const handleBlur = (event: any) => {
    setIsFocused(false);
    onBlur?.(event as never);
  };
  const handleFocus = (event: any) => {
    setIsFocused(true);
    onFocus?.(event as never);
  };

  return (
    <YStack gap={Spacing.sm}>
      <Label size="$3" style={[styles.label, { color: palette.textMuted }]}>
        {label}
      </Label>
      {helperText ? (
        <ThemedText
          lightColor={helperColor}
          darkColor={helperColor}
          type="caption"
        >
          {helperText}
        </ThemedText>
      ) : null}
      {multiline ? (
        <TextInput
          accessibilityState={{ disabled: rest.editable === false }}
          multiline
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholderTextColor={palette.textSubtle as any}
          selectionColor={palette.accent}
          style={fieldStyle as any}
          {...rest}
        />
      ) : (
        <Input
          accessibilityState={{ disabled: rest.editable === false }}
          focusStyle={{ borderColor: palette.accent } as never}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholderTextColor={palette.textSubtle as any}
          style={fieldStyle as any}
          unstyled
          {...rest}
        />
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: Fonts.rounded,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  input: {
    borderRadius: Radius.controlLarge,
    borderWidth: 1.5,
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 22,
    paddingBottom: 16,
    width: "100%",
    paddingHorizontal: Spacing.md,
    paddingTop: 16,
  },
});
