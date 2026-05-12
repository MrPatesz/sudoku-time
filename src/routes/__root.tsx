import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { createRootRoute } from '@tanstack/react-router';

export const Route = createRootRoute({
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider
    // TODO theme={{ primaryColor: 'violet' }}
    >
      {children}
    </MantineProvider>
  );
}
