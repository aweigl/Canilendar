import { requireOptionalNativeModule } from "expo-modules-core";

export type AddressAutocompleteSuggestion = {
  id: string;
  title: string;
  subtitle: string;
  address: string;
};

type CanilendarAddressAutocompleteModuleType = {
  getSuggestions(
    query: string,
  ): Promise<AddressAutocompleteSuggestion[]>;
};

const moduleInstance =
  requireOptionalNativeModule<CanilendarAddressAutocompleteModuleType>(
    "CanilendarAddressAutocomplete",
  );

export function isAddressAutocompleteAvailable() {
  return moduleInstance != null;
}

export async function getAddressSuggestions(query: string) {
  if (!moduleInstance) {
    return [];
  }

  return moduleInstance.getSuggestions(query);
}
