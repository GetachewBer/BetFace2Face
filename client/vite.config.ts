import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app',  // Allow all ngrok domains
      'c057-196-191-221-74.ngrok-free.app'  // Your specific ngrok URL
    ]
  }
})