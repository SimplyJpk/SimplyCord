import { defineConfig } from 'vite'
import fs from 'fs'
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
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, process.env.VITE_KEY_PATH)),
      cert: fs.readFileSync(path.resolve(__dirname, process.env.VITE_CERT_PATH)),
    },
    port: 3001,
  },
  resolve: {
    // REMINDER! This is relative to the root of the project (Monorepo) so paths will generally start from "../client" or "../server"
    alias: {
      // Client
      '@components': path.resolve(__dirname, '../client/src/components'),
      '@slices': path.resolve(__dirname, '../client/src/slices'),
      '@store': path.resolve(__dirname, '../client/src/store'),
      '@hooks': path.resolve(__dirname, '../client/src/hooks'),
      '@pages': path.resolve(__dirname, '../client/src/pages'),
      // Shared | Server
      '@shared': path.resolve(__dirname, '../server/src/shared')
    },
  },
})