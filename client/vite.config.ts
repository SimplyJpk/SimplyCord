import { defineConfig } from 'vite'
import path from 'path'
// Plugins
import react from '@vitejs/plugin-react-swc'
import UnoCSS from 'unocss/vite'

// if in dev environment add '../' to the path
// FIXME: (James) This will break local builds (not in dev environment) and will need to be fixed
const root = process.env.NODE_ENV === 'development' ? '../' : '';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    UnoCSS(),
  ],
  resolve: {
    // REMINDER! This is relative to the root of the project (Monorepo) so paths will generally start from "../client" or "../server"
    alias: {
      // Client
      '@components': path.resolve(__dirname, root + 'client/src/components'),
      '@slices': path.resolve(__dirname, root + 'client/src/slices'),
      '@store': path.resolve(__dirname, root + 'client/src/store'),
      '@middleware': path.resolve(__dirname, root + 'client/src/store/middleware'),
      '@hooks': path.resolve(__dirname, root + 'client/src/hooks'),
      '@pages': path.resolve(__dirname, root + 'client/src/pages'),
      '@util': path.resolve(__dirname, root + 'client/src/util'),
      '@root': path.resolve(__dirname, root + 'client'),
      // Resources
      '@icons': path.resolve(__dirname, root + 'client/src/assets/icons/'),
      // Shared | Server
      '@shared': path.resolve(__dirname, '../server/src/shared')
    },
  },
})