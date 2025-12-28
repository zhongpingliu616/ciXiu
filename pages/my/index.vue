<template>
	<view class="page-wrap">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<image class="logo" src="/static/logo.png"></image>
			<view class="text-area">
				<text class="title">{{title}}</text>
			</view>
		</view>
	<LayoutBottom></LayoutBottom>
	</view>
</template>

<script setup>
let title = ref("my");
onMounted(() => {
  console.log('我的页面：', title)
});
onShow(() => {
})
</script>

<style lang="scss" scoped>
	.logo{
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
