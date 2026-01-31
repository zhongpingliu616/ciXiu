<template>
	<view class="page-wrap collection-detail">
		<LayoutNavigation :title="title">
			<template #right>
				<up-icon name="share-square" size="48rpx" color="#fff" @click="onShare" />
			</template>
		</LayoutNavigation>
		
		<scroll-view scroll-y class="page-content">
			<!-- NFT Information Card -->
			<view class="info-card">
				<view class="card-header">
					<text class="product-id">藏品ID:234515665132</text>
					<text class="date">2025-12-19 15:00:00</text>
				</view>

				<view class="price-section">
					<view class="left-price">
						<text class="main-price">32.08</text>
						<view class="change-info">
							<text class="change-val">+2.92</text>
							<text class="change-percent">+10.01%</text>
						</view>
					</view>
					<view class="right-stats">
						<view class="stat-row">
							<text class="label">高</text>
							<text class="value red">32.08</text>
							<text class="label">开</text>
							<text class="value red">29.89</text>
							<text class="label">量</text>
							<text class="value">13万手</text>
						</view>
						<view class="stat-row">
							<text class="label">低</text>
							<text class="value green">29.89</text>
							<text class="label">换</text>
							<text class="value">10.59%</text>
							<text class="label">额</text>
							<text class="value">45.5万</text>
						</view>
					</view>
				</view>
				
				<view class="divider" @click="toggleNftInfo">
					<view class="arrow-icon">
						<u-icon name="arrow-down" color="#ccc" size="24rpx"></u-icon>
					</view>
				</view>

				<view class="nft-details" v-show="!isNftInfoCollapsed">
					<view class="section-title">
						<view class="red-bar"></view>
						<text>NFT信息</text>
					</view>
					<view class="stats-grid">
						<view class="grid-item">
							<text class="label">最 高</text>
							<text class="value red">32.08</text>
						</view>
						<view class="grid-item">
							<text class="label">今 开</text>
							<text class="value red">32.08</text>
						</view>
						<view class="grid-item">
							<text class="label">最 低</text>
							<text class="value red">29.89</text>
						</view>
						<view class="grid-item">
							<text class="label">昨 收</text>
							<text class="value">29.16</text>
						</view>
						<view class="grid-item">
							<text class="label">成交量</text>
							<text class="value">13万手</text>
						</view>
						<view class="grid-item">
							<text class="label">换手率</text>
							<text class="value">29.16</text>
						</view>
						<view class="grid-item">
							<text class="label">成交额</text>
							<text class="value">45.5万</text>
						</view>
						<view class="grid-item">
							<text class="label">振 幅</text>
							<text class="value">7.51%</text>
						</view>
						<view class="grid-item">
							<text class="label">市盈(静)</text>
							<text class="value">62.00</text>
						</view>
						<view class="grid-item">
							<text class="label">每股收益</text>
							<text class="value">0.61</text>
						</view>
						<view class="grid-item">
							<text class="label">市盈(TTM)</text>
							<text class="value">53.01</text>
						</view>
						<view class="grid-item">
							<text class="label">每股净资产</text>
							<text class="value">11.73</text>
						</view>
						<view class="grid-item">
							<text class="label">流通股本</text>
							<text class="value">12.7万</text>
						</view>
						<view class="grid-item">
							<text class="label">总市值</text>
							<text class="value">456万</text>
						</view>
						<view class="grid-item">
							<text class="label">流通市值</text>
							<text class="value">420万</text>
						</view>
						<view class="grid-item">
							<text class="label">市净值</text>
							<text class="value">2.73</text>
						</view>
					</view>
					<view class="collapse-arrow" @click="toggleNftInfo">
						<u-icon :name="isNftInfoCollapsed ? 'arrow-down' : 'arrow-up'" color="#ccc" size="24rpx"></u-icon>
					</view>
				</view>
			</view>

			<!-- Trend Chart -->
			<DigitalLineChart />

			<!-- Image Display -->
			<view class="image-card">
				<u-swiper :list="swiperList" 
				height="600rpx" 
				indicator
				border-radius="20"></u-swiper>
			</view>

			<!-- Product Title & Price -->
			<view class="product-card">
				<view class="product-title">古韵民族丝绸非遗刺绣</view>
				<view class="product-sub">
					<text>超153人围观</text>
					<text class="growth">近一年净增长值: <text class="red">5.44%</text></text>
				</view>
				<view class="price-row">
					<view class="price-wrap">
						<text class="symbol">¥</text>
						<text class="amount">666.66</text>
						<text class="original">¥3999.66</text>
					</view>
					<view class="buy-tag">10元起购</view>
				</view>
			</view>

			<!-- Product Details -->
			<view class="detail-card">
				<view class="section-title">
					<view class="red-bar"></view>
					<text>藏品详情</text>
				</view>
				<view class="detail-content">
					<view class="text-p">创作过程文案创作过程文案创作过程文案创作过程文案创作过程文案创作过程文案创作过程文案创作过程文案创作过程文案</view>
					<u-image width="100%" mode="widthFix" src="https://cdn.uviewui.com/uview/album/1.jpg" style="margin: 20rpx 0; border-radius: 12rpx;"></u-image>
					<view class="text-p">创作过程文案创作过程文案创作过程文案创作过程文案创作过程文案创作过程文案创作过程文案创作过程文案</view>
				</view>
			</view>
			
			<view style="height: 160rpx;"></view>
		</scroll-view>

		<!-- Footer -->
		<view class="footer-bar">
			<view class="left-icons">
				<view class="icon-item" @click="handleService">
					<u-icon name="server-man" size="40rpx" color="#fff"></u-icon>
					<text>客服</text>
				</view>
				<view class="icon-item" @click="handleLike">
					<u-icon name="heart" size="40rpx" color="#fff"></u-icon>
					<text>喜欢</text>
				</view>
			</view>
			<view class="right-btns">
				<view class="gradient-btn-item shopping-cart" @click="handleAddToCart">
					<view class="gradient-button">
						
					</view>
					<view class="button-inner">
						加入购物车
						<!-- <view class="update-tip">
							需要升等级
						</view> -->
					</view>
				</view>
				
				<view class="gradient-btn-item buy-now" :class="{'filter-gray':false}" @click="handleBuyNow">
					<view class="gradient-button">
						
					</view>
					<view class="button-inner">
						立即购买
					</view>
				</view>
			</view>
			
			<!-- Floating Cart -->
			<view class="floating-cart">
				<navigator url="/pages-gz/my/shopping-cart" open-type="navigate">
					<u-icon name="shopping-cart" size="44rpx" color="#FFE185"></u-icon>
				    <view class="badge">10</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script setup name="detail-nft">
