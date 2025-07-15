import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      input: {
        popup: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/popup/popup.html'),
        options: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/options/options.html'),
        background: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/background/background.ts'),
        content: resolve(fileURLToPath(new URL('.', import.meta.url)), 'src/content/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId?.includes('background')) {
            return 'src/background/[name].js'
          }
          if (facadeModuleId?.includes('content')) {
            return 'src/content/[name].js'
          }
          return 'src/[name]/[name].js'
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(fileURLToPath(new URL('.', import.meta.url)), 'src'),
    },
  },
})
