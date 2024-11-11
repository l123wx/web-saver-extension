import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import { resolve } from 'path'
import manifest from './manifest.json'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        panel: resolve(__dirname, 'src/panel/index.html')
      },
      output: {
        assetFileNames: (assetInfo) => {
          // 如果是 HTML 文件，直接放在根目录
          if (assetInfo.name?.endsWith('.html')) {
            return '[name][extname]';
          }
          // 其他资源放在 assets 目录
          return 'assets/[name].[hash][extname]';
        }
      }
    },
  },
  plugins: [
    react(),
    crx({ manifest }),
  ],
})