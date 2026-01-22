<template>
	<view class="page-wrap confirm-order">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<!-- Address Card -->
			<view class="info-card address-card" @click="goSelectAddress">
				<view class="left-icon">
					<view class="icon-circle">
						<u-icon name="map-fill" color="#fff" size="40rpx"></u-icon>
					</view>
				</view>
				<view class="address-info" v-if="address.id">
					<view class="user-row">
						<text class="name">{{ address.contact_person }}</text>
						<text class="phone">{{ address.contact_phone }}</text>
					</view>
					<view class="addr-text">{{ address.resolvedAddress }}{{ address.detail_address }}</view>
				</view>
				<view class="address-info" v-else>
					<text class="placeholder">请选择收货地址</text>
				</view>
				<view class="right-icon">
					<u-icon name="arrow-right" color="#999" size="28rpx"></u-icon>
				</view>
			</view>

			<!-- Order Info Card -->
			<view class="info-card order-info-card">
				<view class="card-title-row">
					<view class="red-bar"></view>
					<text class="card-title">订单信息</text>
				</view>
				<view class="product-item">
					<image class="product-img" :src="productInfo.image" mode="aspectFill"></image>
					<view class="product-details">
						<view class="product-title">{{ productInfo.name }}</view>
						<view class="product-tags">
							<CxTag
							shape="circle"
							:text="marginResultData.period"
							:textStyle="{
								color: '#4A90E2'
							}"
							:bgGradient="['#E8F3FF', '#E8F3FF']"
							/>
							<CxTag
							shape="circle"
							:textStyle="{
								color: '#999'
							}"
							:text="marginResultData.difficulty"
							:bgGradient="['#F5F5F5', '#F5F5F5']"
							/>
						</view>
						<view class="product-price-row">
							<text class="price">¥ {{ productInfo.reward_amount }}</text>
							<text class="count">x 1</text>
						</view>
					</view>
				</view>
				<view class="summary-row">
					<text class="label">订单押金 (共1件)</text>
					<text class="value">¥ {{ productInfo.deposit || '0.00' }}</text>
				</view>
				<view class="summary-row">
					<text class="label">运费</text>
					<text class="value">¥ {{ productInfo.freight || '0.00' }}</text>
				</view>
				<view class="divider"></view>
				<view class="summary-row total-row">
					<text class="label">订单总价</text>
					<text class="value total-price">¥ {{ totalPrice }}</text>
				</view>
			</view>

			<!-- Order Deposit Link -->
			<view class="info-card link-card">
				<view class="card-title-row">
					<view class="red-bar"></view>
					<text class="card-title">订单保证金</text>
				</view>
				<view class="right-action">
					<text>已缴纳</text>
					<u-icon name="arrow-right" color="#999" size="24rpx"></u-icon>
				</view>
			</view>

			<!-- Deduction Card -->
			<view class="info-card deduction-card">
				<view class="card-title-row">
					<view class="red-bar"></view>
					<text class="card-title">保证金减免</text>
				</view>
				<view class="deduction-desc">
					<view class="main-text">使用“保证金减免额度” （可抵扣300元）</view>
					<view class="sub-text">分享邀请二维码邀请好友注册并认证可获取“押金减免额度”，您当前额度为：{{ deductionQuota }}元</view>
				</view>
			</view>
		</view>

		<!-- Bottom Bar -->
		<view class="bottom-bar">
			<CxComfirmBtn text="确定" :loading="loading" @click="handleConfirm" />
		</view>
	</view>
</template>

<script setup name="confirmOrder">
import { taskDetails, memberAddress, addOrder } from '@/api/xn.js';
import { getRegionName } from '@/utils/public.js';
import { ref, computed, getCurrentInstance } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

let title = ref("确认订单");
let loading = ref(false);
let productInfo = ref({
	image: 'https://picsum.photos/200',
	name: '古韵民族丝绸非遗刺绣',
	id: '234515665132',
	period: '工期30天',
	difficulty: '锦初等级',
	reward_amount: '188.00'
});
let address = ref({});
let taskId = null;
let deductionQuota = ref('30000'); // Mock data

const { proxy } = getCurrentInstance();

// Calculate total price
const totalPrice = computed(() => {
	const deposit = parseFloat(productInfo.value.deposit) || 0;
	const freight = parseFloat(productInfo.value.freight) || 0;
	return (deposit + freight).toFixed(2);
});

onLoad((options) => {
	if (options.id) {
		taskId = options.id;
		fetchTaskDetails(taskId);
	}
	fetchDefaultAddress();

    // 监听来自上一页面的数据
    const instance = getCurrentInstance();
    if (instance && instance.proxy) {
        const eventChannel = instance.proxy.getOpenerEventChannel();
        if (eventChannel) {
            eventChannel.on('sendOrderData', (data) => {
              if (data.marginResultData) {
                     productInfo.value = data.marginResultData;
                }
            });
        }
    }
});

const fetchTaskDetails = async (id) => {
	try {
		const res = await taskDetails({ id });
		if (res.code === 200 || res.code === 0) {
			const data = res.data || {};
			productInfo.value = {
				image: data.image || '',
				title: data.title || '商品名称',
				duration: data.duration || '30天',
				level: data.level_name || '等级',
				price: data.price || '0.00',
				deposit: data.deposit || '0.00',
				freight: data.freight || '0.00'
			};
		}
	} catch (e) {
		console.error('获取详情失败', e);
		// Mock data for display if API fails (or if using mock ID)
		productInfo.value = {
			image: 'https://picsum.photos/200',
			title: '古韵民族丝绸非遗刺绣',
			duration: '30天',
			level: '锦初等级',
			price: '188.00',
			deposit: '752.00',
			freight: '40.00'
		};
	}
};

