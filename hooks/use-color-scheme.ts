import { useCanilendar } from '@/context/canilendar-context';

export function useColorScheme() {
  const { resolvedColorScheme } = useCanilendar();

  return resolvedColorScheme;
}
