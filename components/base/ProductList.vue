<template>
  <view class="product-list-container">
    <!-- 吸顶标题栏 -->
    <!-- <u-sticky :offset-top="0">
      <view class="sticky-header">
        <text class="header-title">东方美学 | 绣春花</text>
        <u-icon name="arrow-down" size="28" color="#999"></u-icon>
      </view>
    </u-sticky> -->
    <scroll-view
      class="scroll-wrapper"
      scroll-y
	  :enable-back-to-top="true"
      :refresher-enabled="enableRefresh"
      :refresher-triggered="isRefreshing"
	  :refresher-default-style="'black'"
      @refresherrefresh="onRefresh"
      @scrolltolower="onScrollToLower"
      :scroll-with-animation="true"
	  refresher-background="none"
	  :lower-threshold="100"
    >
      <!-- 商品列表 -->
	  <slot name="scrollContain">
		  <!-- <CommonProductCol
		  :colNum="colNum"
		  :productList="productList"
		  @click="handleItemClick"
		  ></CommonProductCol> -->
	  </slot>
      <!-- 加载状态提示 -->
      <u-loadmore
	    v-if="enableLoadMore"
        :status="loadStatus"
        :icon-type="iconType"
        :load-text="loadText"
        margin-top="20rpx"
      />
    </scroll-view>

  </view>
</template>

<script setup>
const props = defineProps({
  isRefreshing: {
    type: Boolean,
    default: false // 下拉刷新状态
  },
  loadStatus: {
    type: String,
    default: 'loadmore' // 'loadmore', 'loading', 'nomore'
  },
  iconType: {
    type: String,
    default: 'flower'
  },
  enableLoadMore: { type: Boolean, default: false }, // 上拉加载
  enableRefresh: { type: Boolean, default: false }  // 下拉刷新
});
const loadText = ref({
  loadmore: '上拉加载更多',
  loading: '正在加载...',
  nomore: '没有更多了'
})
const emit = defineEmits(['onRefresh','onScrollToLower']);


// 下拉刷新处理
const onRefresh = async () => {
	emit('onRefresh');
}
// 上拉到底部时自动触发
const onScrollToLower = () => {
 if (!props.enableLoadMore) return
  emit('onScrollToLower');
}
onMounted(() => {
})
</script>

<style lang="scss" scoped>
.product-list-container {
  height: 100%;
}

.scroll-wrapper {
  height: calc(100%); /* 减去标题栏高度 */
  box-sizing: border-box;
  padding: 20rpx 0;
}

.sticky-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
  background-color: #fff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.header-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-right: 10rpx;
}

</style>