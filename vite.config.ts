import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solid()],
  server: {
    proxy: {
      "/api": {
        target: "https://blog-api.qingzt.us.kg",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/bing-images": {
        target: "https://www.bing.com/hp/api/model?mkt=zh-CN",
        changeOrigin: true,
      }
    },
  },
})
