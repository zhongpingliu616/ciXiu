<template>
  <text
    class="iconfont"
    :style="{ fontSize: size, color }"
  >{{ iconContent }}</text>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  code: String,      // &#xe61a;
  size: {
    type: String,
    default: '32rpx'
  },
  color: {
    type: String,
    default: '#333'
  }
})

const iconContent = computed(() => {
  if (!props.code) return '';
  // 匹配 &#xe61a; (十六进制) 或 &#58906; (十进制)
  if (props.code.startsWith('&#')) {
    const content = props.code.replace('&#', '').replace(';', '');
    if (content.startsWith('x')) {
      return String.fromCharCode(parseInt(content.substring(1), 16));
    } else {
      return String.fromCharCode(parseInt(content, 10));
    }
  }
  return props.code;
})
</script>

<style>
.iconfont {
  font-family: "CustomFont";
}
</style>
