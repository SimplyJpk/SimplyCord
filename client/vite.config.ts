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
      // Client
      '@components': path.resolve(__dirname, 'client/src/components'),
      '@slices': path.resolve(__dirname, 'client/src/slices'),
      '@store': path.resolve(__dirname, 'client/src/store'),
      '@hooks': path.resolve(__dirname, 'client/src/hooks'),
      '@pages': path.resolve(__dirname, 'client/src/pages'),
      // Shared | Server
      '@shared': path.resolve(__dirname, 'server/src/shared'),
    },
  },
})