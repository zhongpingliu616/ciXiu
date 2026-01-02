import App from './App'
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import * as Pinia from 'pinia';
import uviewPlus from '@/uni_modules/uview-plus'

export function createApp() {
  const app = createSSRApp(App);
  const pinia = Pinia.createPinia();
  app.use(pinia);
  app.use(uviewPlus)
  return {
    app,
	Pinia, // 这里保持原样导出 Pinia 类库
	pinia, // 导出 pinia 实例
  }
}
// #endif