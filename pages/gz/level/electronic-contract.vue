<template>
	<view class="page-wrap index">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			  <view class="container">
				<view class="scroll-view-wrap">
			      <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper"
						@scrolltolower="lower" @scroll="scroll">
						<view class="scroll-view-content">
							
							
							14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
							
							
							14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
							
							
							14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
							
							
							14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
							
							
							14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
							
							
							14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
							
							
							14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
							
							
							14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
							
							
							14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
							
							
							14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
							
							
							14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
							
							
							14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
							
							
							14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
							
							
							14.1本协议适用中华人民共和国法律, 14.2 甲方网络培训平台规则作为本协议的重要补充，与本协议具有同等法律效力，请乙方仔
						</view>
					</scroll-view>
				</view>
				<view class="enter-wrap">
					<CommonComfirmBtn text="确认" :loading="loading" @click="handleEnter" />				
				</view>
			</view>
		</view>
	</view>
</template>


<script setup name="electronic-contract">
const title = ref("电子合同");
let loading = ref(false);
const handleEnter = () => {
		loading.value = true;
		setTimeout(() => {
		  loading.value = false;
		  uni.showToast({
			title: '已确认',
			icon: 'success'
		  });
		}, 3000);
	};	
</script>

<style lang="scss" scoped>
.page-wrap{
		background: url("/static/images/user/login-bg.png") no-repeat;
		background-size: cover;
		grid-template-rows: 80rpx 1fr 0rpx;
	}
.container{
	padding: 24rpx;
	border-radius: 20rpx;
	background: #fff;
	border: 4rpx solid #F3D89E;
	margin-top: 42rpx;
	height: calc(100% - 100rpx);
}
.scroll-view-wrap{
	height: calc(100% - 224rpx);
	background: url("/static/images/grab-order/electronic-contract-border.png") no-repeat;
	background-size: cover;
	padding: 32rpx;
}
.scroll-Y {
		height: 100%;
	}	
.scroll-view-content{
	
}
.enter-wrap{
		width: 90%;
		margin: 0 auto;
		margin-top: 32rpx;
	}
</style>