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
    path: '/pages/xn/orders/index',
    text: '订单',
    icon: '/static/images/order_gray_icon.png',
    activeIcon: '/static/images/order_active_icon.png'
  },
  {
    path: '/pages/xn/income/index',
    text: '收益',
    icon: '/static/images/income_gray_icon.png',
    activeIcon: '/static/images/income_active_icon.png'
  },
  {
    path: '/pages/xn/my/index',
    text: '我的',
    icon: '/static/images/my_gray_icon.png',
    activeIcon: '/static/images/my_active_icon.png'
  }
];

const current = ref("")

onShow(() => {
  const pages = getCurrentPages();
  current.value = '/' + pages[pages.length - 1].route
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
  height: 124rpx;
  background: #77171d;
  border-top-left-radius: 60rpx;
  border-top-right-radius: 60rpx;
  display: flex;
  border: 8rpx solid #F3D89E;
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
