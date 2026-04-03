import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type InputFieldProps = TextInputProps & {
  label: string;
  hint?: string;
};

export function InputField({ label, hint, multiline, style, ...rest }: InputFieldProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <View style={styles.wrapper}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {hint ? (
        <ThemedText lightColor={palette.muted} darkColor={palette.muted} type="caption">
          {hint}
        </ThemedText>
      ) : null}
      <TextInput
        placeholderTextColor={palette.muted}
        style={[
          styles.input,
          {
            backgroundColor: palette.card,
            borderColor: palette.border,
            color: palette.text,
            minHeight: multiline ? 108 : 54,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          style,
        ]}
        multiline={multiline}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '700',
  },
  input: {
    borderRadius: 18,
    borderWidth: 1,
    fontFamily: Fonts.sans,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
