import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages에서 /workday-atlas/ 경로로 서빙되는 것을 가정
  base: '/workday-atlas/',
})
