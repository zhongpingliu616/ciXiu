<template>
  <view class="container">
    <text>收益页面</text>
    <LayoutCustomBarGz ref="customBarRef" />
  </view>
</template>

<script setup>
const customBarRef = ref(null)

onShow(() => {
  customBarRef.value?.updateCurrentPath()
})
</script>

<style scoped>
.container {
  padding: 20px;
}
</style>
