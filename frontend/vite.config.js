import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { getProxyOptions } from 'frappe-ui/src/utils/vite-dev-server'
import { webserver_port } from '../../../sites/common_site_config.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
  port: 8080,
  host: '0.0.0.0',        // ← allows access via integratech.com, not just localhost
  proxy: {
    '/api': {
      target: 'http://integratech.com:8000',   // ← was 8080, must be 8000
      changeOrigin: true,
    },
    '/assets': {
      target: 'http://integratech.com:8000',
      changeOrigin: true,
    },
    '/files': {
      target: 'http://integratech.com:8000',
      changeOrigin: true,
    },
  }
},
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: `../${path.basename(path.resolve('..'))}/public/frontend`,
    emptyOutDir: true,
    target: 'es2015',
  },
  optimizeDeps: {
    include: ['frappe-ui > feather-icons', 'showdown', 'engine.io-client'],
  },
})
