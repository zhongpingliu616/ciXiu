<template>
	<view class="page-wrap index">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<image class="logo" src="/static/logo.png"></image>
		</view>
	 <XnTabBar></XnTabBar> />
	</view>
</template>


<script setup name="model">
	
	
</script>

<style lang="scss" scoped>
.page-wrap{
	background: 
	url("/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr 120rpx;
}		
	
</style>