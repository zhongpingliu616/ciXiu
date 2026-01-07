import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getConfigList } from '@/api/index';

export const useConfigStore = defineStore('config', () => {
  // 定义配置状态
  const config = ref({});

  // 从本地缓存初始化（持久化恢复）
  const storedConfig = uni.getStorageSync('appConfig');
  if (storedConfig) {
    config.value = storedConfig;
  }

  // 获取配置列表 Action
  async function fetchConfig() {
    try {
      const res = await getConfigList();
      if (res.code === 200) {
        config.value = res.data;
        // 持久化保存
        uni.setStorageSync('appConfig', res.data);
      } else {
        console.error('获取配置失败:', res.msg);
      }
    } catch (error) {
      console.error('获取配置异常:', error);
    }
  }

  // 获取单个配置项的方法（可选辅助函数）
  function getConfig(key) {
    return config.value[key];
  }

  return {
    config,
    fetchConfig,
    getConfig
  };
});
