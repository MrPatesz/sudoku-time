import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { createRootRoute } from '@tanstack/react-router';
import { usePrimaryColor } from '#/contexts/primaryColorContext';

export const Route = createRootRoute({
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const { primaryColor } = usePrimaryColor();

  return <MantineProvider theme={{ primaryColor }}>{children}</MantineProvider>;
}
