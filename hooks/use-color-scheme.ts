import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useOptionalCanilendar } from '@/context/canilendar-context';

export function useColorScheme() {
  const context = useOptionalCanilendar();
  const systemColorScheme = useSystemColorScheme();

  return context?.resolvedColorScheme ?? systemColorScheme ?? 'light';
}
