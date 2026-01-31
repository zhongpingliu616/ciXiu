<template>
  <view class="order-card-item" @click="handleCardClick">
    <!-- Header: Time and Status -->
    <view class="card-top-row">
      <text class="order-time">下单时间: {{ item.create_time }}</text>
      <view class="status-tag" :class="statusClass">
        <text>{{ statusText }}</text>
      </view>
    </view>

    <!-- Content: Product List -->
    <view class="goods-list">
      <view 
        class="card-content-row" 
        v-for="(goods, index) in displayGoodsList" 
        :key="index"
      >
        <image :src="goods.image" class="product-image" mode="aspectFill" />
        <view class="product-info">
          <view class="product-title">{{ goods.title || goods.name }}</view>
          <view class="product-tags">
            <view class="tag-item" v-for="(tag, tIndex) in (goods.tags || [])" :key="tIndex">
              <text>{{ tag }}</text>
            </view>
            <!-- Fallback tag logic if no explicit tags -->
            <view class="tag-item" v-if="(!goods.tags || goods.tags.length === 0)">
               <text>{{ item.type === 'nft' ? 'NFT藏品' : '实物藏品' }}</text>
            </view>
          </view>
          <view class="price-row">
            <text class="price-symbol">¥ </text>
            <text class="price-num">{{ goods.price || goods.amount }}</text>
            <view class="count-num">x{{ goods.num || goods.count || 1 }}</view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- Order No -->
    <view class="order-no-row">
      <text>订单号: {{ item.order_id }}</text>
    </view>

    <!-- Footer: Total and Actions -->
    <view class="card-footer">
      <view class="total-row">
        <text>合计: </text>
        <text class="total-price">¥ {{ totalAmount }}</text>
      </view>
      
      <view class="action-buttons" v-if="showActions">
        <!-- Wait Pay (10) -->
        <template v-if="item.status === 10">
          <view class="btn btn-outline" @click.stop="handleAction('cancel')">取消订单</view>
          <view class="btn btn-primary" @click.stop="handleAction('pay')">立即支付</view>
        </template>

        <!-- Wait Ship (20) -->
        <template v-else-if="item.status === 20">
          <view class="btn btn-outline" @click.stop="handleAction('refund')">申请退款</view>
          <view class="btn btn-primary" @click.stop="handleAction('remind')">提醒发货</view>
        </template>

        <!-- Wait Receive (50) -->
        <template v-else-if="item.status === 50">
          <!-- <view class="btn btn-outline" @click.stop="handleAction('logistics')">查看物流</view> -->
          <view class="btn btn-outline" @click.stop="handleAction('aftersales')">申请售后</view>
          <view class="btn btn-primary" @click.stop="handleAction('confirm')">确认收货</view>
        </template>
        
        <!-- Completed (70) -->
         <template v-else-if="item.status === 70">
           <view class="btn btn-outline" @click.stop="handleAction('delete')">删除订单</view>
           <!-- <view class="btn btn-outline" @click.stop="handleAction('logistics')">查看物流</view> -->
           <view class="btn btn-primary" @click.stop="handleAction('buy_again')">再买一单</view>
         </template>

         <!-- Cancelled/Refund (90) -->
         <template v-else-if="item.status === 90">
           <view class="btn btn-outline" @click.stop="handleAction('delete')">删除订单</view>
           <view class="btn btn-primary" @click.stop="handleAction('buy_again')">再买一单</view>
         </template>
      </view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['action', 'click']);

// Unify goods list logic: use goods_list if available, otherwise construct from single item props
const displayGoodsList = computed(() => {
  if (props.item.goods_list && Array.isArray(props.item.goods_list) && props.item.goods_list.length > 0) {
    return props.item.goods_list;
  }
  // Fallback for old data structure
  return [{
    image: props.item.image,
    title: props.item.name || props.item.title,
    price: props.item.price || props.item.amount,
    num: props.item.num || props.item.count || 1,
    tags: props.item.tags || []
  }];
});

