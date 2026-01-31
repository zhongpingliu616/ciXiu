<template>
  <view class="tab-bar">
    <view
      v-for="item in tabs"
      :key="item.path"
      class="tab-item"
      :class="{ active: current === item.path }"
      @tap="go(item.path)"
    >
      <image
        class="icon"
        :src="current === item.path ? item.activeIcon : item.icon"
      />
      <text>{{ item.text }} </text>
    </view>
  </view>
</template>

<script setup>
const tabs = [
  {
    path: '/pages/index',
    text: '首页',
    icon: '/static/images/index_gray_icon.png',
    activeIcon: '/static/images/index_active_icon.png'
  },
  {
    path: '/pages/gz/collectibles/index',
    text: '藏品',
    icon: '/static/images/order_gray_icon.png',
    activeIcon: '/static/images/order_active_icon.png'
  },
  {
    path: '/pages/gz/income/index',
    text: '资产',
    icon: '/static/images/income_gray_icon.png',
    activeIcon: '/static/images/income_active_icon.png'
  },
  {
    path: '/pages/gz/my/index',
    text: '我的',
    icon: '/static/images/my_gray_icon.png',
    activeIcon: '/static/images/my_active_icon.png'
  }
];

const current = ref("")

const updateCurrentPath = () => {
  const pages = getCurrentPages();
  if (pages.length > 0) {
    current.value = '/' + pages[pages.length - 1].route
  }
}

onMounted(() => {
  updateCurrentPath()
})

defineExpose({
  updateCurrentPath
})

function go(path) {
  if (path === current.value) return;
  uni.switchTab({ url: path });
}
</script>

<style lang="scss" scoped>

.tab-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 120rpx;
  background: linear-gradient(0deg, #7B191F 0%, #B64138 100%);
  // border-top-left-radius: 60rpx;
  // border-top-right-radius: 60rpx;
  display: flex;
  border-top: 2rpx solid #F3D89E;
  border-bottom: none;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #caaaaa;
  font-size: 22rpx;
}

.tab-item.active {
  color: #fff3cf;
}

.icon {
  width: 44rpx;
  height: 44rpx;
  margin-bottom: 6rpx;
}
</style>
