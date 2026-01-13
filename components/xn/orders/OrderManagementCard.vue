<template>
<view
	 :key="item.id+Math.random()"
	 class="order-card-item"
	 @click="handleCardClick"
   >
		<view class="order-status">
			<up-row 
			justify="space-between"
			customStyle="margin-bottom: 1rpx">
				  <up-col 
				  span="9">
					  <view class="order-id">
						  <text class="order-id-text">订单号: {{ item.order_id }}</text>
					  </view>
				  </up-col>
				  <up-col
				  span="3">
					  <view class="right-wrap">
					      <view class="status-btn">
					        <!-- <up-button
					          type="primary"
					          :plain="true"
					          :customStyle="{
					            border: 'none'
					          }"
					        > -->
					          <text
					            :style="{
					              fontSize: '24rpx',
					              color: statusColor
					            }"
					          >
					            {{ statusText }}
					          </text>
					        <!-- </up-button> -->

					      </view>
					    </view>
				  </up-col>
			  </up-row>
		</view>
	   <view class="card-header">
		 <image :src="item.image" class="card-image" mode="aspectFill" />
		 <view class="card-content">
		   <view class="card-title">{{ item.name }}</view>
		   <view class="tags">
			 <CxTag
			   :text="item.period || '工期360天'"
			   :bgGradient="['rgba(248,163,29,0.1)', 'rgba(248,163,29,0.1)']"
			 />&nbsp;
			 <CxTag
			   :text="item.difficulty || '难度低'"
			   :bgGradient="['rgba(248,163,29,0.1)', 'rgba(248,163,29,0.1)']"
			 />
		   </view>
		   <view class="bottom-row">
			 <text class="cur-order-price">
				 ￥{{ item.reward_amount || '' }}
			 </text>
		   </view>
		 </view>
	   </view>
	   <view class="status-function-bts">
		   <!-- 待支付: 取消订单, 去支付 -->
		   <template v-if="item.status === 10">
			   <view class="function-btn">
				   <CxComfirmBtn 
				   :btnStyle="cancelBtnStyle"
				   @click="handleAction('cancel')" text="取消订单"></CxComfirmBtn>
			   </view>&nbsp;&nbsp;
			   <view class="function-btn">
				   <CxComfirmBtn :btnStyle="cancelBtnStyle" @click="handleAction('pay')" text="去支付"></CxComfirmBtn>
			   </view>
		   </template>
		   
		   <!-- 待发货: 提醒发材料 -->
		   <template v-else-if="item.status === 20">
			   <view class="function-btn">
				   <CxComfirmBtn 
				   :btnStyle="cancelBtnStyle"
				   @click="handleAction('remind')" text="提醒发货"></CxComfirmBtn>
			   </view>
		   </template>

		   <!-- 待接材料: 查看物流 已收材料-->
		   <template v-else-if="item.status === 30">
			   <view class="function-btn">
				   <CxComfirmBtn 
				   :btnStyle="cancelBtnStyle"
				   @click="handleAction('logistics')" text="查看物流"></CxComfirmBtn>
			   </view>&nbsp;&nbsp;
			   <view class="function-btn">
				   <CxComfirmBtn 
				   :btnStyle="cancelBtnStyle"
				   @click="handleAction('receivingMaterials')" text="已收材料"></CxComfirmBtn>
			   </view>&nbsp;&nbsp;
		   </template>

		   <!-- 待发成品:  制作完成 -->
		   <template v-else-if="item.status === 40">
			   <view class="function-btn">
				   <CxComfirmBtn :btnStyle="cancelBtnStyle" @click="handleAction('produced')" text="制作完成"></CxComfirmBtn>
			   </view>
		   </template>

		   <!-- 待接收成品:  已接收成品 -->
		   <template v-else-if="item.status === 50">
			   <!-- <view class="function-btn">
				   <CxComfirmBtn :btnStyle="cancelBtnStyle" @click="handleAction('finishedProductReceived')" text="已接收成品"></CxComfirmBtn>
			   </view> -->
		   </template>

		   <!-- 待验收:  验收成功  验收失败-->
		   <template v-else-if="item.status === 60">
			   <!-- <view class="function-btn">
				   <CxComfirmBtn :btnStyle="cancelBtnStyle" @click="handleAction('acceptanceSuccessful')" text="验收成功"></CxComfirmBtn>
			   </view>&nbsp;&nbsp;
			   <view class="function-btn">
				   <CxComfirmBtn :btnStyle="cancelBtnStyle" @click="handleAction('acceptanceFailure')" text="验收失败"></CxComfirmBtn>
			   </view> -->
		   </template>

		   <!-- 验收成功/验收失败/已取消: 删除订单 不设删除订单--> 
		   <!-- <template v-else-if="item.status === 90">
			   <view class="function-btn">
				   <CxComfirmBtn 
				   :btnStyle="cancelBtnStyle"
				   @click="handleAction('delete')" text="删除订单"></CxComfirmBtn>
			   </view>
		   </template> -->
	   </view>
   </view>
