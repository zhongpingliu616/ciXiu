<template>
	<view class="page-wrap my-page">
		<!-- 头部区域 -->
		<view class="header-section">
			<LayoutNavigation title="我的" :isBack="false" />
		</view>
		
		<view class="page-content">
			<view class="user-info-wrap" @click="handleProfileClick">
				<view class="user-info">
					<view class="avatar-wrap">
						<image class="avatar" src="https://cdn.uviewui.com/uview/album/1.jpg" mode="aspectFill"></image>
					</view>
					<view class="info-content">
						<text class="nickname">李柳柳</text>
						<view class="phone-tag">
							<text>145***6589</text>
						</view>
					</view>
					<u-icon name="arrow-right" color="#fff" size="28rpx" class="arrow-icon"></u-icon>
				</view>
			</view>
			<!-- 我的订单 -->
			<view class="section-card order-section">
				<view class="section-header">
					<text class="section-title">我的订单</text>
					<view class="more-link" @click="handleOrderClick('all')">
						<text>全部</text>
						<u-icon name="arrow-right" color="#999" size="24rpx"></u-icon>
					</view>
				</view>
				<view class="order-grid">
					<view class="grid-item" @click="handleOrderClick('all')">
						<image src="/static/images/my/order_gray_icon.png" class="grid-icon" mode="widthFix" v-if="false"></image>
						<!-- 使用图标模拟设计稿 -->
						<u-icon name="grid" size="50rpx" color="#333"></u-icon>
						<text class="grid-text">全部</text>
					</view>
					<view class="grid-item" @click="handleOrderClick('grabbed')">
						<u-icon name="file-text" size="50rpx" color="#333"></u-icon>
						<text class="grid-text">已抢单</text>
					</view>
					<view class="grid-item" @click="handleOrderClick('progress')">
						<view class="icon-wrap">
							<u-icon name="clock" size="50rpx" color="#333"></u-icon>
							<view class="badge">9</view>
						</view>
						<text class="grid-text">进行中</text>
					</view>
					<view class="grid-item" @click="handleOrderClick('delivered')">
						<u-icon name="rmb-circle" size="50rpx" color="#333"></u-icon>
						<text class="grid-text">已交付</text>
					</view>
				</view>
			</view>

			<!-- 我的作品 -->
			<view class="works-section">
				<CommonTitleList
					title="我的作品"
					moreText="全部作品 >"
					@more="handleWorksMore"
				>
					<view class="collection-content">
						<CxScrollView
							class="list"
							ref="cxScrollViewRef"
							:list="worksList"
							:config="{
								direction: 'x',
								visibleCount: 3,
								gap:'10rpx'
							}"
							@click="workItemClick"
						> 
							<template #item="{item}">
								<view class="work-item">
									<image class="work-img" mode="aspectFill" :src="item.src"></image>
								</view>
							</template>
						</CxScrollView>
					</view>
				</CommonTitleList>
			</view>

			<!-- 功能列表 -->
			<view class="menu-list">
				<u-cell-group :border="false">
					<u-cell
						title="我的动态"
						:isLink="true"
						:border="false"
						customStyle="padding: 30rpx 30rpx; background-color: #fff; border-radius: 16rpx 16rpx 0 0; font-size: 28rpx"
						class="cell-item"
					>
						<template #title>
						    <text class="cell-title">我的动态</text>
						  </template>
						<template #icon>
							<image style="width: 30rpx; height: 30rpx; background-color: #eeeeee;" mode="aspectFill" src="@/static/images/user/dynamic.png" ></image>&nbsp;&nbsp;
						</template>
					</u-cell>
					<u-cell
						title="电子合同"
						:isLink="true"
						:border="false"
						customStyle="padding: 30rpx 30rpx; background-color: #fff; border-radius: 0 0 16rpx 16rpx;"
						class="cell-item"
						@click="navigateToContract"
					>
						<template #title>
						    <text class="cell-title">电子合同</text>
						  </template>
						<template #icon>
							
							<image style="width: 30rpx; height: 30rpx; background-color: #eeeeee;" mode="aspectFill" src="@/static/images/user/contract.png" ></image>&nbsp;&nbsp; 
						</template>
					</u-cell>
				</u-cell-group>
			</view>

			<!-- 退出登录 -->
			<view class="logout-btn">
				<CxComfirmBtn text="退出登录"
				:btnStyle="{
					color: '#F56C6C', 
					background: '#fff', 
					border: 'none', 
					borderRadius: '16rpx',
					height: '100rpx',
					fontSize: '32rpx'
				}"
				@click="handleLogout"
				></CxComfirmBtn>
			</view>
		</view>
		<LayoutBottom></LayoutBottom>
	</view>
	<CxModal
	  v-model:show="showClearModal"
	  content="确定要退出登录吗？"
	  @confirm="confirmClear"
	/>
</template>

<script setup>
let showClearModal = ref(false);
const title = ref("我的");

// 作品数据
const worksList = ref([
	{ src: 'https://cdn.uviewui.com/uview/album/1.jpg', id: 1 },
	{ src: 'https://cdn.uviewui.com/uview/album/2.jpg', id: 2 },
	{ src: 'https://cdn.uviewui.com/uview/album/3.jpg', id: 3 },
	// { src: 'https://cdn.uviewui.com/uview/album/4.jpg', id: 4 },
	// { src: 'https://cdn.uviewui.com/uview/album/5.jpg', id: 5 },
]);

