<template>
<view class="grid-wrapper" :style="{ 'grid-template-columns': `repeat(${colNum}, 1fr)` }">
	<view class="grid-column" v-for="(col, colIndex) in columns" :key="colIndex">
		<view
		  v-for="(wrapper, index) in col"
		  :key="wrapper.originalIndex"
		  class="product-card"
		>
		  <view class="card-image-wrapper">
			<image :src="wrapper.item.image" mode="aspectFill" class="card-image" />
			<!-- <view class="artist-name">
				<text class="artist">绣娘：{{ wrapper.item.artist }}</text>
			</view> -->
			<view class="favorite-column">
				<up-icon
				 color="#7A5632"
				 size="24"
				 :name="wrapper.item.favoriteType||'heart-fill'"
				></up-icon> {{ wrapper.item.likeCount || 126 }}
			</view>
		  </view>
		  <view class="card-content">
			
			<text class="title">{{ wrapper.item.title }}</text>
			<view class="collect-price">
				<text class="current-price">¥{{ wrapper.item.description  || '6467789'}}</text>
				<text class="original-price"> ¥{{ wrapper.item.originalPrice || '6667789'}}</text>
			</view>
			<view class="footer">
			  <view class="tag-gradient">
				 <CxTag
					:text="wrapper.item.tag || 'NFT藏品'"
					:bgGradient="['rgba(7,70,133,0.1)', 'rgba(7,70,133,0.1)']"
					shape="circle"
					:customStyle="{
						padding: '6rpx 12rpx',
						borderRadius: '30rpx'
					}"
					:textStyle="{
						color: '#074685',
						fontSize: '14rpx'
					}"
					v-if="wrapper.item.tag=='实物藏品'"
				/> <CxTag
					:text="wrapper.item.tag || '实物藏品'"
					:bgGradient="['rgba(122,86,50,0.1)', 'rgba(122,86,50,0.1)']"
					shape="circle"
					:customStyle="{
						padding: '6rpx 12rpx',
						borderRadius: '30rpx'
					}"
					:textStyle="{
						color: '#7A5632',
						fontSize: '14rpx'
					}"
					v-else
				/>
			  </view>
			  <text class="watch-people">超{{ wrapper.item.price }}人围观</text>
			</view>
		  </view>
		  
		</view>
	</view>
  </view>	
</template>
<script setup name="block">
import CxTag from '@/components/CxTag.vue';
const props = defineProps(
	{
		colNum: {
		type: Number,
		default: 2
		},
		productList: {
		type: Array,
		default: () => []
		}
	}
);

const columns = computed(() => {
	const cols = Array.from({ length: props.colNum }, () => []);
	props.productList.forEach((item, index) => {
		cols[index % props.colNum].push({
			item,
			originalIndex: index
		});
	});
	return cols;
});

const emit = defineEmits(['click']);
const handleItemClick = (wrapper) => {
	emit('click', {
	item: wrapper.item,
	index: wrapper.originalIndex
	});
};
</script>

<style lang="scss" scoped>
.tag-text{
	color: #805536;
	font-size: 24rpx;
}

.grid-wrapper {
  display: grid;
  gap: 20rpx;
  align-items: start;
}

.grid-column {
	display: flex;
	flex-direction: column;
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
.favorite-column{
	position: absolute;
	top: 0;
	right: 0;
	padding: 8rpx 24rpx;
	background: linear-gradient(to right, #EDD7A0, #F0EDD0);
	border-top-right-radius: 20rpx;
	border-bottom-left-radius: 30rpx;
	font-size: 14rpx;
	display: flex;
	align-items: center;
	justify-content: center;
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
.collect-price{
	display: flex;
	align-items: center;
	justify-content: flex-start;
}
.current-price {
  font-size: 32rpx;
  font-weight: bold;
  color: rgb(254, 56, 56)
}

.original-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 10rpx;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.watch-people {
  font-size: 14rpx;
  color: #999;
}
</style>
