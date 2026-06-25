import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: { port: 8003 },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    server: {
      deps: {
        inline: ['react-transition-group', '@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
      },
    },
  },
})
