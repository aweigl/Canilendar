import { useCanilander } from '@/context/canilander-context';

export function useColorScheme() {
  const { resolvedColorScheme } = useCanilander();

  return resolvedColorScheme;
}
