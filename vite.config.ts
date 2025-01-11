import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base: '/kemira-safety-system/', // 添加这行，路径应该是你的仓库名
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist', // 可选：指定构建输出目录
    assetsDir: 'assets', // 可选：指定资源文件目录
  }
}) 