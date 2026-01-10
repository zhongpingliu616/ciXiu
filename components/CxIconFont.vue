<template>
  <text
    class="iconfont"
    :style="{ fontSize: size, color }"
    v-html="code"
  >
    
  </text>
</template>

<script setup>
defineProps({
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
</script>

<style>
.iconfont {
  font-family: "CustomFont";
}
</style>
