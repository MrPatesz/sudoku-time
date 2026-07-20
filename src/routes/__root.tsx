import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { createRootRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { usePrimaryColor } from '#/hooks/usePrimaryColor';

export const Route = createRootRoute({
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const [primaryColor] = usePrimaryColor();

  useEffect(() => {
    try {
      void navigator.wakeLock.request('screen');
      // @ts-expect-error
      navigator.virtualKeyboard.overlaysContent = true;
    } catch (_) {}
  }, []);

  return <MantineProvider theme={{ primaryColor }}>{children}</MantineProvider>;
}
