<template>
	<view class="page-wrap digital-products">
		<LayoutNavigation :title="title" />
		
		<view class="page-content">
			<!-- 价格概览卡片 -->
			<view class="price-overview-card">
				<view class="header">
					<text class="label">NFT</text>
					<text class="tag">+12.63%</text>
				</view>
				
				<view class="main-price">
					<text class="currency">80.36</text>
				</view>
				
				<view class="sub-info">
					<text class="convert">≈ 70.36NFT</text>
					<view class="stats">
						<view class="stat-row">
							<text class="label">24H最高</text>
							<text class="value">78.30</text>
						</view>
						<view class="stat-row">
							<text class="label">24H最低</text>
							<text class="value">60.32</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 趋势图组件 -->
			<DigitalProductChart />
			
		</view>
		
		<!-- 底部按钮 -->
		<view class="footer-btns">
			<CxComfirmBtn
				text="持有" 
				:btnStyle="{
					background: 'transparent',
					color: '#F3D89E'
				}"
				@click="handleHold"
			/>&nbsp;&nbsp;
			<CxComfirmBtn 
				text="兑换" 
				:btnStyle="{
				}"
				@click="handleExchange"
			/>
		</view>
	</view>
</template>

<script setup name="digital-products">
import { ref } from 'vue';
import DigitalProductChart from '@/components/gz/nft/DigitalProductChart.vue';

let title = ref("NFT数字产品");	

const handleHold = () => {
	console.log('点击持有');
};

const handleExchange = () => {
	console.log('点击兑换');
};
</script>

<style lang="scss" scoped>
.page-wrap {
	background: url("/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr 140rpx;
}

.page-content {
	padding: 0 30rpx;
	overflow-y: auto;
}

.price-overview-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	margin-top: 20rpx;
	
	.header {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		
		.label {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-right: 16rpx;
		}
		
		.tag {
			background: #E8F5E9;
			color: #4CAF50;
			font-size: 24rpx;
			padding: 4rpx 12rpx;
			border-radius: 8rpx;
		}
	}
	
	.main-price {
		margin-bottom: 16rpx;
		
		.currency {
			font-size: 60rpx;
			font-weight: bold;
			color: #00C853;
		}
	}
	
	.sub-info {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		
		.convert {
			font-size: 28rpx;
			color: #666;
		}
		
		.stats {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
			
			.stat-row {
				display: flex;
				align-items: center;
				margin-bottom: 8rpx;
				
				&:last-child {
					margin-bottom: 0;
				}
				
				.label {
					font-size: 24rpx;
					color: #999;
					margin-right: 16rpx;
				}
				
				.value {
					font-size: 26rpx;
					font-weight: bold;
					color: #333;
					min-width: 80rpx;
					text-align: right;
				}
			}
		}
	}
}

.footer-btns {
	display: flex;
	justify-content: space-between;
	padding: 20rpx 40rpx 40rpx;
	background: transparent;
	
	.btn {
		width: 46%;
		height: 88rpx;
		border-radius: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 32rpx;
		font-weight: bold;
		
		&.hold-btn {
			background: transparent;
			border: 2rpx solid #F3D89E;
			color: #F3D89E;
		}
		
		&.exchange-btn {
			background: linear-gradient(90deg, #FF6B4B 0%, #FF4141 100%);
			color: #fff;
		}
	}
}
</style>