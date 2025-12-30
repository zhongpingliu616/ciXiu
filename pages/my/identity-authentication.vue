<template>
	<view class="page-wrap index">
	<LayoutNavigation :title="title">
		<template #right>
			<view class="level-select" @tap="levelSelect">等级选择</view>
		</template>
	</LayoutNavigation>
		<view class="page-content">
			<view class="container">
			    <!-- 背景花纹 -->
			    <view class="background-pattern">			
					<!-- 主内容容器 -->
					<view class="content-box">
					  <!-- 正面上传 -->
					  <view class="upload-item">
						<text class="label">身份证正面</text>
						 <view class="upload-area" @click="handleUpload('front')">
						    <!-- 已上传：显示图片 -->
						    <image
						      v-if="idCardImages.front"
						      :src="idCardImages.front"
						      class="preview-img"
						      mode="widthFix"
						     @click.stop="previewImage(idCardImages.front)"
						    />
						    <!-- 未上传：显示加号 -->
						    <template v-else>
						      <u-icon name="plus" color="#FF4D4D" size="60"></u-icon>
						      <text class="tip">点击上传</text>
						    </template>
						  </view>
					  </view>
				
					  <!-- 反面上传 -->
					  <view class="upload-item">
						<text class="label">身份证反面</text>
						<view class="upload-area" @click="handleUpload('back')">
						    <image
						      v-if="idCardImages.back"
						      :src="idCardImages.back"
						      class="preview-img"
						      mode="widthFix"
						     @click.stop="previewImage(idCardImages.back)"
						    />
						    <template v-else>
						      <u-icon name="plus" color="#FF4D4D" size="60"></u-icon>
						      <text class="tip">点击上传</text>
						    </template>
						  </view>
					  </view>
					</view>
				</view>
			    <!-- 开始上传按钮 -->
				<view class="submit-btn">
					<CxComfirmBtn text="开始上传" :loading="loading" @click="handleSubmit"></CxComfirmBtn>
				</view>
			  </view>
		</view>
	 <view></view>
	</view>
</template>


<script setup name="identityAuthentication">
let title = ref("身份认证");	
let loading = ref(false);
let idCardImages = reactive({
        front: '', // 正面图片临时路径
        back: ''   // 反面图片临时路径
      });
const previewImage = (url) => {
  uni.previewImage({
    urls: [url]
  })
}
const handleUpload = (type) => {
  // 这里可以调用 uni.chooseImage 或 uView 的 upload 组件
  console.log(`点击上传${type === 'front' ? '正面' : '反面'}`)
  uni.chooseImage({
	count: 1,
	success: (res) => {
	  console.log('选择图片成功:', res.tempFilePaths[0])
	  idCardImages[type] = res.tempFilePaths[0];
	  // 你可以在这里保存图片路径或上传到服务器
	}
  })
};
const handleSubmit = async ()=>{	
  // 1. 验证是否已上传正反面
  if (!idCardImages.front || !idCardImages.back) {
    uni.showToast({
      title: '请上传身份证正反面',
      icon: 'none'
    });
    return;
  }
const frontBase64 = await fileToBase64(idCardImages.front);
const backBase64 = await fileToBase64(idCardImages.back);
  // uni.request({
  //   url: 'https://your-api.com/upload-idcard',
  //   method: 'POST',
  //   data: {
  //     front: frontBase64,
  //     back: backBase64,
  //     userId: '123456'
  //   }
  // });
}
const levelSelect = ()=>{
	uni.navigateTo({
		url:'/pages/level/index'
	})
}

const fileToBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    // 1. 用 fetch 获取 blob
    fetch(filePath)
      .then(response => {
        if (!response.ok) throw new Error('网络请求失败');
        return response.blob();
      })
      .then(blob => {
        // 2. 用 FileReader 转 Base64
        const reader = new FileReader();
        reader.onload = () => {
          // reader.result 格式: "data:image/jpeg;base64,/9j/4AAQ..."
          // 我们通常只需要 base64 部分（去掉前缀）
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = () => reject(new Error('读取文件失败'));
        reader.readAsDataURL(blob);
      })
      .catch(err => {
        console.error('H5 Base64 转换失败:', err);
        reject(err);
      });
  });
};
</script>

<style lang="scss" scoped>
.container {
  box-sizing: border-box;
}
.preview-img {
  width: 100%;
  border-radius: 20rpx;
}
.background-pattern {
  background: url("@/static/images/user/identit-bg.png") no-repeat center/100% 980rpx;
  overflow:hidden;
  margin-bottom: 60rpx;
}

.content-box {
  border-radius: 24rpx;
  padding: 40rpx 30rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}
.upload-area {
    width: 100%;
    height: 340rpx;
    border: 2rpx dashed #ddd;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #fff;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.98);
      background: #f9f9f9;
    }
    .tip {
      margin-top: 20rpx;
      font-size: 28rpx;
      color: #666;
    }
}
.upload-item {
  margin-bottom: 40rpx;
  .label {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
    display: block;
  }
}

.submit-btn {
  box-shadow: 0 8rpx 20rpx rgba(255, 120, 0, 0.3);
}
.level-select{
	display: inline-block;
	color: #fff;
	border: 2rpx solid #FFE185;
	border-radius: 32rpx;
	padding: 4rpx 12rpx;
	margin-right: 12rpx;
	font-size: 18rpx;
	background: linear-gradient(to right, #F82B1C, RGBA(252, 124, 89, 1));
}
.page-wrap{
	background: 
	url("/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr 0rpx;
}
</style>