<template>
	<view class="page-wrap buy-page">
		<LayoutNavigation :title="title" />
		
		<view class="page-content">
			<!-- NFT Product Card -->
			<view class="card product-card">
				<image class="product-img" src="https://cdn.uviewui.com/uview/album/1.jpg" mode="aspectFill"></image>
				<view class="product-info">
					<view class="product-title">古韵民族丝绸非遗刺绣</view>
					<view class="product-id">ID: 234515665132</view>
					<view class="tags-row">
						<view class="tag">10元起购</view>
						<text class="trend">比昨日上涨0.05%</text>
					</view>
					<view class="price-row">
						<text class="current-price">¥188.00</text>
						<text class="original-price">¥198.00</text>
					</view>
				</view>
			</view>

			<!-- Amount Card -->
			<view class="card amount-card">
				<view class="section-title">
					<view class="red-bar"></view>
					<text>买入金额</text>
				</view>
				<view class="input-wrapper">
					<text class="currency-symbol">¥</text>
					<u-input
						v-model="buyAmount"
						type="number"
						border="none"
						placeholder="最低买入10.00元，买入无限额"
						placeholderStyle="color: #ccc; font-size: 28rpx;"
						:customStyle="{ fontSize: '36rpx' }"
					/>
				</view>
				<view class="quick-amounts">
					<view 
						class="amount-tag" 
						v-for="amount in [2000, 3000, 5000]" 
						:key="amount"
						@click="buyAmount = amount"
					>
						¥ {{ amount }}
					</view>
				</view>
			</view>

			<!-- Payment Method Card -->
			<view class="card method-card" @click="showPaymentPopup = true">
				<view class="section-title">
					<view class="red-bar"></view>
					<text>付款方式</text>
				</view>
				<view class="selected-method">
					<text>{{ currentPaymentMethod.name }}</text>
					<u-icon name="arrow-down" color="#999" size="28"></u-icon>
				</view>
			</view>
		</view>

		<!-- Footer Button -->
		<view class="footer-bar">
			<CxComfirmBtn 
			text="立即买入" 
			@click="handleBuy" />
		</view>

		<!-- Payment Popup -->
		<u-popup
			:show="showPaymentPopup"
			mode="bottom"
			:round="20"
			:closeable="true"
			closeIconPos="top-right"
			@close="showPaymentPopup = false"
			:customStyle="{ width: '100%', maxWidth: '100%', background: 'transparent' }"
		>
			<view class="payment-list-warpper">
				<!-- Title -->
				<view class="title">请选择付款方式</view>

				<!-- Payment List -->
				<view class="payment-list">
					<view
						class="payment-item"
						v-for="(item, index) in paymentMethods"
						:key="index"
						@click="selectPayment(index)"
					>
						<view class="left">
							<u-icon v-if="item.type === 'balance'" name="rmb-circle-fill" color="#FF6B00" size="44"></u-icon>
							<u-icon v-else-if="item.type === 'wechat'" name="weixin-fill" color="#07C160" size="44"></u-icon>
							<u-icon v-else-if="item.type === 'alipay'" name="zhifubao-circle-fill" color="#1677FF" size="44"></u-icon>
							<text class="method-name">{{ item.name }}</text>
						</view>
						<u-icon name="checkmark-circle-fill" color="#FF4D4F" size="30rpx" v-if="selectedPaymentIndex == index"></u-icon>
						<uni-icons type="circle" color="#ccc" size="30" v-else></uni-icons>
					</view>
				</view>

				<!-- Buttons -->
				<view class="btn-group">
					<CxComfirmBtn 
						text="取消" 
						@click="showPaymentPopup = false"
						:btnStyle="{
							flex: 1,
							marginRight: '10px',
							background: 'transparent',
							border: '2px solid #fff',
							color: '#fff',
						}" />
					<CxComfirmBtn 
						text="确定" 
						@click="confirmPayment"
						:btnStyle="{
							flex: 1,
							background: 'linear-gradient(90deg, #ff6b6b, #ff9c6b)',
							color: '#fff',
						}" />
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script setup name="recharge">
import { ref, computed, getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const safeTopValue = (proxy.$safeAreaInfo.top + 80) +'rpx';

const title = ref("NFT藏品-买入");
const buyAmount = ref('');
const showPaymentPopup = ref(false);
const selectedPaymentIndex = ref(0);

const paymentMethods = ref([
	{ name: '账户余额(¥ 956.26)', type: 'balance' },
	{ name: '微信支付', type: 'wechat' },
	{ name: '支付宝支付', type: 'alipay' }
]);

const currentPaymentMethod = computed(() => {
	return paymentMethods.value[selectedPaymentIndex.value];
});

const selectPayment = (index) => {
	selectedPaymentIndex.value = index;
};

const confirmPayment = () => {
	showPaymentPopup.value = false;
};

const handleBuy = () => {
	if (!buyAmount.value) {
		uni.showToast({ title: '请输入买入金额', icon: 'none' });
		return;
	}
	if (Number(buyAmount.value) < 10) {
		uni.showToast({ title: '最低买入10元', icon: 'none' });
		return;
	}
	
	uni.showLoading({ title: '处理中...' });
	setTimeout(() => {
		uni.hideLoading();
		uni.navigateTo({
			url: '/pages/gz/collectibles/payment-result'
		});
	}, 1500);
};

const btnStyle = {
	background: 'linear-gradient(90deg, #FF6B4B, #FF4141)',
	color: '#fff',
	fontSize: '32rpx',
	height: '88rpx',
	fontWeight: 'bold',
	border: 'none'
};
</script>

<style lang="scss" scoped>
.page-wrap {
	background:url("/static/images/collection-detail/collection-detail-top-bg.png") no-repeat center top/contain, 
	url("/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr 0rpx;
}


.page-content {
	padding: 24rpx;
}

.card {
	background: #fff;
	border-radius: 24rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
}

/* Product Card */
.product-card {
	display: flex;
	
	.product-img {
		width: 180rpx;
		height: 180rpx;
		border-radius: 16rpx;
		margin-right: 24rpx;
		background: #f5f5f5;
	}
	
	.product-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		
		.product-title {
			font-size: 30rpx;
			font-weight: bold;
			color: #333;
		}
		
		.product-id {
			font-size: 24rpx;
			color: #999;
		}
		
		.tags-row {
			display: flex;
			align-items: center;
			
			.tag {
				background: #E3F2FD;
				color: #1976D2;
				font-size: 20rpx;
				padding: 2rpx 12rpx;
				border-radius: 8rpx;
				margin-right: 16rpx;
			}
			
			.trend {
				font-size: 20rpx;
				color: #999;
			}
		}
		
		.price-row {
			display: flex;
			align-items: baseline;
			
			.current-price {
				font-size: 36rpx;
				font-weight: bold;
				color: #FF4141;
				margin-right: 16rpx;
			}
			
			.original-price {
				font-size: 24rpx;
				color: #ccc;
				text-decoration: line-through;
			}
		}
	}
}

/* Section Title Shared */
.section-title {
	display: flex;
	align-items: center;
	margin-bottom: 24rpx;
	
	.red-bar {
		width: 6rpx;
		height: 28rpx;
		background: #FF4141;
		margin-right: 12rpx;
		border-radius: 4rpx;
	}
	
	text {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}
}

/* Amount Card */
.amount-card {
	.input-wrapper {
		display: flex;
		align-items: center;
		border-bottom: 1px solid #eee;
		padding-bottom: 16rpx;
		margin-bottom: 24rpx;
		
		.currency-symbol {
			font-size: 40rpx;
			font-weight: bold;
			color: #333;
			margin-right: 20rpx;
		}
	}
	
	.quick-amounts {
		display: flex;
		justify-content: space-between;
		
		.amount-tag {
			width: 30%;
			height: 64rpx;
			line-height: 64rpx;
			text-align: center;
			border: 1px solid #eee;
			border-radius: 32rpx;
			font-size: 26rpx;
			color: #666;
			
			&:active {
				background: #f5f5f5;
			}
		}
	}
}

/* Method Card */
.method-card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	
	.section-title {
		margin-bottom: 0;
	}
	
	.selected-method {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #666;
		
		text {
			margin-right: 10rpx;
		}
	}
}

/* Footer */
.footer-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 20rpx 30rpx 40rpx;
	background: transparent;
	z-index: 100;
	box-sizing: border-box;
}

/* Popup */
.payment-list-warpper {
  padding: 20px;
  background-color: #7a1e28;
  border-radius: 20px 20px 0 0;

  .title {
	font-size: 18px;
	color: #fff;
	text-align: center;
	margin-bottom: 20px;
	font-weight: bold;
  }
}

.payment-list {
  margin-bottom: 30px;
  
  .payment-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15px 0;
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	
	&:last-child {
	  border-bottom: none;
	}
	
	.left {
		display: flex;
		align-items: center;
		
		.method-name {
			color: #fff;
			font-size: 16px;
			margin-left: 10px;
		}
	}
  }
}

.btn-group {
  display: flex;
  gap: 10px;
}
</style>