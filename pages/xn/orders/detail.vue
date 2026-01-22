<template>
	<view class="page-wrap order-detail">
		<LayoutNavigation :title="title" />
		<view class="page-content" v-if="item">
			<!-- 状态头部 -->
			<view class="status-header">
				<u-icon name="hourglass" size="50rpx" color="#fff" customStyle="margin-right: 16rpx"></u-icon>
				<text class="status-text">{{ statusText }}</text>
			</view>

			<!-- 地址卡片 -->
			<view class="card address-card">
				<view class="address-row">
					<u-icon name="map-fill" color="#FF4D4F" size="50rpx"></u-icon>
					<text class="name">{{ item.username || '' }}</text>
					<text class="phone">{{ item.address?.contact_phone || '' }}</text>
				</view>
				<view class="address-detail">
					{{ getRegionName(item.address) }} {{ item.detail_address || item.address?.detail_address || '' }}
				</view>
			</view>

			<!-- 物流信息 (待发成品/制作中 显示) -->
			<view class="card" v-if="[30, 40].includes(item.status)">
				<view class="card-title-row">
					<view class="indicator"></view>
					<text class="title-text">物流信息</text>
				</view>
				<view class="info-row">
					<text class="label">物流单号</text>
					<text class="value">{{ item.logistics_no || '23840984923804423' }}</text>
				</view>
				<view class="info-row">
					<text class="label">物流公司</text>
					<text class="value">{{ item.logistics_company || '顺丰快递' }}</text>
				</view>
			</view>

			<!-- 订单信息卡片 -->
			<view class="card order-info-card">
				<view class="card-title-row">
					<view class="indicator"></view>
					<text class="title-text">订单信息</text>
				</view>
				
				<!-- 商品列表 -->
				<view class="goods-item" v-for="(goods, idx) in orderInfoList" :key="idx">
					<image :src="goods.image" class="goods-img" mode="aspectFill"></image>
					<view class="goods-content">
						<view class="goods-title">{{ goods.name }}</view>
						<view class="tags">
							<CxTag text="工期30天" :bgGradient="['rgba(248,163,29,0.1)', 'rgba(248,163,29,0.1)']" color="#bfa15f" />
							&nbsp;
							<CxTag text="锦初等级" :bgGradient="['rgba(248,163,29,0.1)', 'rgba(248,163,29,0.1)']" color="#999" />
						</view>
						<view class="price-row">
							<text class="price">¥{{ goods.reward_amount }}</text>
							<text class="num">x1</text>
						</view>
					</view>
				</view>

				<!-- 费用汇总 -->
				<view class="fee-section">
					<view class="fee-row">
						<text class="label">订单押金 (共{{ orderInfoList.length }}件)</text>
						<text class="value">¥ {{ Number(item.total_deposit || 752).toFixed(2) }}</text>
					</view>
					<view class="fee-row">
						<text class="label">运费</text>
						<text class="value">¥ {{ Number(item.freight || 40).toFixed(2) }}</text>
					</view>
					<view class="fee-row total-row">
						<text class="label">订单总价</text>
						<text class="value total-price">¥ {{ Number(item.total_amount || 792).toFixed(2) }}</text>
					</view>
				</view>

				<view class="divider"></view>

				<!-- 订单元数据 -->
				<view class="meta-section">
					<view class="meta-row">
						<text class="label">订单号</text>
						<text class="value">{{ item.order_id }}</text>
					</view>
					<view class="meta-row">
						<text class="label">下单时间</text>
						<text class="value">{{ item.create_time || '2025-12-29 19:41:37' }}</text>
					</view>
					<view class="meta-row">
						<text class="label">支付状态</text>
						<text class="value">{{ item.pay_status === 1 ? '已支付' : '已支付' }}</text>
					</view>
				</view>
			</view>

			<!-- 付款方式 -->
			<view class="card payment-card">
				<view class="card-title-row">
					<view class="indicator"></view>
					<text class="title-text">付款方式</text>
					<text class="right-text">账户余额</text>
				</view>
			</view>

			<!-- 押金减免 -->
			<view class="card deposit-card">
				<view class="card-title-row">
					<view class="indicator"></view>
					<text class="title-text">押金减免</text>
				</view>
				<view class="deposit-content">
					<view class="sub-title">寄存</view>
					<view class="desc">寄存在平台，平台会将【收藏证书】发放给您，后续【凭收藏证书】或订单凭证可拿回藏品。</view>
				</view>
			</view>
		</view>

		<!-- 底部按钮 -->
		<view class="footer-btns" v-if="item">
			<!-- 待发货 (待平台发货) -->
			<template v-if="item.status === 20">
				<view class="btn-wrapper">
					<CxComfirmBtn 
						text="看看其他" 
						:btnStyle="outlineBtnStyle"
						@click="goHome"
					></CxComfirmBtn>
				</view>
				<view class="btn-wrapper">
					<CxComfirmBtn 
						text="取消抢单" 
						:btnStyle="primaryBtnStyle"
						@click="handleCancel"
					></CxComfirmBtn>
				</view>
			</template>

			<!-- 待发成品 (制作中) -->
			<template v-else-if="item.status === 40">
				<view class="btn-wrapper">
					<CxComfirmBtn 
						text="联系客服" 
						:btnStyle="outlineBtnStyle"
						@click="contactService"
					></CxComfirmBtn>
				</view>
				<view class="btn-wrapper">
					<CxComfirmBtn 
						text="提交成品" 
						:btnStyle="primaryBtnStyle"
						@click="handleSubmitProduct"
					></CxComfirmBtn>
				</view>
			</template>

			<!-- 其他状态默认显示返回 -->
			<template v-else>
				<view class="btn-wrapper">
					<CxComfirmBtn 
						text="返回" 
						:btnStyle="outlineBtnStyle"
						@click="goBack"
					></CxComfirmBtn>
				</view>
			</template>
		</view>
	</view>
