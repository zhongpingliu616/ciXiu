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
import { useLoginStore } from '@/stores/userLogin'
const safeAreaInfo = () => {
  const mobileSysInfo = uni.getSystemInfoSync()||({top:'40rpx',bottom:'0'})

  if (mobileSysInfo.safeArea) {
    return {
      top: mobileSysInfo.safeArea.top,
      bottom: mobileSysInfo.screenHeight - mobileSysInfo.safeArea.bottom
    }
  }

  // Android fallback
  return {
    top: mobileSysInfo.statusBarHeight || 0,
    bottom: mobileSysInfo.screenHeight - mobileSysInfo.windowHeight || 0
  }
};

export function createApp() {
  const app = createSSRApp(App);
  const pinia = Pinia.createPinia();
  app.use(pinia);
  app.use(uviewPlus)
  
  // 挂载全局用户信息
  const userStore = useLoginStore();
  app.config.globalProperties.$globalUserInfoXn = userStore.userInfoXn;
  app.config.globalProperties.$globalUserInfoGz = userStore.userInfoGz;
  app.config.globalProperties.$safeAreaInfo = safeAreaInfo();
  return {
    app,
	Pinia, // 这里保持原样导出 Pinia 类库
	pinia, // 导出 pinia 实例
  }
}
// #endif