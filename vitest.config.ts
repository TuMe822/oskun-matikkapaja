import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

// Testiasetukset erillään, vite.config.ts pysyy ennallaan.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
  }),
)
