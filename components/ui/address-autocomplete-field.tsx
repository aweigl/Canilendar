import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import {
  getAddressSuggestions,
  isAddressAutocompleteAvailable,
  type AddressAutocompleteSuggestion,
} from "canilendar-address-autocomplete";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { InputField } from "./input-field";

const ADDRESS_DEBOUNCE_MS = 350;
const MINIMUM_QUERY_LENGTH = 3;
const BLUR_HIDE_DELAY_MS = 150;
const MAX_SUGGESTIONS = 5;

type AddressAutocompleteFieldProps = {
  label: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  value: string;
};

export function AddressAutocompleteField({
  label,
  onChangeText,
  placeholder,
  value,
}: AddressAutocompleteFieldProps) {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<
    AddressAutocompleteSuggestion[]
  >([]);
  const hideSuggestionsTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const requestIdRef = useRef(0);
  const autocompleteAvailable = isAddressAutocompleteAvailable();
  const trimmedValue = value.trim();

  useEffect(() => {
    return () => {
      if (hideSuggestionsTimeoutRef.current) {
        clearTimeout(hideSuggestionsTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (
      !autocompleteAvailable ||
      !isFocused ||
      trimmedValue.length < MINIMUM_QUERY_LENGTH
    ) {
      setSuggestions([]);
      return;
    }

    const currentRequestId = ++requestIdRef.current;
    const timeoutId = setTimeout(async () => {
      try {
        const nextSuggestions = await getAddressSuggestions(trimmedValue);

        if (requestIdRef.current !== currentRequestId) {
          return;
        }

        const currentAddress = trimmedValue.toLowerCase();
        const filteredSuggestions = nextSuggestions
          .filter(
            (suggestion) =>
              suggestion.address.trim().toLowerCase() !== currentAddress,
          )
          .slice(0, MAX_SUGGESTIONS);

        setSuggestions(filteredSuggestions);
      } catch {
        if (requestIdRef.current === currentRequestId) {
          setSuggestions([]);
        }
      }
    }, ADDRESS_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [autocompleteAvailable, isFocused, trimmedValue]);

  function handleFocus() {
    if (hideSuggestionsTimeoutRef.current) {
      clearTimeout(hideSuggestionsTimeoutRef.current);
      hideSuggestionsTimeoutRef.current = null;
    }

    setIsFocused(true);
  }

  function handleBlur() {
    hideSuggestionsTimeoutRef.current = setTimeout(() => {
      setIsFocused(false);
      setSuggestions([]);
    }, BLUR_HIDE_DELAY_MS);
  }

  function handleSuggestionPress(address: string) {
    if (hideSuggestionsTimeoutRef.current) {
      clearTimeout(hideSuggestionsTimeoutRef.current);
      hideSuggestionsTimeoutRef.current = null;
    }

    onChangeText(address);
    setIsFocused(false);
    setSuggestions([]);
  }

  return (
    <View style={styles.container}>
      <InputField
        label={label}
        onBlur={handleBlur}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        placeholder={placeholder}
        value={value}
      />
      {autocompleteAvailable && isFocused && suggestions.length > 0 ? (
        <ThemedView
          style={[
            styles.suggestionsCard,
            {
              backgroundColor: palette.surfaceRaised,
              borderColor: palette.border,
              shadowColor: palette.shadow,
            },
          ]}
        >
          {suggestions.map((suggestion, index) => (
            <Pressable
              key={suggestion.id}
              onPress={() => {
                handleSuggestionPress(suggestion.address);
              }}
              style={({ pressed }) => [
                styles.suggestionRow,
                index < suggestions.length - 1
                  ? {
                      borderBottomColor: palette.border,
                      borderBottomWidth: 1,
                    }
                  : null,
                pressed
                  ? {
                      backgroundColor: palette.surfaceAccent,
                    }
                  : null,
              ]}
            >
              <ThemedText
                type="defaultSemiBold"
                lightColor={palette.text}
                darkColor={palette.text}
              >
                {suggestion.title}
              </ThemedText>
              {suggestion.subtitle ? (
                <ThemedText
                  lightColor={palette.textMuted}
                  darkColor={palette.textMuted}
                  style={styles.subtitle}
                >
                  {suggestion.subtitle}
                </ThemedText>
              ) : null}
            </Pressable>
          ))}
        </ThemedView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  suggestionsCard: {
    borderRadius: Radius.controlLarge,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 3,
  },
  suggestionRow: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  subtitle: {
    marginTop: 2,
  },
});
