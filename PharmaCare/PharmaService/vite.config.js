import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Thuốc đặc trị lỗi "Invalid hook call"
    dedupe: ['react', 'react-dom'], 
    alias: {
      react: "react",
      "react-dom": "react-dom",
    },
  },
  // Tối ưu hóa để tránh lỗi Recharts
  optimizeDeps: {
    include: ['react', 'react-dom', 'recharts'],
  },
})