import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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