<template>
	<view class="page-wrap index">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="agreement-card">
				<image 
						v-if="configStore.config.lists.user_agreement" 
						:src="configStore.config.lists.user_agreement" 
						mode="widthFix" 
						style="width: 100%; display: block;"
					/>
			    <!-- <u-card
			      :border="false"
			      :head-style="{ padding: '16rpx 32rpx', backgroundColor: '#fff' }"
			      :body-style="{ padding: '24rpx 32rpx', backgroundColor: '#fff' }"
			      :foot-style="{ display: 'none' }"
			    >
			   
			      <template #head>
			        <view class="card-title">
			          欢迎使用绣数坊
			        </view>
			      </template>
			
			      正文内容
			      <template #body>
			        <view class="card-content">
						<image
							src="/static/images/user/login-bg.png" 
							mode="widthFix" 
							style="width: 100%; display: block;"
						/>
						
			        </view>
			      </template>
			    </u-card> -->
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


<script setup name="user-model">
const { proxy } = getCurrentInstance();
const safeTopValue = (proxy.$safeAreaInfo.top + 80) +'rpx';
import { useConfigStore } from '@/stores/configStore'

let title = ref("用户协议");	
const configStore = useConfigStore();
const pages = getCurrentPages()
const currentPage = pages[pages.length - 1]

const consentAgree = () => {
	currentPage.$routeData = { consentStatus: true };
	uni.navigateTo({ url: '/pages/login?role=XN&consentStatus=true' });
};	
const notAgree = () => {
	currentPage.$routeData = { consentStatus: false }
	uni.navigateTo({ url: '/pages/login?role=XN&consentStatus=false' });
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
	grid-template-rows: v-bind(safeTopValue) 1fr 0rpx;
}		
	
</style>