// 订单点击
const handleOrderClick = (type) => {
	console.log('Order click:', type);
	let tabIndex = 0;
	switch (type) {
		case 'all':
			tabIndex = 0;
			break;
		case 'grabbed': // 已抢单 -> 待发货 (或待支付，看具体业务，这里假设已抢单对应待发货)
			// 注意：这里需要确认业务逻辑。
			// "已抢单"可能对应 "待支付" 或 "待发货"。
			// 假设流程是：抢单 -> 支付 -> 发货。
			// 如果已抢单是指刚抢到还没支付，那就是待支付(index 1)。
			// 如果是指已经接单正在做，那就是待发货(index 2)。
			// 根据 grid-text "已抢单"，通常指待支付或待发货。
			// 设计稿里有"进行中"，"已交付"。
			// "已抢单" -> ToPaid (待支付)
			tabIndex = 1; 
			break;
		case 'progress': // 进行中 -> 待发货 (制作中)
			tabIndex = 2;
			break;
		case 'delivered': // 已交付 -> 已交付
			tabIndex = 3;
			break;
		default:
			tabIndex = 0;
	}
	
	uni.navigateTo({
		url: `/pages/orders/order-management?tabIndex=${tabIndex}`
	});
};

// 作品更多点击
const handleWorksMore = () => {
	console.log('Works more');
	uni.navigateTo({
		url: '/pages/my/work-management'
	});
};

// 作品项点击
const workItemClick = ({item, index}) => {
	console.log('Work item click:', item);
};

// 跳转电子合同
const navigateToContract = () => {
	uni.navigateTo({
		url: '/pages/level/electronic-contract'
	});
};
const confirmClear = ()=>{
	uni.reLaunch({
		url: '/pages/my/login'
	});
};
// 退出登录
const handleLogout = () => {
	showClearModal.value = true;
};

// 跳转个人资料编辑
const handleProfileClick = () => {
	uni.navigateTo({
		url: '/pages/my/profile-edit'
	});
};

onMounted(() => {
  console.log('我的页面加载');
});
</script>

<style lang="scss" scoped>
.cell-title {
  font-size: 24rpx;
  color: #303133;
}
.cell-item{
	border-bottom: 1rpx solid rgba(105, 30, 35, 0);
}
.header-section {
	// 移除独立的背景图，让整体背景透出来，或者使用专门的顶部背景
	// background: url("/static/images/user/login-bg.png") no-repeat center top/cover;
	padding-bottom: 40rpx;
	padding-top: 20rpx;
}

.avatar-wrap {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	border: 4rpx solid #F4E5BC;
	overflow: hidden;
	margin-right: 24rpx;
	
	.avatar {
		width: 100%;
		height: 100%;
	}
}

.nickname {
	font-size: 36rpx;
	font-weight: bold;
	color: #fff;
	display: block;
	margin-bottom: 10rpx;
}

.phone-tag {
	display: inline-block;
	background: rgba(0, 0, 0, 0.3); // 加深背景色，增加对比度
	padding: 4rpx 20rpx;
	border-radius: 24rpx;
	border: 1px solid rgba(255, 255, 255, 0.2);
	
	text {
		font-size: 24rpx;
		color: #ddd;
	}
}
.info-content {
	flex: 1;
}

.arrow-icon {
	margin-left: 20rpx;
	opacity: 0.8;
}
.user-info {
	display: flex;
	align-items: center;
	padding: 40rpx 32rpx;
}

.page-content {
	padding: 0 24rpx;
	// margin-top: -60rpx; // 既然背景是统一的，可能不需要负 margin 了，或者保留用于层叠效果
	position: relative;
	z-index: 1;
}

.section-card {
	background: #fff;
	border-radius: 24rpx;
	padding: 30rpx 20rpx; // 减小左右内边距
	margin-bottom: 30rpx;
}

.order-section {
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 40rpx; // 增加头部和Grid的间距
		padding: 0 10rpx;
		
		.section-title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
		
		.more-link {
			display: flex;
			align-items: center;
			
			text {
				font-size: 26rpx;
				color: #999;
				margin-right: 6rpx;
			}
		}
	}
	
	.order-grid {
		display: flex;
		justify-content: space-around; // 改为 space-around
		
		.grid-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative; // 为了 icon-wrap 的定位
			
			.grid-icon {
				width: 50rpx;
				height: 50rpx;
				margin-bottom: 16rpx;
			}
			
			.icon-wrap {
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				
				.badge {
					position: absolute;
					top: -12rpx;
					right: -16rpx;
					background: #ff4d4f;
					color: #fff;
					font-size: 20rpx;
					padding: 0 8rpx;
					border-radius: 20rpx;
					min-width: 32rpx;
					height: 32rpx;
					line-height: 32rpx;
					text-align: center;
					border: 2rpx solid #fff; // 增加白色描边
				}
			}
			
			.grid-text {
				font-size: 26rpx;
				color: #333;
				margin-top: 16rpx;
			}
		}
	}
}
::v-deep{
	.cx-scroll-item:nth-child(3n + 1){
		.work-item{
			border-top-left-radius: 20rpx;
			border-bottom-left-radius: 20rpx;
		}
		
	}
	
	.cx-scroll-item:nth-child(3n){
		.work-item{
			border-top-right-radius: 20rpx;
			border-bottom-right-radius: 20rpx;
		}
	}	
}
.works-section {
	margin-bottom: 30rpx;
	
	// 如果 CommonTitleList 的标题是白色的，这里不需要额外改，只要背景是深色即可
	
	.collection-content {
		height: 230rpx; 
		margin-top: 20rpx;
	}
	
	.work-item {
		height: 220rpx;
		overflow: hidden;
		border: 2rpx solid #F4E5BC;
		background-color: #333;
		
		.work-img {
		}
	}
}

.menu-list {
	margin-bottom: 40rpx;
	border-radius: 24rpx;
	overflow: hidden;
}

.logout-btn {
	margin-bottom: 60rpx;
}
</style>
