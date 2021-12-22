import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const fs = require('fs')
const path = require('path')

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    https: {
      key: fs.readFileSync(
        path.resolve(process.env.SSL_KEY_FILE || 'localhost-key.pem'),
      ),
      cert: fs.readFileSync(
        path.resolve(process.env.SSL_CERT_FILE || 'localhost.pem'),
      ),
    },
  },
})
