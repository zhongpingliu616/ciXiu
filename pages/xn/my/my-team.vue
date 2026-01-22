<template>
	<view class="page-wrap my-team">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<!-- Stats Section -->
			<view class="stats-grid">
				<view class="stats-row">
					<view class="stats-item">
						<view class="stats-value">{{ stats.totalPromote || 12 }}</view>
						<view class="stats-label">累计推广人数</view>
					</view>
					<view class="stats-item">
						<view class="stats-value">{{ stats.directPromote || 5 }}</view>
						<view class="stats-label">直接推广人数</view>
					</view>
					<view class="stats-item">
						<view class="stats-value">{{ stats.indirectPromote || 7 }}</view>
						<view class="stats-label">间接推广人数</view>
					</view>
				</view>
				<view class="stats-row">
					<view class="stats-item">
						<view class="stats-value">{{ stats.depositReduction || '12382.00' }}</view>
						<view class="stats-label">押金减免额度</view>
					</view>
					<view class="stats-item">
						<view class="stats-value">{{ stats.directRevenue || '4234.56' }}</view>
						<view class="stats-label">直接推广收益</view>
					</view>
					<view class="stats-item">
						<view class="stats-value">{{ stats.indirectRevenue || '42349.34' }}</view>
						<view class="stats-label">间接推广收益</view>
					</view>
				</view>
			</view>

			<!-- Notice Section -->
			<view class="notice-box">
				<view class="notice-title">
					<uni-icons custom-prefix="iconfont" type="icon-dengpao" size="30rpx" color="#ffffff"></uni-icons>&nbsp;
					温馨提示
				</view>
				<view class="notice-content">
					您发展来的下级在通过平台资料审核后被纳入到您名下有直推，您将获得押金减免额度和直推收益
				</view>
			</view>

			<!-- Ranking Card -->
			<view class="ranking-card">
				<view class="card-header">
					<view class="header-left">
						<view class="red-bar"></view>
						<text class="title">团队排行（共{{ teamList.length }}人）</text>
					</view>
					<view class="revenue-btn" @click="goToRevenue">
						推广收益明细
						<u-icon name="arrow-right" color="#fff" size="24rpx" style="margin-left: 4rpx;"></u-icon>
					</view>
				</view>

				<!-- Search Bar -->
				<view class="search-bar">
					<input type="text" placeholder="输入账号/姓名" v-model="keyword" class="search-input" placeholder-class="placeholder-style" />

					<u-icon name="search" color="#999" size="42rpx" style="margin-right: 10rpx;"></u-icon>
				</view>

				<!-- Team List -->
				<view class="team-list">
					<view class="team-item" v-for="(item, index) in teamList" :key="index">
						<image class="avatar" :src="item.avatar || '/static/images/public_logo.png'" mode="aspectFill"></image>
						<view class="item-info">
							<view class="name-row">
								<text class="name">{{ item.name }}</text>
								<view class="tag">直推{{ item.directCount }}人</view>
							</view>
							<view class="account">账号：{{ item.account }}</view>
						</view>
						<view class="item-right">
							<view class="revenue">¥{{ item.totalRevenue }}</view>
							<view class="order-count">共{{ item.orderCount }}单</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- Bottom Button -->
		<view class="fixed-bottom">
			<CxComfirmBtn 
				text="我的推广码" 
				@click="goToCode"
			/>
		</view>
	</view>
</template>

<script setup name="myTeam">
import { ref } from 'vue'

const title = ref('我的团队')
const keyword = ref('')

const stats = ref({
	totalPromote: 12,
	directPromote: 5,
	indirectPromote: 7,
	depositReduction: '12382.00',
	directRevenue: '4234.56',
	indirectRevenue: '42349.34'
})

const teamList = ref([
	{
		name: '张萌新',
		avatar: 'https://picsum.photos/100?random=1',
		directCount: 23,
		account: '56375678',
		totalRevenue: '5581.00',
		orderCount: 49
	},
	{
		name: '李梦一',
		avatar: 'https://picsum.photos/100?random=2',
		directCount: 21,
		account: '56375678',
		totalRevenue: '5581.00',
		orderCount: 49
	},
	{
		name: '何先森',
		avatar: 'https://picsum.photos/100?random=3',
		directCount: 20,
		account: '56375678',
		totalRevenue: '5581.00',
		orderCount: 49
	}
])

const goToRevenue = () => {
	uni.navigateTo({
		url: '/pages/xn/my/promotion-revenue'
	})
}

const goToCode = () => {
	uni.navigateTo({
		url: '/pages/xn/my/promotion-code'
	})
}
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
	padding-bottom: 200rpx;
}

.stats-grid {
	margin-bottom: 30rpx;
}

.stats-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 30rpx;
}

.stats-item {
	flex: 1;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stats-value {
	font-size: 40rpx;
	font-weight: bold;
	color: #fff;
	margin-bottom: 8rpx;
	font-family: Arial, Helvetica, sans-serif;
}

.stats-label {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

.notice-box {
	background: rgba(255, 255, 255, 0.1);
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 30rpx;
}

.notice-title {
	display: flex;
	align-items: center;
	font-size: 28rpx;
	color: #fff;
	font-weight: bold;
	margin-bottom: 12rpx;
}

.notice-content {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	line-height: 1.5;
}

.ranking-card {
	background: #fff;
	border-radius: 30rpx;
	min-height: 500rpx; // Ensure it fills bottom part visually if needed
	padding: 30rpx;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.header-left {
	display: flex;
	align-items: center;
}

.red-bar {
	width: 8rpx;
	height: 32rpx;
	background: #FF4D4F;
	border-radius: 4rpx;
	margin-right: 16rpx;
}

.title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.revenue-btn {
	background: linear-gradient(90deg, #FF8E53 0%, #FF6B6B 100%);
	border-radius: 30rpx;
	padding: 8rpx 20rpx;
	font-size: 22rpx;
	color: #fff;
	display: flex;
	align-items: center;
}

.search-bar {
	background: #F5F5F5;
	border-radius: 40rpx;
	height: 72rpx;
	display: flex;
	align-items: center;
	padding: 0 30rpx;
	margin-bottom: 30rpx;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.placeholder-style {
	color: #999;
}

.team-list {
	
}

.team-item {
	display: flex;
	align-items: center;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
	
	&:last-child {
		border-bottom: none;
	}
}

.avatar {
	width: 88rpx;
	height: 88rpx;
	border-radius: 50%;
	margin-right: 20rpx;
	background-color: #eee;
}

.item-info {
	flex: 1;
}

.name-row {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;
}

.name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-right: 12rpx;
}

.tag {
	font-size: 20rpx;
	color: #999;
	border: 1rpx solid #ddd;
	border-radius: 20rpx;
	padding: 2rpx 12rpx;
}

.account {
	font-size: 24rpx;
	color: #999;
}

.item-right {
	text-align: right;
}

.revenue {
	font-size: 30rpx;
	color: #FF4D4F;
	font-weight: bold;
	margin-bottom: 8rpx;
}

.order-count {
	font-size: 22rpx;
	color: #666;
	background: #F5F5F5;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	display: inline-block;
}

.fixed-bottom {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 30rpx 60rpx calc(40rpx + constant(safe-area-inset-bottom));
	padding: 30rpx 60rpx calc(40rpx + env(safe-area-inset-bottom));
	z-index: 100;
	// background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%); // Optional fade
}
</style>