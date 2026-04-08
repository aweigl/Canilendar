import { useEffect, useRef } from "react";

import { posthog } from "@/lib/posthog";

export function useScreenTracking(
  pathname: string,
  params: object,
) {
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);
}