const fetchDefaultAddress = async () => {
	try {
		const res = await memberAddress();
		if (res.code === 200 || res.code === 0) {
			const list = Array.isArray(res.data.lists) ? res.data.lists : (res.data && res.data.data.lists ? res.data.data.lists : []);
			if (list.length > 0) {
				const defaultAddr = list.find(item => item.is_default == 1) || list[0];
				setAddress(defaultAddr);
			}
		}
	} catch (e) {
		console.error('获取地址失败', e);
	}
};

const setAddress = (item) => {
	address.value = {
		id: item.id,
		contact_person: item.name || item.consignee || item.contact_person || '',
		contact_phone: item.phone || item.mobile || item.contact_phone || '',
		address: item.address || '',
		resolvedAddress: getRegionName(item.address),
		detail_address: item.detail || item.address_detail || item.detail_address || '',
	};
};

const goSelectAddress = () => {
	uni.navigateTo({
		url: '/pages/xn/orders/select-address',
		events: {
			selectAddress: (item) => {
				setAddress(item);
			}
		}
	});
};

const goToDepositInfo = () => {
    // Navigate to deposit info or just placeholder
};

const handleConfirm = async () => {
	if (!address.value.id) {
		uni.showToast({ title: '请选择收货地址', icon: 'none' });
		return;
	}
	loading.value = true;
	try {
		// Call addOrder API
		const params = {
			task_id: taskId,
			address_id: address.value.id,
			// Add other params if needed
		};
		const res = await addOrder(params);
		if (res.code === 200 || res.code === 0) {
			const orderId = res.data.order_id || res.data.id; // Adjust based on actual API response
			// Navigate to deposit page for payment
			uni.navigateTo({
				url: `/pages/xn/my/deposit?id=${taskId}&order_id=${orderId}`,
				success: (res) => {
					// Pass data if needed
					res.eventChannel.emit('sendMarginDatas', { 
						marginResultData: { 
							deposit: productInfo.value.deposit,
							order_id: orderId 
						},
						productInfo: productInfo.value
					});
				}
			});
		} else {
			uni.showToast({ title: res.msg || '下单失败', icon: 'none' });
		}
	} catch (e) {
		console.error('下单异常', e);
		uni.showToast({ title: '下单失败', icon: 'none' });
	} finally {
		loading.value = false;
	}
};
</script>

<style lang="scss" scoped>
.page-wrap {
	background: url("/static/images/collection-detail/collection-detail-top-bg.png") no-repeat center top/contain, 
	url("/static/images/index/bg.png") no-repeat center/cover;
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

.page-content {
	padding: 24rpx;
	padding-bottom: 140rpx;
}

.info-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
}

// Address Card
.address-card {
	display: flex;
	align-items: center;
	padding: 40rpx 30rpx;
}

.left-icon {
	margin-right: 20rpx;
	.icon-circle {
		width: 60rpx;
		height: 60rpx;
		background: linear-gradient(135deg, #FF6B6B, #FF9C6B);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}

.address-info {
	flex: 1;
	.user-row {
		margin-bottom: 10rpx;
		.name {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
			margin-right: 20rpx;
		}
		.phone {
			font-size: 30rpx;
			color: #666;
		}
	}
	.addr-text {
		font-size: 26rpx;
		color: #999;
		line-height: 1.4;
	}
	.placeholder {
		font-size: 30rpx;
		color: #999;
	}
}

// Order Info Card
.card-title-row {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
	justify-content: space-between;
}

.red-bar {
	width: 6rpx;
	height: 28rpx;
	background: #FF6B4B;
	border-radius: 4rpx;
	margin-right: 16rpx;
}

.card-title {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
}

.product-item {
	display: flex;
	margin-bottom: 30rpx;
	padding-bottom: 30rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.product-img {
	width: 160rpx;
	height: 160rpx;
	border-radius: 12rpx;
	margin-right: 20rpx;
	background: #f5f5f5;
}

.product-details {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}

.product-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #333;
}

.product-tags {
	display: flex;
	gap: 10rpx;
}

.tag {
	font-size: 20rpx;
	color: #8C6339;
	background: #F5E8D4;
	padding: 2rpx 10rpx;
	border-radius: 6rpx;
}

.level-tag {
	color: #999;
	background: #F5F5F5;
}

.product-price-row {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	
	.price {
		font-size: 32rpx;
		color: #333;
		font-weight: bold;
	}
	
	.count {
		font-size: 24rpx;
		color: #999;
	}
}

.summary-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 20rpx;
	font-size: 28rpx;
	
	.label {
		color: #666;
	}
	
	.value {
		color: #333;
		font-weight: bold;
	}
	
	&.total-row {
		margin-bottom: 0;
		margin-top: 20rpx;
		align-items: center;
		
		.label {
			font-size: 30rpx;
			color: #333;
			font-weight: bold;
		}
		
		.total-price {
			font-size: 36rpx;
			color: #333;
			font-weight: bold;
		}
	}
}

.divider {
	height: 1rpx;
	background: #eee;
	margin: 20rpx 0;
}

// Link Card
.link-card {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	
	.card-title-row {
		margin-bottom: 0;
	}
	
	.right-action {
		display: flex;
		align-items: center;
		gap: 8rpx;
		font-size: 26rpx;
		color: #999;
	}
}

// Deduction Card
.deduction-card {
	.deduction-desc {
		.main-text {
			font-size: 28rpx;
			color: #333;
			margin-bottom: 10rpx;
		}
		.sub-text {
			font-size: 24rpx;
			color: #999;
			line-height: 1.5;
		}
	}
}

.bottom-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx 40rpx;
	padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	box-shadow: 0 -4rpx 16rpx rgba(0,0,0,0.05);
	z-index: 100;
}
</style>