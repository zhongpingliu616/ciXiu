<template>
	<view class="page-wrap pay-deposit">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="sys-block-result">
				<u-text class="sys-result-title">需要缴纳保证金</u-text>
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
			</view>
			<view class="guarantee-card">
				<u-text 
				  text="保证金说明" 
				   color="#FFFFFF"
				  size="20"
				  class="title"
				></u-text>
			
				<view class="content">
				  <view class="item" v-for="(item, index) in guarantees" :key="index">
					<text class="number">{{ index + 1 }}、</text>
					<text class="text">{{ item }}</text>
				  </view>
				</view>
			  </view>
			<view class="confirm-btn-wrap">
				<CommonComfirmBtn text="立即缴纳" @click="handleConfirm" />				
			</view>
			
		</view>
		<view class="cx-popup">
			<CxPopup v-model:show="show"  #popupContent="slotProps"> 
				<view class="payment-confirm-wrap">
					<image
					  class="payment-icon"
					  mode="aspectFill"
					  src="/static/images/grab-order/payment-confirm.png"
					/>
					 <up-text size="34rpx" bold align="center" text="我已知晓"></up-text>
					 <up-text align="center" color="#999" text="缴纳前请仔细阅读保证金说明"></up-text>
				</view>
				<view class="enter-wrap">
					<CommonComfirmBtn text="确认缴费" :loading="loading"  @click="handlePayment" />				
				</view>
			</CxPopup>
		</view>
	</view>
</template>

<script setup name="pay-deposit">
// import { paymentDeposit } from '@/api/index'
	let title = ref("保证金");
	let show = ref(false);
	let loading = ref(false);
	let guarantees = ref([
        '保证金单独支付，包含违约保证金和退货保证金两个部分；',
        '违约保证金以5000元为固定额度；',
        '保证金以5000元起步，每季度根据上季度月平均商家好店整体营业额调整，只升不降；',
        '保证金额度不满时，需在10个自然日内补齐'
      ])
	const marginResultData = reactive([
	  { label: '￥ 6000', value: '(1000 - 6000)￥' }
	]);
	const handlePayment = ()=>{
		//   const paymentRes = await paymentDeposit(data)
		loading.value = true;
		setTimeout(() => {
		  show.value = false;
		  loading.value = false;
		  uni.showToast({
			title: '缴纳保证金成功',
			icon: 'success'
		  });
		}, 3000);
	};
	const handleConfirm = ()=>{
		show.value = true;
		uni.showToast({
			title: '请缴纳保证金',
			icon: 'success'
		});
	}
	 onMounted(() => {
	    
	
	  })
	onLoad((options) => {
		marginResultData[0].label = `￥ ${options.amount}`
	    console.log("缴纳金额",options.amount);
	})
</script>

<style lang="scss" scoped>
	.page-wrap{
		background: url("/static/images/user/login-bg.png") no-repeat;
		background-size: cover;
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
	.guarantee-card {
	  padding: 20px;
	  font-family: "SimHei", "黑体", sans-serif;
	  color: #FFFFFF;
	}
	
	.content {
	  margin-top: 20px;
	  line-height: 1.8;
	  font-size: 16px;
	}
	
	.item {
	  display: flex;
	  align-items: flex-start;
	}
	
	.number {
	  font-weight: bold;
	  font-size: 17px;
	  margin-right: 5px;
	}
	
	.text {
	  flex: 1;
	}
	.title {
	  display: block;
	  line-height: 1.5;
	  font-weight: bold;
	}
	.confirm-btn-wrap{
		width: 90%;
		margin: 0 auto;
		margin-top: 24rpx;
	}
	.payment-confirm-wrap{
		padding: 40rpx;
		text-align: center;
	}
	.payment-icon {
	  width: 180rpx;
	  height: 180rpx;
	  aspect-ratio: 1 / 1;
	}
	.enter-wrap{
		width: 600rpx;
		margin: 0 40rpx;
		margin-top: 24rpx;
	}
</style>