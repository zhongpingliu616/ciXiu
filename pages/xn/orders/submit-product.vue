<template>
  <view class="page-wrap submit-product">
    <LayoutNavigation title="提交成品" />
    <view class="page-content">
      <!-- 平台收货地址 -->
      <view class="card">
        <view class="card-title-row">
            <view class="indicator"></view>
            <text class="title-text">平台收货地址</text>
        </view>
        <view class="info-row">
            <text class="label">联系人</text>
            <text class="value">杨老师</text>
        </view>
        <view class="info-row">
            <text class="label">联系电话</text>
            <text class="value">18388888888</text>
        </view>
        <view class="info-row align-top">
            <text class="label">收货地址</text>
            <text class="value">云南省昆明市五华区光明街道光明大厦3楼201</text>
        </view>
      </view>

      <!-- 上传照片 -->
      <view class="card">
         <view class="card-title-row">
            <view class="indicator"></view>
            <text class="title-text">请上传完成后的照片</text>
        </view>
        <view class="upload-area">
             <u-upload
                :fileList="fileList"
                @afterRead="afterRead"
                @delete="deletePic"
                name="1"
                multiple
                :maxCount="3"
                width="160rpx"
                height="160rpx"
                :previewFullImage="true"
            ></u-upload>
        </view>
      </view>

      <!-- 物流信息 -->
      <view class="card">
         <view class="card-title-row">
            <view class="indicator"></view>
            <text class="title-text">物流信息</text>
        </view>
        <view class="form-item">
            <text class="label">物流单号</text>
            <u-input v-model="logisticsNo" placeholder="请输入" border="none" inputAlign="right"></u-input>
        </view>
        <view class="divider"></view>
         <view class="form-item">
            <text class="label">物流公司</text>
             <u-input v-model="logisticsCompany" placeholder="请输入" border="none" inputAlign="right"></u-input>
        </view>
      </view>
    </view>
    
    <view class="footer-btn">
         <CxComfirmBtn text="提交" @click="submit" />
    </view>
  </view>
</template>

<script setup>
import { editOrderSatus } from '@/api/index.js';

const fileList = ref([]);
const logisticsNo = ref('');
const logisticsCompany = ref('');
const orderInfo = ref({});

onLoad((options) => {
    // 接收订单信息
    const { proxy } = getCurrentInstance();
    const eventChannel = proxy.getOpenerEventChannel();
    eventChannel.on('sendOrderDatas', (data) => {
        if (data && data.orderInfo) {
            orderInfo.value = data.orderInfo;
        }
    });
});

const afterRead = (event) => {
    // 模拟上传
    const { file } = event;
    const files = [].concat(file);
    files.forEach(item => {
        fileList.value.push({
            ...item,
            status: 'success',
            message: '',
            url: item.url || item.thumb || item.path
        });
    });
};

const deletePic = (event) => {
    fileList.value.splice(event.index, 1);
};

const submit = async () => {
    if (!logisticsNo.value) {
        uni.showToast({ title: '请输入物流单号', icon: 'none' });
        return;
    }
    if (!logisticsCompany.value) {
        uni.showToast({ title: '请输入物流公司', icon: 'none' });
        return;
    }

    // 提交逻辑
    try {
        const { msg, code } = await editOrderSatus({
            id: orderInfo.value.id,
            order_id: orderInfo.value.order_id,
            status: 50, // 待接收成品
            finish_order_number: logisticsNo.value,
            finish_order_company: logisticsCompany.value,
            // photos: fileList.value.map(f => f.url) // 假设接口支持
        });

        if (code === 200) {
            uni.showToast({ title: '提交成功', icon: 'success' });
            setTimeout(() => {
                uni.navigateBack();
            }, 1500);
        } else {
            uni.showToast({ title: msg || '提交失败', icon: 'none' });
        }
    } catch (e) {
        uni.showToast({ title: '提交失败', icon: 'none' });
    }
};
</script>

<style lang="scss" scoped>
.submit-product {
    background: #77171D url("/static/images/index/bg.png") repeat center top/contain;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.page-content {
    padding: 30rpx;
    flex: 1;
}

.card {
    background: #fff;
    border-radius: 24rpx;
    padding: 30rpx;
    margin-bottom: 24rpx;
}

.card-title-row {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    
    .indicator {
        width: 6rpx;
        height: 28rpx;
        background: #FF4D4F;
        border-radius: 3rpx;
        margin-right: 16rpx;
    }
    
    .title-text {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
    }
}

.info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 24rpx;
    
    &:last-child {
        margin-bottom: 0;
    }
    
    &.align-top {
        align-items: flex-start;
    }
    
    .label {
        color: #333;
        font-size: 28rpx;
        width: 160rpx;
        flex-shrink: 0;
    }
    
    .value {
        color: #666;
        font-size: 28rpx;
        text-align: right;
        flex: 1;
    }
}

.form-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 0;
    
    .label {
        font-size: 28rpx;
        color: #333;
        width: 160rpx;
    }
}

.divider {
    height: 1px;
    background: #f5f5f5;
    margin: 10rpx 0;
}

.footer-btn {
    padding: 40rpx 30rpx;
    padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
}

.upload-area {
    padding-top: 10rpx;
}
</style>