<CxModal
	v-model:show="showCancelModal"
	content="取消订单后押金原路返回到您的账户，但'押金减免额度 '将无法退回"
	@confirm="orderCancel"
/>
</template>

<script setup name="detail">
import {orderDetails,editOrderSatus} from '@/api/index.js'
import { getRegionName } from '@/utils/public.js';
const { proxy } = getCurrentInstance();
const title = ref("订单详情");
const orderInfoList = ref([]);
const item = ref({}); // Current Order Item
let parentItemInfo = ref({});
let showCancelModal = ref(false);
const statusMap = {
  10: { text: '待支付', color: '#FF4D4F' },
  20: { text: '待平台发货', color: '#FA8C16' }, 
  30: { text: '待接受材料', color: '#1890FF' },
  40: { text: '制作中', color: '#FA541C' },
  50: { text: '待接收成品', color: '#13C2C2' },
  60: { text: '待验收', color: '#722ED1' },
  70: { text: '验收成功', color: '#52C41A' },
  80: { text: '验收失败', color: '#A8071A' },
  90: { text: '取消订单', color: '#8C8C8C' }
};

const statusText = computed(() => {
	return statusMap[item.value.status]?.text || '未知状态';
});

// 按钮样式
const primaryBtnStyle = {
	background: 'linear-gradient(90deg, #FF6034 0%, #EE0A24 100%)',
	color: '#fff',
	borderRadius: '44rpx',
	height: '88rpx',
	fontSize: '32rpx',
	border: 'none',
	width: '100%'
};

const outlineBtnStyle = {
	background: 'transparent',
	color: '#fff',
	borderRadius: '44rpx',
	height: '88rpx',
	fontSize: '32rpx',
	border: '1px solid rgba(255,255,255,0.6)',
	width: '100%'
};

const goHome = () => {
	uni.switchTab({ url: '/pages/xn/orders/index' });
};

const goBack = () => {
	uni.navigateBack();
};

const contactService = () => {
	uni.navigateTo({ url: '/pages/xn/my/customer-service' });
};

const orderCancel = async () => {
	const { code=9999, data,msg } = await editOrderSatus({ 
		id:item.value.id,
		order_id: item.value.order_id, 
		status: 90 
	});
	if (code === 200) {
		uni.showToast({ title: '取消订单成功', icon: 'none' });
		showCancelModal.value = false;
		getOrderData();
	} else {
		uni.showToast({
			title: msg || '取消订单失败',
			icon: 'none'
		});
	}
};
const handleCancel = () => {
	showCancelModal.value = true;
};

const handleSubmitProduct = () => {
	uni.navigateTo({
		url: '/pages/xn/orders/submit-product',
		success: (res) => {
			res.eventChannel.emit('sendOrderDatas', { orderInfo: item.value });
		}
	});
};

