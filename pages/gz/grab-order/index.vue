<template>
	<view class="page-wrap grab-order">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="u-block-box">
					<up-steps 
					:current="currentStep" 
					activeColor="#F3D89E"
					inactiveColor="#999">
					<up-steps-item v-for="(item,index) in blockSteps" :key="index">
					    <template #icon>
					      <text
					        class="slot-icon"
					        :class="{ active: index === currentStep }"
					      >
					        {{ item.text }}
					      </text>
					    </template>
					  </up-steps-item>
					</up-steps>
			</view>
			<view class="block-status" v-show="currentStep==0 || currentStep==1">
				<up-image
				 :showLoading="true"
				 src="/static/images/grab-order/check.png"
				 width="180rpx"
				 height="180rpx"
				  class="block-status-img"
				></up-image>
				<text class="block-status-text">正在校验</text>
			</view>			
			<view class="block-status" v-show="currentStep==2">
				<up-image
				 :showLoading="true"
				 src="/static/images/grab-order/marging.png"
				 width="180rpx"
				 height="180rpx"
				  class="block-status-img"
				></up-image>
				<text class="block-status-text">正在抢单</text>
			</view>			
			<view class="block-status" v-show="currentStep==3">
				<up-image
				 :showLoading="true"
				 src="/static/images/grab-order/margined.png"
				 width="180rpx"
				 height="180rpx"
				  class="block-status-img"
				></up-image>
				<text class="block-status-text">抢单成功</text><br/>
				<text
					 class="block-status-complete"
				>材料包将在24小时内配送</text>
			</view>
			<view class="sys-block-result" v-show="currentStep==0">
				<u-text class="sys-result-title">校验结果</u-text>
				<view class="form-container">
					<u-cell v-for="(item, index) in sysResultData" :key="index" 
					:border="false"
					class="form-item"
					:title="item.label"
					:value="item.value"
					:title-style="{ fontSize: '32rpx', fontWeight: 'bold', color: '#333' }"
					:value-style="{ fontSize: '30rpx', color: '#666' }"
					>
					</u-cell>
				  </view>
				  <view class="next-step-wrap">
				  	<CommonComfirmBtn text="下一步" :loading="loading" @click="handleSysBlock" />				
				  </view>
			</view>
			<view class="sys-block-result" v-show="currentStep==1">
				<u-text class="sys-result-title">保证金</u-text>
				<view class="form-container">
					<u-cell v-for="(item, index) in marginResultData" :key="index" 
					:border="false"
					class="form-item"
					:title="item.label"
					:value="item.value"
					:title-style="{ fontSize: '32rpx', fontWeight: 'bold', color: '#333' }"
					:value-style="{ fontSize: '30rpx', color: '#666' }"
					>
					</u-cell>
				  </view>
				  <view class="next-step-wrap">
				  	<CommonComfirmBtn text="下一步" :loading="loading" @click="handleMarginBlock" />				
				  </view>
			</view>
		</view>
	</view>
</template>

<script setup>
	const currentStep = ref(3)
	let title = ref("一键抢单");
	let loading = ref(false)
	const blockSteps = reactive([
		{
			text: "系统校验"
		},{
			text: "校验保证金"
		},{
			text: "抢单中"
		},{
			text: "抢单成功"
		},
	]);
	const marginResultData = reactive([
	  { label: '保证金是否缴纳', value: '已缴纳' }
	]);
	const sysResultData = reactive([
	  { label: '中国银行', value: '资深' },
	  { label: '作品等级', value: '5级' },
	  { label: '匹配度', value: '80%' }
	])
	const handleSysBlock = () => {
		loading.value = true;
		// const loginResult = await login()
		setTimeout(() => {
		  loading.value = false;
		  uni.showToast({
			title: '系统校验成功',
			icon: 'success'
		  });
		  currentStep.value+=1;
		}, 3000);
	};
	const handleMarginBlock = () => {
		loading.value = true;
		setTimeout(() => {
		  loading.value = false;
		  uni.showToast({
			title: '系统校验成功',
			icon: 'success'
		  });
		  currentStep.value+=1;
		}, 3000);
	};
	onMounted(() => {
	  console.log('is tab page income', title)
	});
	onShow(()=>{
		// uni.hideTabBar();
	});
</script>

<style lang="scss" scoped>
	.page-wrap{
		background: url("/static/images/user/login-bg.png") no-repeat;
		background-size: cover;
	}
	.slot-icon {
	  padding: 8rpx 16rpx;
	  border: 1px solid #fff;
	  border-radius: 28rpx;
	  font-size: 24rpx;
	  color: #fff;
	  background-color: transparent;
	  &.active{
		  background: linear-gradient(
		    to top,
		    #F83121 0%,
		    #FC7B58 100%
		  );
	  }
	}
	
	::v-deep {
		.u-steps-item__wrapper--row{
			width: auto;
			height: auto;
			background-color: transparent;
		}
		.u-steps-item__line--row{
			top: 48%;
		}
		.u-steps-item--active .slot-icon {
		  background-color: #F3D89E; /* 你想要的红色 */
		  border-color: #F3D89E;
		}
	}
	.u-block-box{
		margin-top: 40rpx;
	}
	.block-status{
		margin-top: 140rpx;
		text-align: center;
	}
	.block-status-img{
		margin: 0 auto;
	}
	.block-status-text{
				margin-top: 40rpx;
				font-size: 30rpx;
				color: #fff;
				font-weight: bold;
			}
.block-status-complete{
	color: #999;
}
 .sys-block-result{
	 
 }
 .sys-result-title{
	 font-size: 60rpx;
	 color: #fff;
 }
 .form-container {
   padding: 20rpx;
   border-radius: 16rpx;
 }
 
 .form-item {
   margin: 10rpx 0;
   background-color: #ffffff;
   border-radius: 26rpx;
   padding: 8rpx 12rpx;
   box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
   border:2rpx solid #FFE185;
 }
 .next-step-wrap{	 
	 width: 95%;
	 margin: 0 auto;
	 margin-top: 40rpx;
 }
 .warm-reminder{
	 text-align: center;
 }
</style>
