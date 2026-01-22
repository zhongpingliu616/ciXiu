<template>
  <view class="nav" :style="{ top: statusBar + 'rpx' }">
    <view class="bar">
      <slot name="left">
        <up-icon name="arrow-left" color="#fff" size="40rpx" @click="back"></up-icon>
		  <!-- <image
		    class="back"
		    src="@/static/images/back_icon.png"
		    @click="back"
		  /> -->
	  </slot>
	  <view class="title-wrap">
		  <slot name="title">
			<text class="title">{{ title }}</text>
		  </slot>
	  </view>
	  <view class="bar-right">
		  <slot name="right">
				
		  </slot>
	  </view>
    </view>
  </view>
</template>

<script name="navigation" setup>
defineProps({
  title: String
})

const statusBar = uni.getSystemInfoSync().statusBarHeight;

function back() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.nav {
	position: sticky;
	top: 40rpx;
	z-index: 888;
}
.bar {
  height: 80rpx;
  display: grid;  
  grid-template-columns: 80rpx 1fr 120rpx;
  align-items: center;
  justify-items: center;
}
.back {
  width: 36rpx;
  height: 36rpx;
  margin-left: 18rpx;
}
.title {
  flex: 1;
  text-align: center;
  color: #fff;
  font-size: 28rpx;
}
</style>
