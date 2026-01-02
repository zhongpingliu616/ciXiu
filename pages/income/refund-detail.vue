<template>
	<view class="page-wrap refund-detail">
		<LayoutNavigation title="押金退还" />
		<view class="page-content">
			<!-- 状态卡片 -->
			<view class="status-card">
				<view class="status-header">
					<text class="status-title">退款成功</text>
				</view>
				<view class="status-desc">
					成功退款 <text class="highlight">46574</text> 元，已原路退还至您的绣娘钱包
				</view>
				<view class="status-time">2023-10-10 14:00:00</view>
			</view>

			<!-- 标题卡片 -->
			<view class="info-card">
				<view class="info-title">押金退还</view>
				<view class="info-time">2023-10-10 14:00:00</view>
			</view>

			<!-- 详情列表 -->
			<view class="detail-card">
				<view class="detail-title">退款明细</view>
				
				<view class="detail-item">
					<text class="label">订单编号</text>
					<text class="value">5826279794481</text>
				</view>
				<view class="detail-item">
					<text class="label">订单数量</text>
					<text class="value">1</text>
				</view>
				<view class="detail-item">
					<text class="label">申请金额</text>
					<text class="value">¥131.4</text>
				</view>
				<view class="detail-item">
					<text class="label">退款去向</text>
					<text class="value">绣娘钱包</text>
				</view>
				<view class="detail-item">
					<text class="label">退款原因</text>
					<text class="value">--</text>
				</view>
				<view class="detail-item">
					<text class="label">退款说明</text>
					<text class="value">--</text>
				</view>
				<view class="detail-item">
					<text class="label">退款凭证</text>
					<text class="value">--</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
	console.log('退款详情页加载');
});
</script>

<style lang="scss" scoped>
.refund-detail {
	background: #77171D url("/static/images/index/bg.png") repeat center top/contain;
	min-height: 100vh;
}

.page-content {
	padding: 30rpx;
}

.status-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	
	.status-header {
		margin-bottom: 20rpx;
		
		.status-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #07C160; // 成功绿色
		}
	}
	
	.status-desc {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 10rpx;
		line-height: 1.5;
		
		.highlight {
			color: #FF4D4F;
			font-weight: bold;
			margin: 0 4rpx;
		}
	}
	
	.status-time {
		font-size: 24rpx;
		color: #999;
	}
}

.info-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	
	.info-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}
	
	.info-time {
		font-size: 24rpx;
		color: #999;
	}
}

.detail-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	
	.detail-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
	}
	
	.detail-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 24rpx;
		
		&:last-child {
			margin-bottom: 0;
		}
		
		.label {
			font-size: 28rpx;
			color: #666;
		}
		
		.value {
			font-size: 28rpx;
			color: #333;
		}
	}
}
</style>
