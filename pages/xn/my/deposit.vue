<template>
	<view class="page-wrap pay-deposit">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<!-- Product Info Card -->
			<view class="info-card product-card">
				<image class="product-img" :src="marginResultData.image" mode="aspectFill"></image>
				<view class="product-details">
					<view class="product-title">{{ marginResultData.name }}</view>
					<view class="product-id">ID：{{ marginResultData.id }}</view>
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
					<view class="product-price">
						<text class="symbol">¥</text>
						<text class="amount">{{ marginResultData.reward_amount }}</text>
					</view>
				</view>
			</view>

			<!-- Deposit Amount Card -->
			<view class="info-card deposit-card">
				<view class="card-title-row">
					<view class="red-bar"></view>
					<text class="card-title">保证金</text>
				</view>
				<view class="deposit-amount">
					<text class="symbol">¥</text>
					<text class="value">{{ marginResultData.deposit ?? 0 }}</text>
				</view>
			</view>

			<!-- Payment Method Trigger -->
			<view class="info-card payment-method-card" @click="showPaymentPopup = true">
				<view class="card-title-row">
					<view class="red-bar"></view>
					<text class="card-title">付款方式</text>
				</view>
				<view class="right-arrow">
					<text class="selected-method-text">{{ currentPaymentMethodName }}</text>
					<u-icon name="arrow-down" color="#999" size="28rpx"></u-icon>
				</view>
			</view>


			<view class="info-card deduction-card">
				<view class="card-title-row">
					<view class="red-bar"></view>
					<text class="card-title">保证金减免</text>
				</view>
				<view class="deduction-options">
					<view class="option-item" @click="selectedDeduction = 'use'">
						<view class="radio-icon">
							<u-icon v-if="selectedDeduction === 'use'" name="checkmark-circle-fill" color="#FF4D4F" size="40rpx"></u-icon>
							<view v-else class="radio-circle"></view>
						</view>
						<view class="option-content">
							<view class="option-title">使用“保证金减免额度” （可抵扣300元）</view>
							<view class="option-desc">分享邀请二维码邀请好友注册并认证可获取“保证金”，您当前额度为：30000元</view>
						</view>
					</view>
					<view class="option-item" @click="selectedDeduction = 'none'">
						<view class="radio-icon">
							<u-icon v-if="selectedDeduction === 'none'" name="checkmark-circle-fill" color="#FF4D4F" size="40rpx"></u-icon>
							<view v-else class="radio-circle"></view>
						</view>
						<view class="option-content">
							<view class="option-title">不使用</view>
							<view class="option-desc">不使用任何押金减免，直接支付押金</view>
						</view>
					</view>
				</view>
			</view>

			<!-- Instructions -->
			<view class="guarantee-desc">
				<view class="desc-title">保证金说明：</view>
				<view class="desc-item" v-for="(item, index) in guarantees" :key="index">
					{{ index + 1 }}、{{ item }}
				</view>
			</view>
            
            <!-- Bottom Placeholder for fixed button -->
            <view class="bottom-placeholder"></view>
		</view>

		<!-- Fixed Bottom Button -->
		<view class="fixed-bottom-btn">
			<CxComfirmBtn text="立即缴纳" :loading="loading" @click="handleConfirm" 
            :btnStyle="{
                background: 'linear-gradient(90deg, #FF6B6B 0%, #FF9C6B 100%)',
                borderRadius: '44rpx',
                height: '88rpx',
                fontSize: '32rpx',
                fontWeight: 'bold',
                boxShadow: '0 4rpx 12rpx rgba(255, 107, 107, 0.4)'
            }"/>
		</view>

		<!-- Payment Method Popup -->
		<u-popup :show="showPaymentPopup" mode="bottom" round="24rpx" :closeable="true" @close="showPaymentPopup = false" bgColor="#7a1e28">
			<view class="payment-popup-content">
				<view class="popup-title">请选择付款方式</view>
				<view class="payment-list">
					<view class="payment-item" v-for="item in paymentMethods" :key="item.id" @click="selectedPaymentMethod = item.id">
						<view class="left-info">
							<u-icon :name="item.icon" :color="item.iconColor" size="50rpx" customPrefix="custom-icon"></u-icon>
                            <!-- Use standard u-icon if custom-icon not available, or image -->
                            <image v-if="item.image" :src="item.image" style="width: 50rpx; height: 50rpx; margin-right: 20rpx;" mode="aspectFit"></image>
                            <u-icon v-else :name="item.uIcon" :color="item.iconColor" size="50rpx" style="margin-right: 20rpx;"></u-icon>
                            
							<text class="method-name">{{ item.name }}</text>
						</view>
						<view class="right-check">
							<u-icon v-if="selectedPaymentMethod === item.id" name="checkmark-circle-fill" color="#FF4D4F" size="40rpx"></u-icon>
							<view v-else class="radio-circle-yellow"></view>
						</view>
					</view>
				</view>
				<view class="popup-btns">
					<view class="popup-btn cancel" @click="showPaymentPopup = false">取消</view>
					<view class="popup-btn confirm" @click="onPaymentConfirm">确定</view>
				</view>
			</view>
		</u-popup>

	</view>
