<template>
	<view class="page-wrap promotion-revenue">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="list-container">
				<view class="list-item" v-for="(item, index) in listData" :key="index">
					<view class="item-main">
						<view class="item-title">{{ item.title }}</view>
						<view class="item-time">{{ item.create_time }}</view>
					</view>
					<view class="item-amount">+ {{ item.amount }}</view>
				</view>
			</view>
		</view>
		<view></view>
	</view>
</template>

<script setup name="promotionRevenue">
import { ref } from 'vue'

const title = ref('收益明细')
const listData = ref([
	{
		title: '推广用户注册认证获得押金减免额度',
		create_time: '2025-12-29 21:49:37',
		amount: '10.00'
	},
	{
		title: '直推人员获得收益',
		create_time: '2025-12-29 21:49:37',
		amount: '10.00'
	},
	{
		title: '间推人员获得收益',
		create_time: '2025-12-29 21:49:37',
		amount: '10.00'
	},
	{
		title: '直推人员获得收益',
		create_time: '2025-12-29 21:49:37',
		amount: '10.00'
	}
])
</script>

<style lang="scss" scoped>
.page-wrap {
	min-height: 100vh;
	background-image: url('/static/images/index/bg.png');
	background-color: #691e23;
	background-size: cover;
	background-attachment: fixed;
	display: flex;
	flex-direction: column;
}

.page-content {
	flex: 1;
	padding: 30rpx;
}

.list-container {
	background: #FFFFFF;
	border-radius: 20rpx;
	padding: 0 30rpx;
	overflow: hidden;
}

.list-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 0;
	border-bottom: 1rpx solid #F5F5F5;
	
	&:last-child {
		border-bottom: none;
	}
}

.item-main {
	flex: 1;
	margin-right: 20rpx;
}

.item-title {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 12rpx;
	line-height: 1.4;
}

.item-time {
	font-size: 24rpx;
	color: #999;
}

.item-amount {
	font-size: 32rpx;
	color: #FF4D4F;
	font-weight: bold;
	flex-shrink: 0;
}
</style>