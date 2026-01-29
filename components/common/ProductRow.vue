<template>
  <view class="product-row">
    <!-- Checkbox -->
    <view class="checkbox-wrapper" @tap.stop="toggleSelection">
      <CxCheckbox :modelValue="item.selected" :size="36" />
    </view>

    <!-- Content -->
    <view class="content-wrapper" @tap="onItemClick">
      <image :src="item.image" mode="aspectFill" class="product-image"></image>
      
      <view class="product-info">
        <!-- Title -->
        <view class="title-row">
          <text class="title">{{ item.title }}</text>
        </view>

        <!-- Meta Info (ID or View Count) -->
        <view class="meta-row">
          <text v-if="item.type === 'nft'" class="meta-text">ID: {{ item.id }}</text>
          <text v-else class="meta-text">超{{ item.viewCount || 321 }}人看过</text>
        </view>

        <!-- Tags -->
        <view class="tags-row">
          <view class="tag-badge" :class="item.type === 'nft' ? 'nft-tag' : 'real-tag'">
            {{ item.type === 'nft' ? 'NFT藏品' : '实物藏品' }}
          </view>
          <text v-if="item.type === 'nft'" class="trend-text">比昨日上涨0.05%</text>
        </view>

        <!-- Price & Actions -->
        <view class="price-action-row">
          <view class="price-box">
            <text class="currency">¥</text>
            <text class="price">{{ formatPrice(item.price) }}</text>
            <text class="original-price">¥{{ item.originalPrice || (item.price * 1.1).toFixed(2) }}</text>
          </view>

          <!-- Quantity Control (For Real items or Management Mode) -->
          <view class="quantity-control" v-if="item.type !== 'nft' || management">
             <!-- Only show +/- if management or if it's a real item that allows multiple qty -->
             <!-- Assuming NFT is quantity 1 usually, but if management is on, maybe we can delete/select -->
             <!-- Design shows Real items have +/-. NFT items don't show +/- in view mode. -->
             
             <view class="stepper" v-if="item.type !== 'nft' || management">
                <view class="step-btn minus" @tap.stop="updateQuantity(-1)">
                  <u-icon name="minus" size="16" color="#333"></u-icon>
                </view>
                <text class="step-value">{{ item.count }}</text>
                <view class="step-btn plus" @tap.stop="updateQuantity(1)">
                  <u-icon name="plus" size="16" color="#333"></u-icon>
                </view>
             </view>
          </view>
          
          <view v-else class="quantity-display">
             <text class="count-x">x{{ item.count }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({})
  },
  management: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:selected', 'update:count', 'click', 'delete']);

const toggleSelection = () => {
  emit('update:selected', !props.item.selected);
};

const onItemClick = () => {
  emit('click', props.item);
};

const updateQuantity = (delta) => {
  const newCount = props.item.count + delta;
  if (newCount < 1) {
    // If count goes below 1, maybe ask to delete? 
    // Usually stepper stays at 1, delete is separate.
    // But if management is true, maybe we allow delete?
    // For now, keep at 1 min via stepper.
    return;
  }
  emit('update:count', newCount);
};

const formatPrice = (price) => {
  return Number(price).toFixed(2);
};
</script>

<style lang="scss" scoped>
.product-row {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #fff;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.02);
}

.checkbox-wrapper {
  margin-right: 24rpx;
  display: flex;
  align-items: center;
  height: 100%;
}

.content-wrapper {
  flex: 1;
  display: flex;
  min-width: 0;
}

.product-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 16rpx;
  margin-right: 24rpx;
  background: #f5f5f5;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
  padding-top: 4rpx;
  padding-bottom: 4rpx;
}

.title-row {
  margin-bottom: 8rpx;
}

.title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  lines: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.meta-row {
  margin-bottom: 8rpx;
}

.meta-text {
  font-size: 24rpx;
  color: #999;
}

.tags-row {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.tag-badge {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  margin-right: 12rpx;
  
  &.nft-tag {
    background: #E8F3FF;
    color: #1677FF;
  }
  
  &.real-tag {
    background: #F6EFE9;
    color: #8B5C3E;
  }
}

.trend-text {
  font-size: 20rpx;
  color: #999;
}

.price-action-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.price-box {
  display: flex;
  align-items: baseline;
}

.currency {
  font-size: 24rpx;
  color: #FF4D4F;
  font-weight: bold;
  margin-right: 4rpx;
}

.price {
  font-size: 36rpx;
  color: #FF4D4F;
  font-weight: bold;
  margin-right: 12rpx;
  font-family: DINAlternate-Bold, sans-serif;
}

.original-price {
  font-size: 24rpx;
  color: #CCC;
  text-decoration: line-through;
}

.quantity-control {
  .stepper {
    display: flex;
    align-items: center;
    
    .step-btn {
      width: 44rpx;
      height: 44rpx;
      border-radius: 50%;
      border: 1rpx solid #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      
      &:active {
        background: #f5f5f5;
      }
      
      &.minus {
        
      }
      &.plus {
        
      }
    }
    
    .step-value {
      margin: 0 16rpx;
      font-size: 28rpx;
      color: #333;
      min-width: 40rpx;
      text-align: center;
    }
  }
}

.quantity-display {
  .count-x {
    font-size: 26rpx;
    color: #999;
  }
}
</style>