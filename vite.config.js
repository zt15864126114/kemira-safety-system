import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/kemira-safety-system/',
  plugins: [vue()],
  server: {
    port: 5173,
    open: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  optimizeDeps: {
    include: ['echarts']
  },
  build: {
    commonjsOptions: {
      include: [/dayjs/, /node_modules/],
      transformMixedEsModules: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'dayjs': ['dayjs']
        }
      }
    }
  }
})
