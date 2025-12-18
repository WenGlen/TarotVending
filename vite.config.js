// vite.config.js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // 设置 base path：
  // - './' 相对路径：适用于 GitHub Pages（子路径）
  // - '/' 绝对路径：适用于 Zeabur（根路径）
  // Zeabur 会自动处理，GitHub Pages 需要相对路径
  base: process.env.VITE_BASE_PATH || './',
  
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // 開發環境：將 API 請求代理到本地後端服務
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})