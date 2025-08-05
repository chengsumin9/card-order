import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
// import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  // plugins: [vue()]
});
