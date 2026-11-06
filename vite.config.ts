import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  worker: {
    format: 'es',
  },
  // @ts-expect-error vitest adds test to UserConfig
  test: {
    globals: true,
    environment: 'node',
  },
});
