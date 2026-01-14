<template>
	<view class="page-wrap pay-deposit">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="sys-block-result">
				<text class="sys-result-title">需要缴纳压金</text>
				<view class="form-container">
					<u-cell :key="index" 
					:border="false"
					class="form-item"
					:title="`￥ ${marginResultData.deposit ?? 0}`"
					:value="marginResultData.label"
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
<u-popup
    v-model:show="showAddress"
    mode="bottom"
    :border-radius="20"
    closeable
    :close-icon-pos="'top-right'"
    :closeable="true"
    :mask-close-able="true"
    :safe-area-inset-bottom="true"
    :z-index="9999"
    :custom-style="{ width: '100%', maxWidth: '100%', background: '#7a1e28' }"
  >
    <view class="payment-list-warpper">
	  	<!-- 标题 -->
		<view class="title">请选择您的收货地址</view>

		<!-- 收货地列表 -->
		<view class="payment-list">
			<view
				v-for="(item, index) in addressList"
				:key="index"
				class="method-item"
				@click="selectAddress(item, index)"
				>
				<view class="left">
					<!-- <CxIconFont :code="item.icon" size="40rpx" :color="item.color" /> &nbsp;&nbsp; -->
					<text>{{ item.contact_person }} {{ item.contact_phone }} {{ item.detail_address }}</text>
				</view>
				<u-icon name="checkmark-circle-fill" color="#FF4D4F" size="30rpx" v-if="selectedAddressIndex === index"></u-icon>
				<uni-icons type="circle" color="#ccc" size="30" v-else></uni-icons>
			</view>
		</view>

		<!-- 按钮区域 -->
		<view class="btn-group">
		<CxComfirmBtn 
			text="取消" 
			@click="showAddress = false"
			:btnStyle="{
				flex: 1,
				marginRight: '10px',
				background: 'transparent',
				border: '2px solid #fff',
				color: '#fff',
			}" />
		<CxComfirmBtn 
			text="确定" 
			@click="onConfirm"
			:btnStyle="{
				flex: 1,
				background: 'linear-gradient(90deg, #ff6b6b, #ff9c6b)',
				color: '#fff',
			}" />
		</view>

	</view>
  </u-popup>
</template>

<script setup name="pay-deposit">
import { getLevelLists,addOrder,orderPay,memberAddress } from '@/api/index'
const { proxy } = getCurrentInstance();
const eventChannel = ref(null);
eventChannel.value = proxy.getOpenerEventChannel();
let title = ref("压金");
let show = ref(false);
let loading = ref(false);
let showAddress = ref(false);
let id = null;
let addressList = ref([]);
let selectedAddressItem = ref({});
let selectedAddressIndex = ref(0);
let guarantees = ref([
	'压金单独支付，包含违约保证金和退货压金两个部分；',
	'压金以5000元为固定额度；',
	'压金以5000元起步，每季度根据上季度月平均商家好店整体营业额调整，只升不降；',
	'压金额度不满时，需在10个自然日内补齐'
	])
const marginResultData = ref({ deposit: 0, label: '(1000 - 6000)￥' });
const disabledConfirm = computed(()=>(marginResultData.value?.deposit>0));
const handlePayment = async ()=>{
	showAddress.value = true;
	loading.value = true;

};
const onConfirm = async()=>{
	showAddress.value = false;
	loading.value = true;
	const {code, msg ,data={}} = await orderPay({
		address_id: selectedAddressItem.value.id, 
		order_id: marginResultData.value.order_id
	});
	if(code == 200){
		uni.showToast({title: '缴纳压金成功', icon: 'success' })
		setTimeout(() => {
			uni.navigateBack();
		}, 1500)
		return
	}  else if(code == 100028){
		uni.showToast({ title: msg || '余额不足，请先充值', icon: 'none' })
		setTimeout(() => {
			uni.navigateBack();
			// uni.navigateTo({url: '/pages/xn/income/recharge'})
		}, 1500)
		return
	}else {
		uni.showToast({ title: msg || '缴纳压金失败', icon: 'none' })
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
	};
}
// 选择地址
const selectAddress = (item,index) => {
  		selectedAddressIndex.value = index;
  	selectedAddressItem.value = item;
}
const handleConfirm = ()=>{
	showAddress.value = true;
}
// const setLevelDatas = (res={})=>{
// 	const { code=9999, data,msg } = res;
// 	if (code === 200) {
// 		 if(data?.lists.length>0){
// 			data.lists.forEach(element => {
// 				element.level == proxy.$globalUserInfoXn.level && (marginResultData.value.deposit = element.deposit)
// 			});
// 		 };		 
// 	} else {
// 		uni.showToast({
// 			title: msg || '数据加载失败',
// 			icon: 'none'
// 		});
// 	}
// };
const requireAddressList = async ()=>{
	const {code, msg ,data={}} = await memberAddress({});
	if(code == 200){
		addressList.value = data.lists || [];
	} else {
		uni.showToast({ title: msg || '地址加载失败', icon: 'none' })
	}
}; 

onMounted(async () => {
	requireAddressList();
})
onLoad((options) => {
	if (options.id) {
       id = options.id;
    };
	eventChannel.value.on('sendMarginDatas', (data) => {
		marginResultData.value = data.marginResultData || {};
	});
})
</script>

<style lang="scss" scoped>
.btn-group {
  display: flex;
  gap: 10px;
}
.payment-list-warpper {
  padding: 20px;
  background-color: #7a1e28;
  border-radius: 20px;
}
.title {
  font-size: 18px;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
}
.method-item {
	display: flex;
	align-items:center;
	justify-content: space-between;
	color: #b47c7d;
	margin: 10rpx 0;
}
.payment-list {
  margin-bottom: 30px;
}
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
