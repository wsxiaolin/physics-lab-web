import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // 代理/aliyun-oss
      "/static": {
        target: "http://physics-static-cn.turtlesim.com:80",
        changeOrigin: true,
        rewrite: (path) => {
          console.log(path.replace("/static", ""));
          return path.replace("/static", "");
        },
        headers: {
          Referer: "https://www.turtlesim.com/",
        },
      },
    },
  },
});