</template>

<script setup name="pay-deposit">
import { getLevelLists, addOrder, orderPay, memberAddress } from '@/api/index'

const { proxy } = getCurrentInstance();
const eventChannel = ref(null);
// Safe access to event channel
try {
    eventChannel.value = proxy.getOpenerEventChannel();
} catch (e) {
    console.log('No event channel');
}

let title = ref("缴纳保证金");
let loading = ref(false);
let showPaymentPopup = ref(false);
let id = null;

// Mock Product Data (Should come from API or previous page)
let productInfo = ref({
	image: 'https://picsum.photos/200', // Placeholder
	name: '古韵民族丝绸非遗刺绣',
	id: '234515665132',
	period: '工期30天',
	difficulty: '锦初等级',
	reward_amount: '188.00'
});

const marginResultData = ref({ deposit: 5000, label: '', order_id: '' });

// Payment Methods
const paymentMethods = [
	{ id: 'balance', name: `账户余额(¥ ${proxy.$globalUserInfoXn?.amount ?? 0})`, uIcon: 'rmb-circle-fill', iconColor: '#FF6B00' }, // Use built-in icons for demo
	{ id: 'wechat', name: '微信支付', uIcon: 'weixin-fill', iconColor: '#09BB07' },
	{ id: 'alipay', name: '支付宝支付', uIcon: 'zhifubao-circle-fill', iconColor: '#1677FF' }
];
const selectedPaymentMethod = ref('balance');

const currentPaymentMethodName = computed(() => {
    const method = paymentMethods.find(m => m.id === selectedPaymentMethod.value);
    return method ? method.name.split('(')[0] : '请选择';
});

// Deduction
const selectedDeduction = ref('use'); // 'use' or 'none'

let guarantees = ref([
	'保证金单独支付，包含违约保证金和退货保证金两个部分；',
	'违约保证金以5000元为固定额度；',
	'保证金以5000元起步，每季度根据上季度月平均商家好店整体营业额调整，只升不降；',
	'保证金额度不满时，需在10个自然日内补齐；',
    '可使用“押金减免额度”进行押金减免；'
]);

// Address logic (hidden but kept for API requirement)
let addressList = ref([]);
let selectedAddressItem = ref({});

const handleConfirm = () => {
   uni.navigateTo({
    url: '/pages/xn/orders/confirm-order',
    success: (res) => {
        // 传递 marginResultData 和 productInfo 到确认订单页面
        res.eventChannel.emit('sendOrderData', {
            marginResultData: marginResultData.value
        });
    }
   })
}

const onPaymentConfirm = async () => {
	showPaymentPopup.value = false;
	loading.value = true;
    
    // Use default address if not selected (Mock logic)
    const addressId = selectedAddressItem.value.id || (addressList.value.length > 0 ? addressList.value[0].id : null);
    
    // Mock API Call or Real API Call
    try {
        const {code, msg} = await orderPay({
            address_id: addressId, 
            order_id: marginResultData.value.order_id
        });
        
        if(code == 200){
            uni.showToast({title: '缴纳保证金成功', icon: 'success' })
            setTimeout(() => {
                uni.navigateBack();
            }, 1500)
        } else if(code == 100028){
            uni.showToast({ title: msg || '余额不足，请先充值', icon: 'none' })
        } else {
            uni.showToast({ title: msg || '缴纳失败', icon: 'none' })
        }
    } catch (e) {
        // Mock success for demo if API fails due to missing data
        console.error(e);
        // uni.showToast({ title: '请求异常', icon: 'none' })
    } finally {
        loading.value = false;
    }
}

const requireAddressList = async ()=>{
	const {code, msg ,data={}} = await memberAddress({});
	if(code == 200){
		addressList.value = data.lists || [];
        if (addressList.value.length > 0) {
            selectedAddressItem.value = addressList.value[0];
        }
	}
}; 

