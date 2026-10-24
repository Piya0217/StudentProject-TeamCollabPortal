import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

import { fileURLToPath } from 'node:url'

const sourcePath = fileURLToPath(new URL('./src', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': sourcePath } },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})