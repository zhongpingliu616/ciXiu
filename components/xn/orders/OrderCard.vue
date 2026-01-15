<template>
<view
	 :key="item.id+Math.random()"
	 class="order-card-item"
   >	
	   <view class="card-header">
		 <image :src="item.image" class="card-image" mode="aspectFill" />
		 <view class="card-content">
		   <view class="card-title" @tap="($event)=>handleItem(item, $event)">{{ item.name }}</view>
		   <view class="tags">
			 <CxTag
			   :text="item.period"
			   :bgGradient="['rgba(248,163,29,0.1)', 'rgba(248,163,29,0.1)']"
			 />&nbsp;
			 <CxTag
			   :text="item.difficulty"
			   :bgGradient="['rgba(248,163,29,0.1)', 'rgba(248,163,29,0.1)']"
			 />
		   </view>
		   <view class="bottom-row">
			 <view class="quota">
			   <view class="quota-progress">
				   <text>剩余名额</text>
				   <view class="lightning-icon">⚡</view>
			   </view>&nbsp;&nbsp;{{ item.total }}
			   
			 </view>
			 <view class="can-grab" :class="{'authen-gray':item.rush_status==2}">
				 <CxComfirmBtn :btnStyle="{
					width: '168rpx',
					height: '60rpx',
				 }" @tap="($event)=>handleGrab(item, $event)" :text="item.rush_status==1 ? '一键抢单' : '等级不符'"></CxComfirmBtn>
			 </view>
		   </view>
		 </view>
		 <view class="rise-rate" v-if="item.riseRate">
			 <text>溢价{{(item.money/item.new_money).tofixed(1)}}%</text>
		 </view>
	   </view>
   </view>
</template>


<script setup name="order-card">
const emit = defineEmits(['grabOrderClick','handleItemClick']);
const defaultTextStyle = {
	  fontSize: "16rpx",
	  color:"#D1A156",
	  padding:"8rpx 0rpx"
	  
  };
const props = defineProps({
  item: { type: Object, 
   default:()=>({})
   }
})
// 抢单按钮点击事件
const handleGrab = (item, e) => {
 e && e.stopPropagation && e.stopPropagation();
  emit('grabOrderClick',item)
}
// 整个卡片点击事件
const handleItem = (item,e) => {
   emit('handleItemClick',item)
}

</script>

<style lang="scss" scoped>
:deep(.uni-scroll-view-content){
	padding-right: 20px;
	box-sizing: border-box;
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
		background-size: 12rpx;
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
		background-size: 12rpx;
		
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
.quota {
  display: flex;
  flex: .9;
  font-size: 20rpx;
  background: #FEE8E8;
  border-radius: 10rpx;
  color: #F82B1D;
  align-items: center;
}

.rise-rate {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  z-index: 1;
  background: linear-gradient(to right, #FABF6E, #FA6337);
  color: #fff;
  border-top-right-radius: 20rpx;
  border-bottom-left-radius: 16rpx;
  padding: 6rpx 20rpx;
}
</style>