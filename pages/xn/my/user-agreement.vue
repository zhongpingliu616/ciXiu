<template>
	<view class="page-wrap index">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="agreement-card">
			    <u-card
			      :border="false"
			      :head-style="{ padding: '16rpx 32rpx', backgroundColor: '#fff' }"
			      :body-style="{ padding: '24rpx 32rpx', backgroundColor: '#fff' }"
			      :foot-style="{ display: 'none' }"
			    >
			      <!-- 标题 -->
			      <template #head>
			        <view class="card-title">
			          欢迎使用绣数坊
			        </view>
			      </template>
			
			      <!-- 正文内容 -->
			      <template #body>
			        <view class="card-content">
			          <p class="content-title">感谢您对于绣数坊的信赖，在使用前请您务必阅读并同意绣数坊《服务条款》和《隐私权政策》，我们将按照政策和协议内容为您提供服务。我们会收集您的位置等信息，为您提供有关的服务协议，您可以在系统设置中关闭授权，但会影响部分功能的使用。特向您说明如下:</p>
			
			          <view class="list-container">
			            <view v-for="(item, index) in 4" :key="index" class="list-item">
			              <text class="item-number">{{ index + 1 }}.</text>
			              <text class="item-text">说明文档说明文档说明文档说明文档说明文档说明文档说明文档说明文档说明文档说明文档说明文档说明文档说明文档说明文档说明文档说明文档说明文档说明文档</text>
			            </view>
			          </view>
			        </view>
			      </template>
			    </u-card>
				<br />
				<view class="confirm-btn">
					<CxComfirmBtn
					 text="同意"
					 :btnStyle="{
						 backgroundColor: 'transparent'
					 }"
					 @tap="consentAgree"
					 />
					 <br />
					<CxComfirmBtn
					 text="不同意"
					 :textStyle="{						 
						 color:'#FFE185'
					 }"
					 :btnStyle="{
						 plain: true,
						 backgroundColor: 'transparent'
					 }"
					 @tap="notAgree"
					 />
				</view>
			  </view>
		</view>
	 <view></view>
	</view>
</template>


<script setup name="model">
let title = ref("用户协议");	
const pages = getCurrentPages()
const currentPage = pages[pages.length - 1]

const consentAgree = () => {
	currentPage.$routeData = { consentStatus: true };
	uni.navigateTo({ url: '/pages/login?role=xn&consentStatus=true' });
};	
const notAgree = () => {
	currentPage.$routeData = { consentStatus: false }
	uni.navigateTo({ url: '/pages/login?role=xn&consentStatus=false' });
};	
</script>

<style lang="scss" scoped>
.agreement-card {
  padding: 20rpx 0;

  .card-title {
    font-size: 36rpx;
    font-weight: bold;
    text-align: center;
    color: #333;
  }

  .card-content {
    font-size: 28rpx;
    line-height: 1.6;
    color: #555;

    p {
      margin-bottom: 24rpx;
    }

    .list-container {
      .list-item {
        display: flex;
        margin-bottom: 20rpx;
        align-items: flex-start;

        .item-number {
          font-weight: bold;
          color: #333;
          margin-right: 8rpx;
        }

        .item-text {
          flex: 1;
          word-break: break-all;
          line-height: 1.5;
        }
      }
    }
  }
}
.content-title{
	font-weight: bold;
}
.page-wrap{
	background: 
	url("/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr 0rpx;
}		
	
</style>