<template>
  <view class="container">
    <view class="list-container">
      <view class="list-item" v-for="(item, index) in listData" :key="index">        
        <view class="item-info">
			<view class="item-top">
				<view class="item-top-left">
					<image :src="item.image" mode="aspectFill" class="item-img" />
					
				</view>
				<view class="item-top-right">
					<view class="item-title">{{ item.title }}</view>
					<view class="item-id">ID:{{ item.code }}</view>
					
				</view>
				
				
			</view>
          <view class="item-bottom">
              <text class="price">总价值：¥ {{ item.price }}</text>
			  <CxComfirmBtn
			   text="查看详情"
			   :btnStyle="{
			  	 height: '60rpx',
			  	 width: '160rpx',
			  	 margin: '0'
			   }"
			   @tap="handleDetail(item)"
			   />
              
          </view>
          <view class="count-badge">x{{ item.count }}</view>
        </view>
      </view>
    </view>
    
    <!-- Stats Section -->
    <view class="stats-section">
        <view class="stats-header">
             <view class="red-bar"></view>
             <text class="stats-title">资产统计</text>
        </view>
        <view class="stats-grid">
            <view class="stats-item" v-for="(stat, index) in stats" :key="index">
                <view class="stat-label">{{ stat.label }}</view>
                <view class="stat-value">{{ stat.value }}</view>
            </view>
        </view>
    </view>
  </view>
</template>

<script setup>
const listData = ref([
    {
        id: 1,
        image: 'https://cdn.uviewui.com/uview/album/4.jpg',
        title: '古韵民族丝绸非遗刺绣',
        code: 'EMB-2024-001',
        price: '666.66',
        count: 2
    },
    {
        id: 2,
        image: 'https://cdn.uviewui.com/uview/album/5.jpg',
        title: '古韵民族丝绸非遗刺绣',
        code: 'EMB-2024-001',
        price: '666.66',
        count: 2
    },
     {
        id: 3,
        image: 'https://cdn.uviewui.com/uview/album/6.jpg',
        title: '古韵民族丝绸非遗刺绣',
        code: 'EMB-2024-001',
        price: '666.66',
        count: 2
    }
]);

const stats = ref([
    { label: '持有资产总数', value: '80' },
    { label: '持有资产总额', value: '¥ 1,173.33' },
    { label: '总投资金额', value: '¥ 1,173.33' },
    { label: '当前总市值', value: '¥ 1,173.33' }
]);

const handleDetail = (item) => {
    console.log('Detail', item);
};
</script>

<style lang="scss" scoped>
.container {
    padding: 30rpx 0;
}

.list-item {
    background: #fff;
    border-radius: 16rpx;
    padding: 20rpx;
    display: flex;
    margin-bottom: 20rpx;
    position: relative;
    
    .item-img {
        width: 140rpx;
        height: 140rpx;
        border-radius: 12rpx;
        margin-right: 20rpx;
        background-color: #eee;
    }
    
    .item-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        
        .item-title {
            font-size: 30rpx;
            color: #333;
            font-weight: bold;
        }
        
        .item-id {
            font-size: 24rpx;
            color: #999;
        }
        
        .item-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .price {
                font-size: 26rpx;
                color: #333;
            }
            
            .detail-btn {
                background: linear-gradient(90deg, #FF6B4B 0%, #FF4141 100%);
                color: #fff;
                font-size: 24rpx;
                padding: 8rpx 24rpx;
                border-radius: 24rpx;
            }
        }
        .item-top{
			display: flex;
			border-bottom: 1rpx solid #ccc;
			margin-bottom: 12rpx;
		}
        .count-badge {
            position: absolute;
            right: 20rpx;
            top: 70rpx;
            font-size: 24rpx;
            color: #999;
        }
    }
}

.stats-section {
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-top: 20rpx;
    
    .stats-header {
        display: flex;
        align-items: center;
        margin-bottom: 30rpx;
        
        .red-bar {
            width: 6rpx;
            height: 28rpx;
            background: #FF4141;
            margin-right: 12rpx;
            border-radius: 4rpx;
        }
        
        .stats-title {
            font-size: 30rpx;
            font-weight: bold;
            color: #333;
        }
    }
    
    .stats-grid {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        
        .stats-item {
            width: 48%;
            background: #fff; 
            border: 2rpx solid #F0F0F0;
            border-radius: 12rpx;
            padding: 24rpx;
            margin-bottom: 20rpx;
            box-sizing: border-box;
            
            .stat-label {
                font-size: 24rpx;
                color: #999;
                margin-bottom: 12rpx;
            }
            
            .stat-value {
                font-size: 36rpx;
                color: #333;
                font-weight: bold;
            }
        }
    }
}
</style>