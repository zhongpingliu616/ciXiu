<template>
	<view class="page-wrap index">
        <view class="nav" :style="{ top: statusBar*2 + 'px' }">
            <view class="bar">
            <slot name="left">
                <image
                    class="back"
                    src="@/static/images/back_icon.png"
                    @click="onCancel"
                />
            </slot>
            <view class="title-wrap">
                <slot name="title">
                    <text class="title">提现方式</text>
                </slot>
            </view>
            <view class="bar-right">
                <slot name="right">
                        
                </slot>
            </view>
            </view>
        </view>
        <view class="page-content">
			 <view class="page-container">

                <!-- 微信 -->
                <u-card
                title="微信收款码"
                :border="false"
                :head-border-bottom="false"
                title-size="28rpx"
                border-radius="24rpx"
                class="withdrawal-upload-card"
                >
                    <template #body>
                        <view class="upload-box">
                            <view class="upload-area" @tap="handleUpload('wechatQrCode')">
                                <!-- 已上传 -->
                                <image
                                v-if="uploadImages.wechatQrCode"
                                :src="uploadImages.wechatQrCode"
                                class="preview-img"
                                mode="widthFix"
                                @tap.stop="previewImage(uploadImages.wechatQrCode)"
                                />
                                <view v-if="uploadImages.wechatQrCode" class="delete-image" @tap.stop="handleDelete('wechatQrCode')">×</view>
                                <!-- 未上传 -->
                                <template v-else>
                                <u-icon name="plus" color="#999" size="60" />
                                <text class="tip">点击上传</text>
                                </template>
                            </view>
                        </view>
                    </template>
                </u-card>

                <!-- 支付宝 -->
                <u-card
                title="支付宝收款码"
                :border="false"
                :head-border-bottom="false"
                title-size="28rpx"
                border-radius="24rpx"
                class="withdrawal-upload-card"
                >
                    <template #body>
                        <view class="upload-box">
                            <view class="upload-area" @tap="handleUpload('alipayQrCode')">
                                <!-- 已上传 -->
                                <image
                                v-if="uploadImages.alipayQrCode"
                                :src="uploadImages.alipayQrCode"
                                class="preview-img"
                                mode="widthFix"
                                @tap.stop="previewImage(uploadImages.alipayQrCode)"
                                />
                                <view v-if="uploadImages.alipayQrCode" class="delete-image" @tap.stop="handleDelete('alipayQrCode')">×</view>
                                <!-- 未上传 -->
                                <template v-else>
                                <u-icon name="plus" color="#999" size="60" />
                                <text class="tip">点击上传</text>
                                </template>
                            </view>
                        </view>
                    </template>
                </u-card>
            </view>
            




            <!-- 保存 -->
             <CxComfirmBtn 
                text="保存" 
                @click="handleSubmit"
                :btnStyle="{
                    
                }" />
		</view>
        <view></view>
	</view>
<CxModal
	  v-model:show="showDeleterModal"
	  content="确定删除该收款码吗？"
	  @confirm="confirmDelete"
	/>
</template>


<script setup name="WithdrawalMethod">
import { addAuthen, uploadImage } from '@/api/index'
let loading = ref(false);
const statusBar = uni.getSystemInfoSync().statusBarHeight;
const emit = defineEmits(['close']);
let showDeleterModal = ref(false);
let currentQrCodeType = '';
let uploadImages = reactive({
    wechatQrCode: '',  
    alipayQrCode: '' 
 });

 const handleSubmit = async ()=>{	
  // 1. 验证是否已上传正反面
  if (!uploadImages.wechatQrCode || !uploadImages.alipayQrCode) {
    uni.showToast({
      title: '请上传您收款微信和支付宝二维码',
      icon: 'none'
    });
    return;
  }
  
  loading.value = true;
  try {
	  // 2. 先上传图片获取服务器路径
	  // 这里假设 uploadImage 返回的是图片 URL 字符串
	  const wechatUrl = await uploadImage(uploadImages.wechatQrCode);
	  const alipayUrl = await uploadImage(uploadImages.alipayQrCode);
      
	  // 3. 提交认证信息
	  const res = await addAuthen({
		front_image: wechatUrl.url,
		back_image: alipayUrl.url
	  });
	  
	  const { code=9999, data,msg } = res;
	  if (code === 200) {
		uni.showToast({
		  title: '上传成功，等待审核',
		  icon: 'success'
		});
		
		// 延迟跳转
		setTimeout(() => {
			onCancel();
		}, 1500);
	  } else {
		uni.showToast({
		  title: msg || '上传失败，请重试',
		  icon: 'none'
		});
	  }
  } catch (error) {
  	console.error('认证失败', error);
	uni.showToast({
	  title: typeof error === 'string' ? error : (error.msg || '上传请求异常'),
	  icon: 'none'
	});
  } finally {
	  loading.value = false;
  }
}
const previewImage = (url) => {
  uni.previewImage({ urls: [url] })
}

const confirmDelete = ()=>{
    uploadImages[currentQrCodeType] = '';
};
const handleDelete = (type) => {
    currentQrCodeType = type;
    showDeleterModal.value = true;
};

const handleUpload = (type) => {
  // 这里可以调用 uni.chooseImage 或 uView 的 upload 组件
  console.log(`点击上传${type === 'wechatQrCode' ? '微信' : '支付宝'}`)
  uni.chooseImage({
	count: 1,
	success: (res) => {
	  console.log('选择图片成功:', res.tempFilePaths[0])
	  uploadImages[type] = res.tempFilePaths[0];
	  // 你可以在这里保存图片路径或上传到服务器
	}
  })
};


const onCancel = ()=>{
	emit('close');
};	
</script>

<style lang="scss" scoped>
.preview-img {
  width: 100%;
  border-radius: 20rpx;
}
.page-container {
    
}

.upload-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0;
}
.upload-area {
    width:240rpx;
    height: 280rpx;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #f0f0f0;
    transition: all 0.3s ease;
    position: relative;
}
.upload-box {
  display: flex;
  align-items: center;
}

.img-box {
  position: relative;
  
}

.delete-image {
  position: absolute;
  top: -12rpx;
  right: -12rpx;
  width: 36rpx;
  height: 36rpx;
  background: rgba(0,0,0,.6);
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 36rpx;
  font-size: 24rpx;
}
.page-wrap{
	grid-template-rows: 80rpx 1fr 0rpx;
}		
.nav {
	position: sticky;
	top: 40rpx;
	z-index: 888;
}
.bar {
  height: 80rpx;
  display: grid;  
  grid-template-columns: 80rpx 1fr 120rpx;
  align-items: center;
  justify-items: center;
}
.back {
  width: 36rpx;
  height: 36rpx;
  margin-left: 18rpx;
}
.title {
  flex: 1;
  text-align: center;
  color: #fff;
  font-size: 28rpx;
}	
</style>