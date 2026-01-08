<template>
	<view class="page-wrap pay-deposit">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="sys-block-result">
				<text class="sys-result-title">需要缴纳压金</text>
				<view class="form-container">
					<u-cell v-for="(item, index) in marginResultData" :key="index" 
					:border="false"
					class="form-item"
					:title="`￥ ${item.label}`"
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
				  size="30rpx"
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
				<CxComfirmBtn text="立即缴纳" :disabled="!disabledConfirm" @click="handleConfirm" />				
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
					<CxComfirmBtn text="确认缴费" :loading="loading"  @click="handlePayment" />				
				</view>
			</CxPopup>
		</view>
	</view>
</template>

<script setup name="pay-deposit">
import { getLevelLists } from '@/api/index'
const { proxy } = getCurrentInstance();
let title = ref("压金");
let show = ref(false);
let loading = ref(false);
let guarantees = ref([
	'压金单独支付，包含违约保证金和退货压金两个部分；',
	'压金以5000元为固定额度；',
	'压金以5000元起步，每季度根据上季度月平均商家好店整体营业额调整，只升不降；',
	'压金额度不满时，需在10个自然日内补齐'
	])
const marginResultData = reactive([
	{ label: 0, value: '(1000 - 6000)￥' }
]);
const disabledConfirm = computed(()=>(marginResultData[0]?.label>0));
const handlePayment = ()=>{
	//   const paymentRes = await paymentDeposit(data)
	loading.value = true;
	setTimeout(() => {
		show.value = false;
		loading.value = false;
		uni.showToast({
		title: '缴纳压金成功',
		icon: 'success'
		});
		// 可以在这里跳转回上一页或订单列表
		setTimeout(() => {
		uni.navigateBack()
		}, 1500)
	}, 2000);
};
const handleConfirm = ()=>{
	show.value = true;
}
const setLevelDatas = (res={})=>{
	const { code=9999, data,msg } = res;
	if (code === 200) {
		 if(data?.lists.length>0){
			data.lists.forEach(element => {
				element.level == proxy.$globalUserInfoXn.level && (marginResultData[0].label = element.deposit)
			});
		 };		 
	} else {
		uni.showToast({
			title: msg || '数据加载失败',
			icon: 'none'
		});
	}
};
onMounted(async () => {
	const res = await getLevelLists();
	setLevelDatas(res);
})
// onLoad((options) => {
// 	if (options.amount) {
//         marginResultData[0].label = `￥ ${options.amount}`
//     }
//     console.log("缴纳金额",options.amount);
// })
</script>

<style lang="scss" scoped>
	.page-wrap{
		
	}
	.sys-result-title{
		 font-size: 30rpx;
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
	  padding: 20rpx;
	  font-family: "SimHei", "黑体", sans-serif;
	  color: #FFFFFF;
	}
	
	.content {
	  margin-top: 30rpx;
	  line-height: 1.8;
	  font-size: 26rpx;
	}
	
	.item {
	  display: flex;
	  align-items: flex-start;
	}
	
	.number {
	  font-weight: bold;
	  font-size: 27rpx;
	  margin-right: 10rpx;
	}
	
	.text {
	  flex: 1;
	}
	.title {
	  display: block;
	  line-height: 1.5;
	  font-weight: bold;
	  font-size: 28rpx;
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
