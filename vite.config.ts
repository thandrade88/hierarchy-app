import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/firebase': {
        target: 'https://gongfetest.firebaseio.com',
        rewrite: (path) => path.replace(/^\/firebase/, ''),
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