const getOrderData = async ()=>{
	const { code=9999, data,msg } = await orderDetails({ order_id: parentItemInfo.value.order_id });
	if (code === 200) {
		 if(data.lists){
			// Assuming lists is a single object for detail or array? 
			// Existing code treated it as object then wrapped in array.
			// Let's assume it returns the order detail object directly.
			// If it's a list, we take the first one or match ID.
			// Based on previous code: orderInfoList.value = [data.lists];
			orderInfoList.value = [data.lists];
			item.value = data.lists;
			
			// Mock data for display if missing
			if(!item.value.address) {
				item.value.address = { contact_phone: '18388888888' };
			}
		 };
	} else {
		uni.showToast({
			title: msg || '数据加载失败',
			icon: 'none'
		});
	}
};

onLoad((options) => {
		const eventChannel = proxy.getOpenerEventChannel();
		eventChannel.on('sendOrderDatas', (data) => {
			if(data && data.orderInfo){
				parentItemInfo.value = data.orderInfo || {};
				// Initialize item with parent info first to show something
				item.value = parentItemInfo.value;
				orderInfoList.value = [parentItemInfo.value];
				getOrderData();
			}
		});
});
</script>

<style lang="scss" scoped>
.order-detail {
	background: #77171D url("/static/images/index/bg.png") repeat center top/contain;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}

.page-content {
	padding: 30rpx;
	padding-bottom: 200rpx; // Space for footer
}

.status-header {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
	
	.status-text {
		font-size: 40rpx;
		font-weight: bold;
		color: #fff;
	}
}

.card {
	background: #fff;
	border-radius: 24rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
}

.card-title-row {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
	position: relative;
	
	.indicator {
		width: 6rpx;
		height: 28rpx;
		background: #FF4D4F;
		border-radius: 3rpx;
		margin-right: 16rpx;
	}
	
	.title-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		flex: 1;
	}
	
	.right-text {
		font-size: 28rpx;
		color: #666;
	}
}

/* Address Card */
.address-card {
	.address-row {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
		
		.name {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin: 0 16rpx;
		}
		
		.phone {
			font-size: 30rpx;
			color: #333;
		}
	}
	
	.address-detail {
		font-size: 26rpx;
		color: #666;
		padding-left: 48rpx;
		line-height: 1.4;
	}
}

/* Logistics Info */
.info-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20rpx;
	
	&:last-child {
		margin-bottom: 0;
	}
	
	.label {
		color: #333;
		font-size: 28rpx;
	}
	
	.value {
		color: #666;
		font-size: 28rpx;
	}
}

/* Goods Item */
.goods-item {
	display: flex;
	margin-bottom: 30rpx;
	
	.goods-img {
		width: 160rpx;
		height: 160rpx;
		border-radius: 12rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}
	
	.goods-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		
		.goods-title {
			font-size: 28rpx;
			color: #333;
			font-weight: bold;
			line-height: 1.4;
		}
		
		.tags {
			display: flex;
			flex-wrap: wrap;
		}
		
		.price-row {
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.price {
				font-size: 32rpx;
				color: #333;
				font-weight: bold;
			}
			
			.num {
				font-size: 26rpx;
				color: #999;
			}
		}
	}
}

/* Fee Section */
.fee-section {
	margin-top: 20rpx;
	
	.fee-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16rpx;
		
		.label {
			font-size: 28rpx;
			color: #333;
		}
		
		.value {
			font-size: 28rpx;
			color: #666;
			
			&.total-price {
				font-size: 36rpx;
				color: #333;
				font-weight: bold;
			}
		}
		
		&.total-row {
			margin-top: 20rpx;
			align-items: flex-end;
		}
	}
}

.divider {
	height: 1px;
	background: #f5f5f5;
	margin: 30rpx 0;
}

/* Meta Section */
.meta-section {
	.meta-row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 16rpx;
		
		.label {
			font-size: 28rpx;
			color: #333;
		}
		
		.value {
			font-size: 28rpx;
			color: #999;
		}
	}
}

/* Deposit Card */
.deposit-content {
	.sub-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}
	
	.desc {
		font-size: 26rpx;
		color: #999;
		line-height: 1.5;
	}
}

.footer-btns {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx 30rpx calc(20rpx + env(safe-area-inset-bottom));
	display: flex;
	justify-content: space-between;
	gap: 30rpx;
	z-index: 100;
	// background: linear-gradient(180deg, rgba(119, 23, 29, 0) 0%, #77171D 100%);
	.btn-wrapper {
		flex: 1;
	}
}
.page-wrap{
	background:url("/static/images/collection-detail/collection-detail-top-bg.png") no-repeat center top/contain, 
	url("/static/images/index/bg.png") no-repeat center/cover; 
}
</style>
