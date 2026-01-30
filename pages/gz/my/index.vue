<template>
	<view class="page-wrap my-page">
		<LayoutNavigation :title="title" > 
			<template #left>
				<view></view>
			</template>
		</LayoutNavigation>
		<view class="page-content">
			<!-- 用户信息区域 -->
			<view class="user-header">
				<view class="user-info">
					<image class="avatar" src="/static/images/my/avatar_default.png" mode="aspectFill"></image>
					<view class="info-content">
						<view class="nickname">南田玉暖</view>
						<view class="phone-tag">
							<image class="phone-icon" src="/static/images/common/phone_icon.png" mode="widthFix"></image>
							<text>18888888888</text>
						</view>
					</view>
					<view class="header-icons">
						<image class="icon-btn" src="/static/images/my/service_icon.png" mode="widthFix"></image>
						<image class="icon-btn" src="/static/images/my/setting_icon.png" mode="widthFix"></image>
					</view>
				</view>
				
				<view class="stats-row">
					<view class="stat-item" @click="goTo('/pages/gz/income/index')">
						<view class="stat-num">12</view>
						<view class="stat-label">账户余额</view>
					</view>
					<view class="stat-item" @click="goTo('/pages/gz/my/orders')">
						<view class="stat-num">62</view>
						<view class="stat-label">我的订单</view>
					</view>
					<view class="stat-item" @click="goTo('/pages/gz/collectibles/index')">
						<view class="stat-num">20.00</view>
						<view class="stat-label">我的资产</view>
					</view>
					<view class="stat-item">
						<view class="stat-num">45</view>
						<view class="stat-label">我的喜欢</view>
					</view>
				</view>
			</view>

			<!-- 我的订单入口 -->
			<view class="section-card order-section">
				<view class="section-header" @click="goTo('/pages/gz/my/orders')">
					<text class="section-title">我的订单</text>
					<view class="section-more">
						全部订单 <uni-icons type="right" size="12" color="#999"></uni-icons>
					</view>
				</view>
				<view class="order-grid">
					<view class="grid-item" @click="goToOrders(1)">
						<u-icon name="rmb-circle" size="50rpx" color="#333"></u-icon>
						<text class="grid-text">待付款</text>
					</view>
					<view class="grid-item" @click="goToOrders(2)">
						<u-icon name="car" size="50rpx" color="#333"></u-icon>
						<text class="grid-text">待发货</text>
					</view>
					<view class="grid-item" @click="goToOrders(3)">
						<u-icon name="gift" size="50rpx" color="#333"></u-icon>
						<text class="grid-text">待收货</text>
					</view>
					<view class="grid-item" @click="goToOrders(4)">
						<u-icon name="server-man" size="50rpx" color="#333"></u-icon>
						<text class="grid-text">退款售后</text>
					</view>
				</view>
			</view>

			<!-- 活动Banner -->
			<view class="activity-bulletin-board">
				<view class="board-content">
					<view class="board-info">
						<text class="board-title">绣数坊-活动中心</text>
						<text class="board-desc">诚邀您参与各类收藏活动~~~</text>
					</view>
					<view class="board-btn">
						<text class="btn-text">去看看</text>
					</view>
				</view>
			</view>

			<!-- 我的藏品 -->
			<view class="section-header mt-30">
				<text class="section-title text-white">我的藏品</text>
				<view class="section-more text-white" @click="goTo('/pages/gz/collectibles/index')">
					查看全部 <uni-icons type="right" size="12" color="rgba(255,255,255,0.8)"></uni-icons>
				</view>
			</view>
			
			<view class="collection-list">
				<CommonProductCol :colNum="2" :productList="collectionList" @click="handleProductClick" />
			</view>
			
			<!-- 底部占位 -->
			<view style="height: 120rpx;"></view>
		</view>
		<LayoutCustomBarGz />
	</view>
</template>

<script setup name="myPage">
const title = ref('我的')

const collectionList = ref([
	{
		id: 1,
		title: '玄色 · 凤凰刺绣',
		image: `https://picsum.photos/seed/${Math.random()}/120/80`,
		description: '666.66',
		originalPrice: '3999.66',
		likeCount: 126,
		tag: 'NFT藏品',
		price: '153', // 借用字段显示围观人数
	},
	{
		id: 2,
		title: '玄色 · 凤凰刺绣凰刺绣凰刺绣凰刺绣',
		image: `https://picsum.photos/seed/${Math.random()}/120/80`,
		description: '666.66',
		originalPrice: '3999.66',
		likeCount: 126,
		tag: '实物藏品',
		price: '153',
	},
	{
		id: 3,
		title: '玄色 · 凤凰刺绣',
		image: `https://picsum.photos/seed/${Math.random()}/120/80`,
		description: '666.66',
		originalPrice: '3999.66',
		likeCount: 126,
		tag: 'NFT藏品',
		price: '153',
	},
	{
		id: 4,
		title: '玄色 · 凤凰刺绣',
		image: `https://picsum.photos/seed/${Math.random()}/120/80`,
		description: '666.66',
		originalPrice: '3999.66',
		likeCount: 126,
		tag: '实物藏品',
		price: '153',
	}
])

