import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{jsx,js,ts,tsx}', 'src/**/*.smoke.{jsx,js,ts,tsx}'],
    globals: true,
  },
});
