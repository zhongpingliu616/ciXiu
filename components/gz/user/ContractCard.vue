<template>
  <view class="contract-card" @tap="handleClick">
    <view class="image-wrapper">
      <image :src="item.image" mode="aspectFill" class="card-img" />
    </view>
    <view class="info-wrapper">
      <view class="name-row">
        <text class="name">{{ item.name }}</text>
        <view class="badge" v-if="item.isSigned">
          <!-- <image src="/static/images/common/badge-icon.png" class="badge-icon" v-if="false"/> -->
          <!-- 暂时用简单的样式模拟徽章，如果有图标资源可以替换 -->
          <!-- <view class="badge-content">
             <u-icon name="checkmark-circle-fill" color="#A35853" size="20"></u-icon>
             <text class="badge-text">签约绣娘</text>
          </view> -->
		  <CxTag
		     text="签约绣娘"
		     icon="/static/images/common/work-level.png"
			 :textStyle="{
				 color: '#805536'
			 }"
			 :customStyle="{
				 padding: 0
			 }"
		   />
        </view>
      </view>
      <view class="level-row">
        <text class="level">等级：{{ item.level }}级</text>
        <text class="count">{{ item.popularity }}人</text>
      </view>
    </view>
  </view>
</template>

<script setup name="ContractCard">
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click', props.item);
};
</script>

<style lang="scss" scoped>
.card-img {
      width: 100%;
      height: 100%;
    }
.image-wrapper {
    width: 100%;
    height: 340rpx;
    background-color: #f5f5f5;
  }
.badge-text {
  font-size: 20rpx;
  color: #A35853;
  margin-left: 4rpx;
}
.name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-right: 12rpx;
  }
.badge-content {
	display: flex;
	align-items: center;
	background: #FDF2F1;
	border: 1rpx solid #EBC6C4;
	border-radius: 8rpx;
	padding: 2rpx 8rpx;
  }
.name-row {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;
    }
.level, .count {
	font-size: 24rpx;
	color: #999;
  }    
.level-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info-wrapper {
    padding: 20rpx;
  }
.contract-card {
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
  border: 2rpx solid $app-border-color;
  box-sizing: border-box;
  
  
  
}
</style>