const goTo = (url) => {
	uni.navigateTo({ url })
}

const goToOrders = (type) => {
	uni.navigateTo({
		url: `/pages/gz/my/orders?type=${type}`
	})
}

const handleProductClick = (item) => {
	// 跳转详情
	console.log('click product', item)
}
</script>

<style lang="scss" scoped>
.page-wrap {
	background:url("/static/images/collection-detail/collection-detail-top-bg.png") no-repeat center top/contain, 
	url("/static/images/index/bg.png") no-repeat center/cover;
}

.page-content {
	padding: 0 30rpx;
	padding-top: 40rpx; // 调整顶部间距
}

.user-header {
	margin-bottom: 30rpx;
}

.user-info {
	display: flex;
	align-items: center;
	margin-bottom: 40rpx;
	
	.avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		border: 2rpx solid #fff;
		margin-right: 20rpx;
	}
	
	.info-content {
		flex: 1;
		color: #fff;
		
		.nickname {
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 10rpx;
		}
		
		.phone-tag {
			display: inline-flex;
			align-items: center;
			background: rgba(255,255,255,0.2);
			border-radius: 20rpx;
			padding: 4rpx 16rpx;
			font-size: 24rpx;
			
			.phone-icon {
				width: 24rpx;
				height: 24rpx;
				margin-right: 8rpx;
			}
		}
	}
	
	.header-icons {
		display: flex;
		gap: 20rpx;
		
		.icon-btn {
			width: 44rpx;
			height: 44rpx;
		}
	}
}

.stats-row {
	display: flex;
	justify-content: space-between;
	color: #fff;
	padding: 0 20rpx;
	
	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		
		.stat-num {
			font-size: 36rpx;
			font-weight: bold;
			margin-bottom: 10rpx;
		}
		
		.stat-label {
			font-size: 24rpx;
			opacity: 0.8;
		}
	}
}

.section-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
	
	.section-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		
		&.text-white {
			color: #fff;
		}
	}
	
	.section-more {
		font-size: 24rpx;
		color: #999;
		display: flex;
		align-items: center;
		
		&.text-white {
			color: rgba(255,255,255,0.8);
		}
	}
}

.mt-30 {
	margin-top: 30rpx;
}

.order-grid {
	display: flex;
	justify-content: space-around;
	
	.grid-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		
		.grid-text {
			font-size: 24rpx;
			color: #666;
			margin-top: 16rpx;
		}
	}
}

.activity-bulletin-board {
	width: 100%;
	height: 120rpx;
	background: linear-gradient(90deg, #1A1A1A 0%, #333333 100%);
	border-radius: 20rpx;
	padding: 2rpx;
	position: relative;
	overflow: hidden;
}

.activity-bulletin-board::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	border-radius: 20rpx;
	padding: 2rpx;
	background: linear-gradient(90deg, #D4AF37, #F5EAC9);
	-webkit-mask: 
		linear-gradient(#fff 0 0) content-box, 
		linear-gradient(#fff 0 0);
	-webkit-mask-composite: xor;
	mask-composite: exclude;
	pointer-events: none;
}

.board-content {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 40rpx;
	box-sizing: border-box;
	background: #2A2A2A;
	border-radius: 18rpx;
	position: relative;
}

/* 装饰背景 */
.board-content::after {
	content: '';
	position: absolute;
	right: 140rpx;
	top: 0;
	bottom: 0;
	width: 100rpx;
	background: linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.02) 100%);
	transform: skewX(-20deg);
}

.board-info {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	z-index: 1;
}

.board-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #F5EAC9;
	letter-spacing: 2rpx;
}

.board-desc {
	font-size: 24rpx;
	color: #999;
	max-width: 400rpx;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.board-btn {
	background: linear-gradient(90deg, #F3D89E, #F5EAC9);
	padding: 12rpx 36rpx;
	border-radius: 30rpx;
	z-index: 1;
}

.btn-text {
	font-size: 26rpx;
	color: #5C401F;
	font-weight: 600;
}

.collection-list {
	// padding-bottom: 120rpx;
}
</style>