import DigitalLineChart from '@/components/gz/nft/DigitalLineChart.vue';

const title = ref("NFT藏品详情");
const isNftInfoCollapsed = ref(false);
const swiperList = ref([
    'https://cdn.uviewui.com/uview/album/1.jpg',
    'https://cdn.uviewui.com/uview/album/2.jpg',
    'https://cdn.uviewui.com/uview/album/3.jpg',
]);

const toggleNftInfo = () => {
	isNftInfoCollapsed.value = !isNftInfoCollapsed.value;
};

const onShare = () => {
	console.log('Share clicked');
};

const handleService = () => {
	uni.showToast({ title: '客服', icon: 'none' });
};

const handleLike = () => {
	uni.showToast({ title: '已喜欢', icon: 'none' });
};

const handleAddToCart = () => {
	uni.showToast({ title: '已加入购物车', icon: 'success' });
};

const handleBuyNow = () => {
	uni.navigateTo({ url: '/pages-gz/collectibles/recharge' });
};
</script>

<style lang="scss" scoped>
.page-wrap {
	background:url("/static/images/collection-detail/collection-detail-top-bg.png") no-repeat center top/contain, 
	url("/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr 0rpx;
}

.page-content {
	flex: 1;
	padding: 24rpx;
	box-sizing: border-box;
}

.image-card{
	border-radius: 20rpx;
	overflow: hidden;
	margin-bottom: 24rpx;
	border: 2rpx solid $app-border-color;
}

.info-card, .product-card, .detail-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
}
/* Info Card Styles */
.card-header {
	display: flex;
	justify-content: space-between;
	font-size: 24rpx;
	color: #999;
	margin-bottom: 20rpx;
}

.price-section {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20rpx;
}

.left-price {
	.main-price {
		font-size: 60rpx;
		font-weight: bold;
		color: #FF4141;
		line-height: 1;
	}
	.change-info {
		display: flex;
		gap: 10rpx;
		margin-top: 10rpx;
		font-size: 24rpx;
		color: #FF4141;
		font-weight: bold;
	}
}

