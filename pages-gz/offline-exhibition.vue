<template>
	<view class="page-wrap offline-exhibition">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="content-card">
				<view class="card-title">
					<view class="red-bar"></view>
					<text class="title-text">双十二 · 线下展会</text>
				</view>
				<view class="card-text">
					<view class="p">双十二狂欢盛典 · 线下展会活动通知</view>
					<view class="p">各位合作伙伴、新老客户及各界朋友：</view>
					<view class="p indent">为抢抓双十二消费热潮，搭建产品展示、商贸洽谈、互动体验的优质平台，我们特举办双十二线下展会活动，诚邀您莅临现场，共赴盛会、共享福利日！</view>
				</view>
			</view>
		</view>
		<view class="footer-btn">
			<CxComfirmBtn
				text="立即报名"
				@click="handleRegister"
			/>
		</view>
	</view>
</template>

<script setup name="offlineExhibition">
const title = ref('双十二 · 线下展会');

const handleRegister = () => {
	uni.navigateTo({
		url: '/pages-gz/register-exhibition'
	})
};
</script>

<style lang="scss" scoped>
.page-wrap {
	background: url("/static/images/index/bg.png") no-repeat center/cover;
	display: flex;
	flex-direction: column;
	height: 100vh;
	/* Adjust grid-template-rows if inherited from global styles, but flex is safer here */
}

.page-content {
	flex: 1;
	padding: 30rpx;
	overflow-y: auto;
}

.content-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 40rpx 30rpx;
}

.card-title {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
	
	.red-bar {
		width: 8rpx;
		height: 32rpx;
		background: #FF4141;
		margin-right: 16rpx;
		border-radius: 4rpx;
	}
	
	.title-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}
}

.card-text {
	font-size: 18rpx;
	color: #333;
	line-height: 1.8;
	text-align: justify;
	
	.p {
		margin-bottom: 10rpx;
	}
	
	.indent {
		text-indent: 2em;
	}
}

.footer-btn {
	padding: 20rpx 30rpx 60rpx;
	background: transparent;
}
</style>