onMounted(async () => {
	requireAddressList();
})

onLoad((options) => {
	if (options.id) {
       id = options.id;
       // Here we might fetch product details by ID if needed
    };
    if (eventChannel.value) {
        eventChannel.value.on('sendMarginDatas', (data) => {
			console.log("缴纳保证金数据", data.marginResultData);
            marginResultData.value  = data.marginResultData || { deposit: 0 };
            // Update product info if passed
            if (data.productInfo) {
                Object.assign(productInfo.value, data.productInfo);
            }
        });
    }
})
</script>

<style lang="scss" scoped>
.page-wrap {
	grid-template-rows: 80rpx 1fr 0rpx;
}

.page-content {
    padding: 30rpx;
}

.info-card {
    background: #FFFFFF;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
}

// Product Card
.product-card {
    display: flex;
    gap: 20rpx;
}

.product-img {
    width: 180rpx;
    height: 180rpx;
    border-radius: 12rpx;
    flex-shrink: 0;
    background-color: #f5f5f5;
}

.product-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.product-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 8rpx;
}

.product-id {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 8rpx;
}

.product-tags {
    display: flex;
    gap: 10rpx;
    margin-bottom: 10rpx;
}

.tag {
    font-size: 22rpx;
    color: #4A90E2;
    background: #E8F3FF;
    padding: 4rpx 12rpx;
    border-radius: 6rpx;
}

.level-tag {
    color: #999;
    background: #F5F5F5;
}

.product-price {
    color: #FF4D4F;
    font-weight: bold;
    
    .symbol {
        font-size: 24rpx;
    }
    .amount {
        font-size: 36rpx;
    }
    .original-price {
        font-size: 24rpx;
        color: #999;
        text-decoration: line-through;
        margin-left: 10rpx;
    }
}

// Common Card Title
.card-title-row {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
}

.red-bar {
    width: 6rpx;
    height: 28rpx;
    background: #FF6B4B; // Orange-red
    border-radius: 4rpx;
    margin-right: 16rpx;
}

.card-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
}

// Deposit Amount
.deposit-amount {
    font-size: 60rpx;
    font-weight: bold;
    color: #333;
    margin-top: 10rpx;
    
    .symbol {
        font-size: 40rpx;
        margin-right: 10rpx;
    }
}

// Payment Method
.payment-method-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.right-arrow {
    display: flex;
    align-items: center;
    gap: 10rpx;
}

.selected-method-text {
    font-size: 28rpx;
    color: #666;
}

// Deduction
.deduction-options {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
}

.option-item {
    display: flex;
    align-items: flex-start;
    gap: 20rpx;
}

.radio-icon {
    margin-top: 6rpx;
    flex-shrink: 0;
}

.radio-circle {
    width: 36rpx;
    height: 36rpx;
    border: 2rpx solid #999;
    border-radius: 50%;
    background: #FFF8E1; // Light yellowish bg from design
}

.option-content {
    flex: 1;
}

.option-title {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 8rpx;
}

.option-desc {
    font-size: 24rpx;
    color: #999;
    line-height: 1.4;
}

// Instructions
.guarantee-desc {
    padding: 0 10rpx;
    color: rgba(255, 255, 255, 0.9);
    font-size: 24rpx;
    line-height: 1.8;
}

.desc-title {
    margin-bottom: 10rpx;
}

// Fixed Bottom Button
.bottom-placeholder {
    height: 100rpx;
}

.fixed-bottom-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx 40rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    background: transparent; // Or a translucent background if needed
    z-index: 100;
}

// Popup Styles
.payment-popup-content {
    padding: 30rpx;
    color: #fff;
    // background: #7a1e28; // Set in u-popup
}

.popup-title {
    text-align: center;
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 40rpx;
}

.payment-list {
    margin-bottom: 60rpx;
}

.payment-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.left-info {
    display: flex;
    align-items: center;
}

.method-name {
    font-size: 30rpx;
    color: #fff;
}

.radio-circle-yellow {
    width: 30rpx;
    height: 30rpx;
    border-radius: 50%;
    background: #F3D89E; // Gold/Yellow color for unselected
    border: 4rpx solid rgba(255, 255, 255, 0.2);
}

.popup-btns {
    display: flex;
    gap: 30rpx;
}

.popup-btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
}

.popup-btn.cancel {
    border: 2rpx solid #fff;
    color: #fff;
}

.popup-btn.confirm {
    background: linear-gradient(90deg, #FF6B6B 0%, #FF9C6B 100%);
    color: #fff;
    border: none;
}
</style>
