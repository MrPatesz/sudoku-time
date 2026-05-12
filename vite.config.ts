import { devtools } from '@tanstack/devtools-vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      // slow dev startup workaround, source:
      // https://github.com/tabler/tabler-icons/issues/1233#issuecomment-2428245119
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  plugins: [
    devtools(),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    viteReact(),
    VitePWA({ registerType: 'autoUpdate', manifest: false }),
  ],
  base: '/sudoku-time/',
});

export default config;
