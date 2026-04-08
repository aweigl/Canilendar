import { useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
} from "react-native";
import { Label, YStack } from "tamagui";

import { ThemedText } from "@/components/themed-text";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useKeyboardAwareScroll } from "@/components/ui/keyboard-aware-scroll-view";

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
  const inputRef = useRef<TextInput>(null);
  const scrollFocusedInput = useKeyboardAwareScroll();
  const helperText = error ?? hint;
  const helperColor = error ? palette.danger : palette.textMuted;
  const minHeight = multiline ? 80 : 56;
  const fieldStyle = [
    styles.input,
    {
      backgroundColor: palette.surfaceRaised,
      borderColor: error
        ? palette.danger
        : isFocused
          ? palette.borderStrong
          : palette.border,
      color: palette.text,
      minHeight,
      textAlignVertical: multiline ? "top" : "center",
    },
    style,
  ] as const;
  const handleBlur = (event: any) => {
    setIsFocused(false);
    onBlur?.(event as never);
  };
  const handleFocus = (event: any) => {
    setIsFocused(true);
    scrollFocusedInput?.(inputRef.current);
    onFocus?.(event as never);
  };

  return (
    <YStack gap={Spacing.sm}>
      <Label size="$2" style={[styles.label, { color: palette.textMuted }]}>
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
      <TextInput
        accessibilityState={{ disabled: rest.editable === false }}
        multiline={multiline}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholderTextColor={palette.textSubtle}
        ref={inputRef}
        selectionColor={palette.accent}
        style={fieldStyle as any}
        {...rest}
      />
    </YStack>
  );
}

const styles = StyleSheet.create({
  label: {
    marginTop: Spacing.md,
    fontFamily: Fonts.rounded,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  input: {
    borderRadius: Radius.controlLarge,
    borderWidth: 1,
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 22,
    paddingBottom: 16,
    width: "100%",
    paddingHorizontal: Spacing.md,
    paddingTop: 16,
  },
});
