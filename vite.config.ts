import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import utwm from 'unplugin-tailwindcss-mangle/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), utwm()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
      // resolve @views to src/views
      "@views": path.resolve(__dirname, "./src/views"),
      "@app": "./src/app",
      "@assets": "./src/assets",
      "@components": "./src/components",
      "@styles": "./src/styles",
      "@utils": "./src/utils",
    },
  },
})
