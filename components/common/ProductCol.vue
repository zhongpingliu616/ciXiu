<template>
<view class="grid-wrapper" :style="{ 'grid-template-columns': `repeat(${colNum}, 1fr)` }">
	<view
	  v-for="(item, index) in productList"
	  :key="index"
	  class="product-card"
	>
	  <view class="card-image-wrapper">
		<image :src="item.image" mode="aspectFill" class="card-image" />
		<view class="artist-name">
			<text class="artist">绣娘：{{ item.artist }}</text>
		</view>
	  </view>
	  <view class="card-content">
		
		<text class="title">{{ item.title }}</text>
		<view class="footer">
		  <view class="tag-gradient">
			  <image src="/static/images/common/product-tag.png" style="width: 24rpx; height: 24rpx;" mode="aspectFill" class="tag-image" />
			 &nbsp;<text class="tag-text">溯源</text>
			 <up-icon name="arrow-right" color="#CCBCBC" @click="handleItemClick(item, index)"></up-icon>
		  </view>
		  <text class="price">¥ {{ item.price }}</text>
		</view>
	  </view>
	</view>
  </view>	
</template>
<script setup name="block">
	const props = defineProps(
		{
		  colNum: {
		    type: Number,
		    default: 2
		  },
		  productList: {
		    type: Array,
		    default: []
		  }
		}
	);
const emit = defineEmits(['click']);
const handleItemClick = (item, index) => {
  emit('click', {
    item,
    index
  });
};
</script>

<style lang="scss" scoped>
.tag-text{
	color: #805536;
	font-size: 24rpx;
}
.tag-gradient {
  display: inline-flex;
  padding: 2rpx 8rpx;
  border-radius: 10rpx;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #F3D89E, #F5EAC9);
}
.grid-wrapper {
  display: grid;
  gap: 20rpx;
}

.product-card {
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.product-card:active {
  transform: scale(0.98);
}

.card-image-wrapper {
  width: 100%;
  height: 300rpx;
  border: 4rpx solid  $app-active-text;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
}
.artist-name{
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 6rpx 12rpx;
	background: rgba(255, 255, 255, 0.18)
}
.artist {
  font-size: 26rpx;
  color: #FFFFFF;
  display: block;
  margin-bottom: 10rpx;
}
.card-content {
  padding: 20rpx;
}


.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 15rpx;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  font-size: 32rpx;
  font-weight: bold;
  color: #13161F;
}
</style>