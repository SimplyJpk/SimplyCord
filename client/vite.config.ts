import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
// Plugins
import react from '@vitejs/plugin-react-swc'
import UnoCSS from 'unocss/vite'

// Load environment variables from .env file
dotenv.config()

// check if dev
const isDev = process.env.NODE_ENV === 'development'

// Base configuration
const baseConfig = {
  plugins: [
    react(),
    UnoCSS(),
  ],
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
}

// Development configuration
const devConfig = () => {
  return {
    server: {
      https: {
        key: fs.readFileSync(path.resolve(__dirname, process.env.VITE_KEY_PATH!)),
        cert: fs.readFileSync(path.resolve(__dirname, process.env.VITE_CERT_PATH!)),
      },
      port: 3001,
    }
  }
}

// Export the final configuration
export default defineConfig({
  ...baseConfig,
  ...(isDev ? devConfig() : {}),
})