const totalAmount = computed(() => {
  if (props.item.total_amount) return props.item.total_amount;
  
  // Calculate from displayGoodsList
  return displayGoodsList.value.reduce((sum, goods) => {
    const price = parseFloat(goods.price || goods.amount || 0);
    const num = parseInt(goods.num || goods.count || 1);
    return sum + (price * num);
  }, 0).toFixed(2);
});

const statusMap = {
  10: { text: '待付款', class: 'status-wait-pay' },
  20: { text: '待发货', class: 'status-wait-ship' },
  50: { text: '待收货', class: 'status-received' }, 
  70: { text: '已完成', class: 'status-completed' },
  90: { text: '退款售后', class: 'status-refund' } 
};


const statusText = computed(() => {
  // Allow override from item if needed, otherwise use map
  return statusMap[props.item.status]?.text || '未知状态';
});

const statusClass = computed(() => statusMap[props.item.status]?.class || '');
const showActions = computed(() => [10, 20, 50, 70, 90].includes(props.item.status));

const handleAction = (type) => {
  emit('action', { type, item: props.item });
};

const handleCardClick = () => {
  emit('click', props.item);
};
</script>

<style lang="scss" scoped>
.order-card-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.05);
}

.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
  
  .order-time {
    font-size: 24rpx;
    color: #999;
    font-weight: 400;
  }
  
  .status-tag {
    padding: 6rpx 16rpx;
    border-radius: 8rpx;
    font-size: 22rpx;
    font-weight: bold;
    
    &.status-wait-pay {
      background: rgba(248, 43, 29, 0.1);
      color: #F82B1D;
    }
    
    &.status-wait-ship {
      background: rgba(250, 191, 110, 0.15);
      color: #FABF6E;
    }
    
    &.status-received {
      background: rgba(64, 158, 255, 0.1);
      color: #409EFF;
    }

    &.status-completed {
       background: #F5F7FA;
       color: #909399;
    }
    
    &.status-refund {
      background: rgba(248, 43, 29, 0.05);
      color: #909399;
    }
  }
}

.card-content-row {
  display: flex;
  margin-bottom: 30rpx;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .product-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 12rpx;
    margin-right: 24rpx;
    background: #f5f5f5;
  }
  
  .product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 160rpx;
  }
  
  .product-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    line-height: 1.4;
    margin-bottom: 8rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  
  .product-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    margin-bottom: 12rpx;
    
    .tag-item {
      font-size: 20rpx;
      color: #C69F6C;
      background: rgba(198, 159, 108, 0.1);
      padding: 2rpx 10rpx;
      border-radius: 4rpx;
    }
  }
  
  .price-row {
    margin-top: auto;
    color: #333;
    font-weight: bold;
    display: flex;
    align-items: baseline;
    
    .price-symbol {
      font-size: 24rpx;
    }
    
    .price-num {
      font-size: 30rpx;
    }

    .count-num {
        margin-left: auto;
        font-size: 26rpx;
        color: #999;
    }
  }
}

.order-no-row {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 24rpx;
  padding-bottom: 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .total-row {
    font-size: 26rpx;
    color: #333;
    display: flex;
    align-items: baseline;
    
    .total-price {
      font-size: 34rpx;
      font-weight: bold;
      margin-left: 10rpx;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 16rpx;
    
    .btn {
      padding: 12rpx 32rpx;
      border-radius: 34rpx;
      font-size: 26rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 140rpx;
      
      &.btn-outline {
        border: 1rpx solid #ddd;
        color: #666;
        background: #fff;
      }
      
      &.btn-primary {
        background: linear-gradient(90deg, #F82A1C 0%, #FC7E5A 100%);
        color: #fff;
        border: none;
        box-shadow: 0 4rpx 8rpx rgba(248, 42, 28, 0.2);
      }
    }
  }
}
</style>