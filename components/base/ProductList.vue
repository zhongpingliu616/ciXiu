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
      :refresher-enabled="enableRefresh"
      :refresher-triggered="isRefreshing"
      @refresherrefresh="onRefresh"
      @scrolltolower="onScrollToLower"
      :scroll-with-animation="true"
	  refresher-background="none"
    >
      <!-- 商品列表 -->
	  <CommonProductCol
	  :colNum="colNum"
	  :productList="productList"
	  @click="handleItemClick"
	  ></CommonProductCol>
    
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
// 默认配置：每行显示 2 个商品
const props = defineProps({
  colNum: {
    type: Number,
    default: 2
  },
  api: {
    type: Function,
    required: true // 必须传入获取数据的函数
  },
  enableLoadMore: { type: Boolean, default: false }, // 上拉加载
  enableRefresh: { type: Boolean, default: false }  // 下拉刷新
})
const isRefreshing = ref(false) // 下拉刷新状态
const productList = ref([])
const loadStatus = ref('loadmore') // 'loadmore', 'loading', 'nomore'
const iconType = ref('flower')
const loadText = ref({
  loadmore: '上拉加载更多',
  loading: '正在加载...',
  nomore: '没有更多了'
})
const emit = defineEmits(['click']);
let page = 1
const pageSize = 10
let hasMore = true
let isLoading = false // 防止重复触发

// 初始化数据
const fetchData = async () => {
  if (!hasMore || isLoading) return

  isLoading = true
  loadStatus.value = 'loading'
  try {
    const res = await props.api(page, pageSize)
    if (res && Array.isArray(res.list)) {
      productList.value = [...productList.value, ...res.list]
      page++
      hasMore = res.hasMore ?? false
      loadStatus.value = hasMore ? 'loadmore' : 'nomore'
    } else {
      loadStatus.value = 'nomore'
    }
  } catch (err) {
    loadStatus.value = 'loadmore'
    console.error('加载失败:', err)
  } finally {
    isLoading = false
  }
}
// 下拉刷新处理
const onRefresh = async () => {
  if (!props.enableRefresh || isLoading) return
  isRefreshing.value = true
  page = 1
  hasMore = true
  try {
    const res = await props.api(page, pageSize)
    if (res && Array.isArray(res.list)) {
      productList.value = res.list // 刷新数据，替换原有列表
      page++
      hasMore = res.hasMore ?? false
      loadStatus.value = hasMore ? 'loadmore' : 'nomore'
    } else {
      productList.value = []
      loadStatus.value = 'nomore'
    }
  } catch (err) {
    console.error('刷新失败:', err)
  } finally {
    isRefreshing.value = false
  }
}
// 上拉到底部时自动触发
const onScrollToLower = () => {
 if (!props.enableLoadMore || !hasMore || isLoading) return
  fetchData()
}

// 模拟点击事件
const handleItemClick = ({item,index}) => {
  emit('click', {
    item,
    index
  });
}

onMounted(() => {
  fetchData() // 首次加载
})
</script>

<style lang="scss" scoped>
.product-list-container {
  height: 100vh;
}

.scroll-wrapper {
  // height: calc(100vh - 100rpx); /* 减去标题栏高度 */
  height: calc(100vh); /* 减去标题栏高度 */
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