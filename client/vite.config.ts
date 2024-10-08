import { defineConfig } from 'vite'
import path from 'path'
// Plugins
import react from '@vitejs/plugin-react-swc'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'client/src/components'),
      '@slices': path.resolve(__dirname, 'client/src/slices'),
      '@store': path.resolve(__dirname, 'client/src/store'),
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
})