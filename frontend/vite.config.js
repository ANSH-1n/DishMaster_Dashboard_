import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/': "http://localhost:3000"
    },
  },
  plugins: [react()],
})



git remote add origin https://github.com/ANSH-1n/INTERN_ASSIGNMENT_FINAL.git