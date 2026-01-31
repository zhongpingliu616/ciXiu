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
            <text class="value">{{ platformInfo.contact_name || '' }}</text>
        </view>
        <view class="info-row">
            <text class="label">联系电话</text>
            <text class="value">{{ platformInfo.contact_phone || '' }}</text>
        </view>
        <view class="info-row align-top">
            <text class="label">收货地址</text>
            <text class="value">{{ platformInfo.shipping_address || '' }}</text>
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
import { editOrderSatus, getConfigList, uploadImage } from '@/api/index.js';

const fileList = ref([]);
const logisticsNo = ref('');
const logisticsCompany = ref('');
const orderInfo = ref({});
let platformInfo = ref({});


const getPlatformAddress = async () => {
    const { msg, code, data } = await getConfigList({
        type: 2,
    });
    if (code === 200 && data.lists) {
        console.log('平台收货地址', data.lists);
        platformInfo.value = data.lists || {};
    }
}

onLoad(async (options) => {
    // 接收订单信息
    const { proxy } = getCurrentInstance();
    const eventChannel = proxy.getOpenerEventChannel();
     getPlatformAddress();
    eventChannel.on('sendOrderDatas', (data) => {
        if (data && data.orderInfo) {
            orderInfo.value = data.orderInfo;
        }
    });
});

const afterRead = async (event) => {
    // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
    let lists = [].concat(event.file);
    let fileListLen = fileList.value.length;
    lists.map((item) => {
        fileList.value.push({
            ...item,
            status: 'uploading',
            message: '上传中'
        });
    });

    for (let i = 0; i < lists.length; i++) {
        try {
            const result = await uploadImage(lists[i].url);
            if (result.code === 200) {
                let item = fileList.value[fileListLen];
                fileList.value.splice(fileListLen, 1, Object.assign(item, {
                    status: 'success',
                    message: '',
                    url: result.data.url
                }));
                fileListLen++;
            } else {
                throw new Error(result.msg || '上传失败');
            }
        } catch (e) {
            let item = fileList.value[fileListLen];
            fileList.value.splice(fileListLen, 1, Object.assign(item, {
                status: 'failed',
                message: '上传失败',
            }));
            fileListLen++;
            uni.showToast({ title: '图片上传失败', icon: 'none' });
        }
    }
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
    if (fileList.value.length === 0) {
        uni.showToast({ title: '请上传完成后的照片', icon: 'none' });
        return;
    }
    
    // 检查是否有上传失败的图片
    const failedImages = fileList.value.filter(item => item.status === 'failed');
    if (failedImages.length > 0) {
        uni.showToast({ title: '存在上传失败的图片，请删除后重试', icon: 'none' });
        return;
    }

    if (!orderInfo.value.id || !orderInfo.value.order_id) {
        uni.showToast({ title: '请返回订单列表重新进入此页面', icon: 'none' });
        return;
    }
    // 提交逻辑
    try {
        const { msg, code } = await editOrderSatus({
            id: orderInfo.value.id,
            order_id: orderInfo.value.order_id,
            status: 50, // 待接收成品
            tracking_number: logisticsNo.value, // 物流单号
            logistics_company: logisticsCompany.value, // 物流公司
            image: fileList.value.map(f => f.url).join(',') // 转为逗号分隔字符串
        });

        if (code === 200) {
            uni.showToast({ title: '提交成功', icon: 'success' });
            setTimeout(() => {
                uni.switchTab({
                    url: `/pages-xn/orders/index?id=${orderInfo.value.id}&order_id=${orderInfo.value.order_id}`
                });
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
