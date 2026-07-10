import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor":    ["react", "react-dom"],
          "markdown-vendor": ["react-markdown", "remark-gfm"],
          "syntax-vendor":   ["react-syntax-highlighter"],
        },
      },
    },
  },
})