</template>


<script setup name="order-card">
const emit = defineEmits(['action'])
const props = defineProps({
  item: { type: Object, 
   default:()=>({})
   }
})

// 样式配置
const cancelBtnStyle = {
   padding: '0rpx 34rpx',
};

// 状态映射
const statusMap = {
  10: { text: '待支付', color: '#FF4D4F' },   // 红｜强提醒
  20: { text: '待发货', color: '#FA8C16' },   // 橙｜进行中
  30: { text: '待接受材料', color: '#1890FF' }, // 蓝｜处理中
  40: { text: '待发成品', color: '#FA541C' },   // 深橙｜关键节点
  50: { text: '待接收成品', color: '#13C2C2' }, // 青｜物流流转
  60: { text: '待验收', color: '#722ED1' },     // 紫｜待确认
  70: { text: '验收成功', color: '#52C41A' },   // 绿｜成功
  80: { text: '验收失败', color: '#A8071A' },   // 深红｜失败
  90: { text: '取消订单', color: '#8C8C8C' }    // 灰｜终止
};

const statusText = computed(() => {
	return statusMap[props.item.status]?.text || '未知状态'
});

const statusColor = computed(() => {
	return statusMap[props.item.status]?.color || '#333'
});

// 按钮点击事件
const handleAction = (type) => {
  emit('action', { type, item: props.item })
};

const handleCardClick = () => {
	emit('action', { type: 'detail', item: props.item })
};

</script>

<style lang="scss" scoped>
:deep(.uni-scroll-view-content){
	padding-right: 20rpx;
	box-sizing: border-box;
}
.function-btn{
	display: inline-block;
}
.status-function-bts{
	display: flex;
	justify-content: flex-end;
	margin-top: 24rpx;
}
.order-status{
	margin: 30rpx 0;
	font-size:28rpx;
	color:$app-main-dark
}
.right-wrap {
  display: flex;
  justify-content: flex-end;
}
.order-id-text{
	white-space: nowrap;
}
.order-id{
	overflow: hidden;
    text-overflow: ellipsis;
}
.order-card-item{
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx 16rpx;
	margin-top: 30rpx;
	position: relative;
	&::before{
		display: block;
		content: ' ';
		position: absolute;
		left: 20rpx;
		height: 24rpx;
		width: 90%;
		top: -10rpx;
		background: url(@/static/images/common/card-top-1.png) repeat-x;
	}
	&::after{
		display: block;
		content: ' ';
		position: absolute;
		top: -1rpx;
		left: 25rpx;
		height: 24rpx;
		width: 90%;
		background: url(@/static/images/common/card-top-2.png) repeat-x;
		
	}
}
.card-header {
  display: flex;
  align-items: center;
}

.card-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}
.not-grab{
	filter: grayscale(1);
	opacity: .5;
}
.can-grab{
	width: 188rpx;
}
.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 160rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #13161F;
  margin-bottom: 10rpx;
}

.tags {
  display: flex;
  margin-bottom: 10rpx;
}
.cur-order-price{
	font-size: 32rpx;
	font-weight: bold;
}
.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.lightning-icon{
	display: inline-block;
	position: relative;
	right: -15rpx;
	transform: scale(1.5);
	filter: brightness(0) invert(1);
	vertical-align: top;
}
.quota-progress{
   padding: 6rpx 12rpx;
   padding-right: 0;
	background: linear-gradient(to right, #F82A1C, #FC7E5A);
	border-radius: 2rpx;
	border-top-left-radius: 10rpx;
	border-bottom-left-radius: 20rpx;
	transform: skewY(-15deg) rotateZ(15deg); 
	color: #fff;
}
</style>