<template>
	<view class="page-wrap income-index">
		<LayoutNavigation title="我的收益">
			<template #left>
				<view></view>
			</template>
			<template #right>
				<u-icon name="more-dot-fill" color="#fff" size="38rpx"></u-icon>
			</template>
		</LayoutNavigation>
		<view class="page-content">
			<!-- 账户余额卡片 -->
			<view class="balance-card">
				<view class="card-top">
					<view class="balance-info">
						<text class="label">账户余额 (RWVA)</text>
						<text class="amount">{{ $globalUserInfoXn.amount }}</text>
						<text class="note">仅每周三10:00-12:00提现</text>
					</view>
					<view class="action-btns">
						<CxComfirmBtn 
							text="提现" 
							:btnStyle="{
								background: '#FF4D4F', 
								color: '#fff', 
								width: '140rpx', 
								height: '60rpx',
								marginBottom: '16rpx',
								fontSize: '28rpx',
								borderRadius: '100rpx'
							}"
							@click="handleWithdraw"
						></CxComfirmBtn>
						<CxComfirmBtn 
							text="充值" 
							:btnStyle="{
								background: 'transparent', 
								color: '#333', 
								width: '140rpx', 
								height: '60rpx',
								borderColor: '#333',
								fontSize: '28rpx',
								borderRadius: '100rpx',
								plain: true
							}"
							@click="() => { uni.navigateTo({ url: '/pages/xn/income/recharge' }) }"
						></CxComfirmBtn>
					</view>
				</view>
				<view class="card-bottom">
					<view class="stat-item">
						<text class="stat-label">已到账收益(元)</text>
						<text class="stat-value">{{ $globalUserInfoXn.income }}</text>
					</view>
					<view class="stat-divider"></view>
					<view class="stat-item">
						<text class="stat-label">待到账收益(元)</text>
						<text class="stat-value">{{ $globalUserInfoXn.forecast_income }}</text>
					</view>
				</view>
			</view>

			<!-- 提现方式 -->
			<view class="section-title">提现资料</view>
			<view class="withdraw-method-card" @click="showWithdrawalMethod=true">
				<view class="method-left">
					<image src="/static/images/income/bank-card.png" class="bank-icon" mode="aspectFit" v-if="false"></image>
					
					<u-icon name="rmb-circle-fill" color="#E60012" size="50rpx" customStyle="margin-right: 20rpx"></u-icon>
					<text class="method-name">提现信息</text>
				</view>
				<view class="method-right">
					<text class="bank-name">更新</text>
					<u-icon name="arrow-right" color="#999" size="28rpx"></u-icon>
				</view>
			</view>

			<!-- 分期收益 -->
			<view class="section-title">分期收益</view>
			<view class="income-list">
				<view class="income-item" v-for="(item, index) in incomeList" :key="index" @click="handleItemClick(item)">
					<view class="item-icon">
						<u-icon name="server-fill" color="#fff" size="40rpx"></u-icon>
					</view>
					<view class="item-content">
						<view class="item-row-top">
							<text class="item-title">{{ item.title }}</text>
							<text class="item-amount">￥{{ item.amount }}</text>
						</view>
						<view class="item-desc">{{ item.desc }}</view>
					</view>
				</view>
			</view>
		</view>
		<LayoutCustomBarXn />
	</view>
<up-popup :show="showWithdrawalMethod" zIndex="998" mode="right" :duration="100" safeAreaInsetTop customStyle="width: 750rpx;">
	  <KeepAlive>
		<XnIncomeWithdrawalMethod @close="closeSearch"></XnIncomeWithdrawalMethod>
	  </KeepAlive>
</up-popup>
</template>

<script setup>
let showWithdrawalMethod = ref(false);
const incomeList = ref([
	{ title: '国风非遗刺绣', amount: '500.00', desc: '绣娘50% 平台30% 绣娘公益基金20%' },
	{ title: '国风非遗刺绣', amount: '500.00', desc: '绣娘50% 平台30% 绣娘公益基金20%' },
	{ title: '国风非遗刺绣', amount: '500.00', desc: '绣娘50% 平台30% 绣娘公益基金20%' },
	{ title: '国风非遗刺绣', amount: '500.00', desc: '绣娘50% 平台30% 绣娘公益基金20%' },
]);

const handleWithdraw = () => {
	uni.navigateTo({
		url: '/pages/xn/income/withdraw-cash'
	});
};

const handleItemClick = (item) => {
	// 这里假设点击分期收益项可以跳转到某种详情，比如押金退还详情（根据任务描述关联）
	// 实际业务中可能不同，这里为了演示跳转到退款详情页
	uni.navigateTo({
		url: '/pages/xn/income/refund-detail'
	});
};
const closeSearch = ()=>{
	showWithdrawalMethod.value = false;
};
onMounted(() => {
	console.log('收益页面加载');
});
</script>

<style lang="scss" scoped>
.income-index {
	background: #77171D url("/static/images/index/bg.png") repeat center top/contain;
	min-height: 100vh;
}

.page-content {
	padding: 30rpx;
}

.balance-card {
	background: linear-gradient(135deg, #F3D89F 50%,RGBA(239, 228, 195, .8) 100%);
	border-radius: 24rpx;
	padding: 40rpx 30rpx;
	margin-bottom: 40rpx;
	box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1);
	
	.card-top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 40rpx;
		
		.balance-info {
			display: flex;
			flex-direction: column;
			
			.label {
				font-size: 28rpx;
				color: #666;
				margin-bottom: 10rpx;
			}
			
			.amount {
				font-size: 60rpx;
				color: #4A3B2A;
				font-weight: bold;
				margin-bottom: 10rpx;
				font-family: Arial, Helvetica, sans-serif;
			}
			
			.note {
				font-size: 24rpx;
				color: #999;
			}
		}
		
		.action-btns {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
		}
	}
	
	.card-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid rgba(169, 142, 100, 0.2);
		padding-top: 20rpx;
		
		.stat-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			
			.stat-label {
				font-size: 26rpx;
				color: #666;
				margin-bottom: 8rpx;
			}
			
			.stat-value {
				font-size: 32rpx;
				color: #4A3B2A;
				font-weight: bold;
			}
		}
		
		.stat-divider {
			width: 1px;
			height: 60rpx;
			background: rgba(169, 142, 100, 0.2);
			margin: 0 20rpx;
		}
	}
}

.section-title {
	font-size: 30rpx;
	color: #fff; // 深色背景下白色标题
	margin-bottom: 20rpx;
	font-weight: bold;
}

.withdraw-method-card {
	background: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 40rpx;
	
	.method-left {
		display: flex;
		align-items: center;
		
		.method-name {
			font-size: 30rpx;
			color: #333;
			font-weight: bold;
		}
	}
	
	.method-right {
		display: flex;
		align-items: center;
		
		.bank-name {
			font-size: 28rpx;
			color: #666;
			margin-right: 10rpx;
		}
	}
}

.income-list {
	.income-item {
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
		
		.item-icon {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			background: #1F5994;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-right: 24rpx;
			flex-shrink: 0;
		}
		
		.item-content {
			flex: 1;
			
			.item-row-top {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 10rpx;
				
				.item-title {
					font-size: 30rpx;
					font-weight: bold;
					color: #333;
				}
				
				.item-amount {
					font-size: 32rpx;
					color: #551A1F; // 深红色
					font-weight: bold;
				}
			}
			
			.item-desc {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
}
</style>
