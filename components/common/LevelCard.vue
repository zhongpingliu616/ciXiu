<template>
  <view class="card-container" :style="{
      '--card-index': cardIndex
    }">
    <!-- 卡片主体 -->
    <view class="card-content" :style="bgStyle">
      <!-- 标题行 -->
      <view class="header-row">
        <text class="title">{{levelName}}</text>
        <text class="deposit">保证金：{{guaranteedAmount}}元</text>
      </view>
      <view class="divider"></view>

      <!-- 内容区域 -->
      <view class="content-text">
        <text>可接作品：</text>
        <text class="work-item">
          {{ works }} 
        </text>
      </view>
    </view>
  </view>
</template>


<script setup name="block">
	const props = defineProps(
	{
	  cardIndex: {
	    type: Number,
	    default: 1
	  },
	  selectIndex: {
	    type: Number,
	    default: 1
	  },levelName: {
	    type: String,
	    default: "锦初"
	  },guaranteedAmount: {
	    type: Number,
	    default: 0
	  },works: {
	    type: String,
	    default: ""
	  },
	}
)
	const bgStyle = computed(() => ({
	  background: `
			url(static/images/common/level-item-bg-${props.cardIndex==props.selectIndex?'active':'none'}.png) no-repeat center / contain,
			url(static/images/common/level-item-bg-${props.cardIndex}.png) no-repeat center / contain
		  `
	}));
</script>

<style lang="scss" scoped>
.card-container {
}
.card-content {
  background-image: url(@/static/images/common/level-item-bg-1.png);
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: contain;
  background-color: transparent;
  border-radius: 24rpx;
  padding: 30rpx 40rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  position: relative;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.deposit {
  font-size: 28rpx;
  color: #064381;
}

.divider {
  width: 100%;
  height: 2rpx;
  background: linear-gradient(to right, transparent, #D6D6D6 50%, transparent);
  background-size: 8rpx 2rpx;
  // margin: 20rpx 0;
}

.content-text {
  font-size: 28rpx;
  line-height: 1.6;
}

.work-item {
  color: #333;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  
}

</style>