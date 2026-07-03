import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [tailwindcss(), react()],
  base: command === 'serve' ? (process.env.VITE_BASENAME || '/') : '/',
  server: { port: 8003, host: true, allowedHosts: true },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    server: {
    watch: {
      usePolling: true,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**', '**/docs/**', '**/public/**', '**/.superpowers/**']
    },
      deps: {
        inline: ['react-transition-group', '@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
      },
    },
  },
}))