.right-stats {
	flex: 1;
	margin-left: 40rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	font-size: 22rpx;
	
	.stat-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8rpx;
		
		.label {
			color: #999;
		}
		.value {
			color: #333;
			font-weight: 500;
			&.red { color: #FF4141; }
			&.green { color: #00C853; }
		}
	}
}

.divider {
	display: flex;
	justify-content: center;
	padding-bottom: 10rpx;
	border-bottom: 1rpx solid #eee;
	margin-bottom: 20rpx;
}

.section-title {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	
	.red-bar {
		width: 6rpx;
		height: 30rpx;
		background: #FF4141;
		margin-right: 12rpx;
		border-radius: 4rpx;
	}
}

.stats-grid {
	display: flex;
	flex-wrap: wrap;
	
	.grid-item {
		width: 25%;
		margin-bottom: 20rpx;
		
		.label {
			display: block;
			font-size: 22rpx;
			color: #999;
			margin-bottom: 4rpx;
		}
		.value {
			font-size: 26rpx;
			color: #333;
			font-weight: 500;
			&.red { color: #FF4141; }
		}
	}
}

.collapse-arrow {
	display: flex;
	justify-content: center;
	margin-top: 10rpx;
}

/* Product Card */
.product-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 16rpx;
}

.product-sub {
	display: flex;
	justify-content: space-between;
	font-size: 24rpx;
	color: #999;
	margin-bottom: 24rpx;
	
	.growth .red {
		color: #FF4141;
	}
}

.price-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	
	.price-wrap {
		.symbol {
			font-size: 28rpx;
			color: #FF4141;
			font-weight: bold;
		}
		.amount {
			font-size: 48rpx;
			font-weight: bold;
			color: #FF4141;
			margin-right: 16rpx;
		}
		.original {
			font-size: 24rpx;
			color: #999;
			text-decoration: line-through;
		}
	}
	
	.buy-tag {
		background: #E3F2FD;
		color: #1976D2;
		font-size: 22rpx;
		padding: 4rpx 16rpx;
		border-radius: 20rpx;
	}
}

/* Detail Card */
.detail-content {
	font-size: 26rpx;
	color: #666;
	line-height: 1.6;
	
	.text-p {
		text-indent: 2em;
		margin-bottom: 10rpx;
	}
}

/* Footer */
.footer-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 110rpx;
	background: #A31B1B; /* Match bottom bar color */
	display: flex;
	align-items: center;
	padding: 0 24rpx;
	box-sizing: border-box;
	z-index: 100;
	box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.1);
	border-top: 1rpx solid rgba(255,255,255,0.1);
}

.left-icons {
	display: flex;
	margin-right: 40rpx;
	
	.icon-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-right: 30rpx;
		
		text {
			font-size: 20rpx;
			color: #fff;
			margin-top: 4rpx;
		}
	}
}
.shopping-cart{
	.gradient-button{		
		border-radius: 20rpx 10rpx 6rpx 40rpx;
		background: linear-gradient(90deg, #F3D89E, #F5EAC9);
		transform: skewY(-15deg) rotateZ(15deg); 
	}
	.update-tip{
		position: absolute;
		top: -38rpx;
		right: -82rpx;
		padding: 0rpx 20rpx;
		background: #FE3A3A;
		border-radius: 30rpx;
		border-bottom-left-radius:0;
		color: #fff;
		font-size: 18rpx;
		z-index: 2;
	}
	.button-inner{
		color: #805536;
	}
}
.gradient-button {
  width: 200rpx;
  height: 60rpx;
  line-height: 60rpx;
  background: linear-gradient(90deg, #ff4136, #ff8533);
  border: 2rpx solid #ffc107;
  border-radius: 10rpx 40rpx 20rpx 6rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  
  font-weight: bold;
  transform: skewY(-15deg) rotateZ(15deg);
}
.button-inner{
	position: absolute;
	inset: 0;
	text-align: center;
	vertical-align: middle;
	color: white;
}
.gradient-btn-item{
	display: inline-block;
	position: relative;
  line-height: 60rpx;
	
}
.right-btns {
	flex: 1;
	display: flex;
	justify-content: flex-end;
	gap: 20rpx;
	
	.btn {
		height: 72rpx;
		line-height: 72rpx;
		padding: 0 40rpx;
		border-radius: 36rpx;
		font-size: 28rpx;
		font-weight: bold;
		text-align: center;
		
		&.cart-btn {
			background: #FFE0B2;
			color: #E65100;
		}
		
		&.buy-btn {
			background: #FF4141;
			color: #fff;
			background-image: linear-gradient(90deg, #FF6B4B, #FF4141);
		}
	}
}

.floating-cart {
	position: absolute;
	right: 30rpx;
	bottom: 140rpx;
	width: 80rpx;
	height: 80rpx;
	background: #FF4141;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.2);
	border: 4rpx solid $app-border-color;
	
	.badge {
		position: absolute;
		top: -10rpx;
		right: -10rpx;
		background: #1890FF;
		color: #fff;
		font-size: 20rpx;
		padding: 2rpx 10rpx;
		border-radius: 20rpx;
		border: 2rpx solid #fff;
	}
}
</style>
