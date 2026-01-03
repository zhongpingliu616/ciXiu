<template>
  <view class="container">
    <view class="form-card">
        <view class="section-title">
             <view class="red-bar"></view>
             <text class="title">RWA兑换</text>
        </view>
        
        <!-- Asset Select -->
        <view class="form-item">
            <view class="label">选择要兑换的RWA资产</view>
            <view class="input-box select-box" @tap="showPicker = true">
                <text class="value">{{ currentAsset ? currentAsset.label : '请选择' }}</text>
                <u-icon name="arrow-down" color="#999" size="24"></u-icon>
            </view>
        </view>
        
        <!-- Quantity -->
        <view class="form-item">
            <view class="label">兑换数量</view>
            <view class="input-box">
                <input type="number" v-model="quantity" placeholder="请输入数量" class="input" />
            </view>
        </view>
        
        <!-- Payment Method -->
        <view class="form-item">
            <view class="section-title-sm">
                 <view class="red-bar-sm"></view>
                 <text class="title">兑换方式</text>
            </view>
            <view class="payment-box">
                <text class="payment-text">法定货币支付</text>
                <u-icon name="checkmark-circle-fill" color="#FF4141" size="40"></u-icon>
            </view>
        </view>
        
        <!-- Summary -->
        <view class="summary-box">
            <view class="summary-row">
                <text class="label">兑换资产</text>
                <text class="value">{{ currentAsset ? currentAsset.name : '--' }} X{{ quantity || 0 }}</text>
            </view>
            <view class="summary-row">
                <text class="label">兑换价格</text>
                <text class="value">¥ {{ price }}</text>
            </view>
            <view class="summary-row">
                <text class="label">手续费</text>
                <text class="value">¥ {{ fee }}(1%)</text>
            </view>
            <view class="divider"></view>
            <view class="summary-row total-row">
                <text class="label">总计</text>
                <text class="value">¥ {{ total }}</text>
            </view>
        </view>
        
        <!-- Button -->
		
		<CxComfirmBtn
		 text="查看详情"
		 :btnStyle="{
			 height: '100rpx'
		 }"
		 @tap="handleSubmit"
		 />
    </view>
    
    <!-- Notes -->
    <view class="notes-section">
        <view class="note-title">• 兑换须知</view>
        <view class="note-item">1.兑换成功后，资产将在1-3个工作日内发放到您的账户</view>
        <view class="note-item">2.如遇特殊情况，可能会延迟处理，请耐心等待</view>
        <view class="note-item">3.兑换一旦确认，不可撤销，请谨慎操作</view>
        <view class="note-item">4.如有疑问，请联系客服</view>
    </view>
    
    <!-- Picker -->
    <u-picker 
        :show="showPicker" 
        :columns="[assetList]" 
        keyName="label"
        @confirm="handleConfirm"
        @cancel="showPicker = false"
    ></u-picker>
</view>
</template>

<script setup>
import { ref, computed } from 'vue';

const showPicker = ref(false);
const quantity = ref(10);
const assetList = ref([
    { label: '苏绣花鸟钱包(EMB-2024-001)', value: 1, name: '苏绣花鸟钱包', price: 128.00 },
    { label: '古韵苏绣挂件(EMB-2024-002)', value: 2, name: '古韵苏绣挂件', price: 200.00 }
]);
const currentAsset = ref(assetList.value[0]);

const handleConfirm = (e) => {
    // uview-plus logic
    // e = { indexs: [0], value: [{...}], values: [{...}] }
    const selectedItem = e.value[0];
    currentAsset.value = selectedItem;
    showPicker.value = false;
};

const price = computed(() => {
    if (!currentAsset.value) return '0.00';
    return (currentAsset.value.price * (quantity.value || 0)).toFixed(2);
});

const fee = computed(() => {
    return (parseFloat(price.value) * 0.01).toFixed(2);
});

const total = computed(() => {
    return (parseFloat(price.value) + parseFloat(fee.value)).toFixed(2);
});

const handleSubmit = () => {
    uni.showToast({
        title: '兑换申请已提交',
        icon: 'success'
    });
};
</script>

<style lang="scss" scoped>
.container {
    padding: 30rpx 0;
}

.form-card {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
}

.section-title {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    
    .red-bar {
        width: 6rpx;
        height: 28rpx;
        background: #FF4141;
        margin-right: 12rpx;
        border-radius: 4rpx;
    }
    
    .title {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
    }
}

.section-title-sm {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    .red-bar-sm {
        width: 4rpx;
        height: 24rpx;
        background: #FF4141;
        margin-right: 10rpx;
        border-radius: 4rpx;
    }
    
    .title {
        font-size: 28rpx;
        font-weight: bold;
        color: #333;
    }
}

.form-item {
    margin-bottom: 30rpx;
    
    .label {
        font-size: 26rpx;
        color: #999;
        margin-bottom: 16rpx;
    }
    
    .input-box {
        border: 1rpx solid #E5E5E5;
        border-radius: 8rpx;
        height: 80rpx;
        padding: 0 20rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        &.select-box {
            background-color: #fff;
        }
        
        .value {
            font-size: 28rpx;
            color: #333;
        }
        
        .input {
            flex: 1;
            font-size: 28rpx;
            color: #333;
        }
    }
}

.payment-box {
    border: 1rpx solid #E5E5E5;
    border-radius: 8rpx;
    height: 80rpx;
    padding: 0 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .payment-text {
        font-size: 28rpx;
        color: #333;
    }
}

.summary-box {
    background: #FAFAFA;
    border-radius: 12rpx;
    padding: 24rpx;
    margin-bottom: 40rpx;
    
    .summary-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16rpx;
        
        .label {
            font-size: 26rpx;
            color: #999;
        }
        
        .value {
            font-size: 26rpx;
            color: #333;
        }
        
        &.total-row {
            margin-bottom: 0;
            margin-top: 16rpx;
            align-items: center;
            
            .label {
                font-size: 28rpx;
                color: #666;
            }
            
            .value {
                font-size: 32rpx;
                color: #333;
                font-weight: bold;
            }
        }
    }
    
    .divider {
        height: 1rpx;
        background: #E5E5E5;
        margin: 16rpx 0;
    }
}

.submit-btn {
    height: 88rpx;
    background: linear-gradient(90deg, #FF6B4B 0%, #FF4141 100%);
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
}

.notes-section {
    padding: 0 10rpx;
    
    .note-title {
        font-size: 26rpx;
        color: #fff;
        margin-bottom: 16rpx;
    }
    
    .note-item {
        font-size: 24rpx;
        color: #999;
        line-height: 1.6;
        margin-bottom: 8rpx;
    }
}
</style>