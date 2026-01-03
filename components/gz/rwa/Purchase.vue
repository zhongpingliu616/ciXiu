<template>
  <view class="list-container">
    <view class="list-item" v-for="(item, index) in listData" :key="index">
      <image :src="item.image" mode="aspectFill" class="item-img" />
      <view class="item-info">
        <view class="item-title">{{ item.title }}</view>
        <view class="item-tags">
			<template v-for="(tag, tIndex) in item.tags" :key="tIndex">
				<CxTag
				  :text="tag"
				/>&nbsp;&nbsp;
			</template>
        </view>
        <view class="item-bottom">
            <text class="price">¥ {{ item.price }}</text>
			<CxComfirmBtn
			 text="购买"
			 :btnStyle="{
				 height: '60rpx',
				 width: '160rpx',
				 margin: '0'
			 }"
			 @tap="handleBuy(item)"
			 />
            <!-- <view class="buy-btn" @tap="handleBuy(item)"></view> -->
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const listData = ref([
    {
        id: 1,
        image: 'https://cdn.uviewui.com/uview/album/1.jpg',
        title: '古韵民族丝绸非遗刺绣',
        tags: ['手工苏绣', '真丝面料'],
        price: '666.66'
    },
    {
        id: 2,
        image: 'https://cdn.uviewui.com/uview/album/2.jpg',
        title: '古韵民族丝绸非遗刺绣',
        tags: ['手工苏绣', '真丝面料'],
        price: '666.66'
    },
     {
        id: 3,
        image: 'https://cdn.uviewui.com/uview/album/3.jpg',
        title: '古韵民族丝绸非遗刺绣',
        tags: ['手工苏绣', '真丝面料'],
        price: '666.66'
    }
]);

const handleBuy = (item) => {
    console.log('Buy', item);
    uni.showToast({
        title: '购买功能开发中',
        icon: 'none'
    });
};
</script>

<style lang="scss" scoped>
.list-container {
    padding: 30rpx 0;
}

.list-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    display: flex;
    margin-bottom: 20rpx;
    
    .item-img {
        width: 180rpx;
        height: 180rpx;
        border-radius: 12rpx;
        margin-right: 20rpx;
        background-color: #eee;
    }
    
    .item-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 4rpx 0;
        
        .item-title {
            font-size: 30rpx;
            color: #333;
            font-weight: bold;
        }
        
        .item-tags {
            display: flex;
            flex-wrap: wrap;
            
            .tag {
                background-color: #FFF5E0;
                color: #D4A056;
                font-size: 22rpx;
                padding: 4rpx 12rpx;
                border-radius: 6rpx;
                margin-right: 10rpx;
                margin-bottom: 10rpx;
            }
        }
        
        .item-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .price {
                font-size: 32rpx;
                color: #333;
                font-weight: bold;
            }
            
            .buy-btn {
                background: linear-gradient(90deg, #FF6B4B 0%, #FF4141 100%);
                color: #fff;
                font-size: 26rpx;
                padding: 10rpx 36rpx;
                border-radius: 30rpx;
            }
        }
    }
}
</style>