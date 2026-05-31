import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => ({
  plugins: [
    tailwindcss(),
    react(),
    tsconfigPaths(),
  ],
  server: {
    port: 5173,
    proxy: {
      // Forward all /api calls to the Express backend
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return

          if (id.includes('/react/') || id.includes('/react-dom/')) {
            return 'react-vendor'
          }
          if (id.includes('/react-router') || id.includes('/react-router-dom/')) {
            return 'router-vendor'
          }
          if (id.includes('/@radix-ui/')) {
            return 'radix-vendor'
          }
          if (id.includes('/recharts/') || id.includes('/d3-')) {
            return 'charts-vendor'
          }
          if (
            id.includes('/react-hook-form/') ||
            id.includes('/@hookform/') ||
            id.includes('/zod/')
          ) {
            return 'forms-vendor'
          }
        },
      },
    },
  },
}))
