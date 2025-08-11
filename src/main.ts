// import { createSSRApp } from "vue";
// import { createPinia } from 'pinia'
// import App from "./App.vue";
// import { initCloud } from './utils/cloud'
// export function createApp() {
//   const app = createSSRApp(App);
//   // 初始化Pinia
// const pinia = createPinia()
// app.use(pinia)
//   initCloud() // 初始化云开发
//   return {
//     app,
//   };
// }


// main.ts
import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  return {
    app,
    Pinia
  }
}