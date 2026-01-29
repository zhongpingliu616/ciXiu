<template>
  <view class="page-wrap collectibles-page">
    <!-- Header with Tabs and Filter -->
       <!-- <up-sticky class="header-sticky"> -->
        <view class="header-section">
          <view class="tabs-container">
            <CxTabs
              :tabItems="tabItems"
              :scrollable="false"
              lineHeight="6rpx"
              lineWidth="40rpx"
              lineColor="#fff"
              :activeStyle="{ color: '#fff', fontSize: '34rpx', fontWeight: 'bold' }"
              :inactiveStyle="{ color: 'rgba(255,255,255,0.6)', fontSize: '30rpx' }"
              :itemStyle="{ padding: '0 20rpx', height: '88rpx' }"
              v-model="currentTab"
              @changeTab="onTabChange"
              class="cx-tabs-instance"
            />
          </view>
          
          <view class="header-icons">
            <view class="icon-btn search-btn" @click="handleSearch">
              <u-icon name="search" size="44" color="#fff"></u-icon>
            </view>
            <view class="icon-btn filter-btn" @click="showFilter = true">
              <image src="/static/images/orders/filter.png" class="filter-icon-img" mode="widthFix" />
            </view>
          </view>
        </view>
       <!-- </up-sticky> -->
    <view class="page-content">
      
      <!-- Product List -->
      <view class="list-wrapper">
        <BaseProductList
          @onScrollToLower="loadMore"
          @onRefresh="refresh"
          :isRefreshing="isRefreshing"
          :loadStatus="loadStatus"
          :enableRefresh="false"
          :enableLoadMore="true"
        >
          <template #scrollContain>
            <view class="list-container">
              <CommonProductCol :colNum="2" :productList="listData" @click="handleItemClick" />
            </view>
          </template>
        </BaseProductList>
      </view>
    </view>
   <LayoutCustomBarGz />
  </view>
    <!-- Filter Popup -->
    <GzIndexFilterCriteria 
      :show="showFilter" 
      @update:show="showFilter = $event"
      @confirm="handleFilterConfirm"
      @close="showFilter = false"
    />

    <!-- Floating Cart -->
    <view class="floating-cart">
      <navigator url="/pages/gz/my/shopping-cart">
          <view class="cart-icon-wrapper">
          <u-icon name="shopping-cart" color="#FFE185" size="60rpx"></u-icon>
          <view class="badge">10</view>
        </view>
      </navigator>
    </view>

<keep-alive>
  <up-popup :show="showSearchPageGz" bgColor="#691e23" mode="right" :duration="100" safeAreaInsetTop customStyle="width: 750rpx;">
    <GzIndexSearch @close="showSearchPageGz = false" />
  </up-popup>
</keep-alive>
</template>

<script setup>

// State
const currentTab = ref(0)
const tabItems = [
  { name: 'NFT藏品' },
  { name: '实物藏品' }
]
const showFilter = ref(false)
const isRefreshing = ref(false)
const loadStatus = ref('loadmore')
const page = ref(1)
const pageSize = 10
const listData = ref([])
const showSearchPageGz = ref(false)



// Mock Data Generation
const generateMockData = (pageNum, tabIndex) => {
  const items = []
  const type = tabIndex === 0 ? 'NFT藏品' : '实物藏品'
  for (let i = 0; i < pageSize; i++) {
    const id = (pageNum - 1) * pageSize + i
    items.push({
      id,
      image: `https://picsum.photos/300/300?random=${id + (tabIndex * 1000)}`,
      title: '玄色 · 凤凰刺绣',
      description: '666.66', // current price
      originalPrice: '3999.66',
      tag: type,
      price: '153', // viewers
      favoriteType: Math.random() > 0.5 ? 'heart-fill' : 'heart',
      likeCount: Math.floor(Math.random() * 200) + 10 // Mock like count
    })
  }
  return items
}

// Methods
const onTabChange = (e) => {
  // CxTabs emits { index, item }
  const index = e.index
  // v-model updates currentTab, so we just trigger refresh if needed
  // But we might want to avoid double refresh if initial load
  refresh()
}

// Ensure switchTab isn't used anymore or maps to onTabChange
const switchTab = (index) => {
    currentTab.value = index
    refresh()
}

const fetchData = async (isRefresh = false) => {
  if (isRefresh) {
    page.value = 1
    loadStatus.value = 'loading'
  } else {
    if (loadStatus.value === 'nomore') return
    loadStatus.value = 'loading'
  }

  // Simulate API call
  setTimeout(() => {
    const newItems = generateMockData(page.value, currentTab.value)
    
    if (isRefresh) {
      listData.value = newItems
      isRefreshing.value = false
    } else {
      listData.value = [...listData.value, ...newItems]
    }

    if (newItems.length < pageSize) {
      loadStatus.value = 'nomore'
    } else {
      loadStatus.value = 'loadmore'
      page.value++
    }
  }, 500)
}

const refresh = () => {
  isRefreshing.value = true
  fetchData(true)
}

const loadMore = () => {
  fetchData(false)
}

const handleItemClick = (item) => {
  console.log('Item clicked:', item)
  if (item.tag.includes('NFT藏品')) {
    uni.navigateTo({
      url: '/pages/gz/collection-detail/nft?id=' + item.id
    })
  } else {
    uni.navigateTo({
      url: '/pages/gz/collection-detail/physical?id=' + item.id
    })
  }
  // Navigate to detail page
}

const handleFilterConfirm = (criteria) => {
  console.log('Filter confirmed:', criteria)
  showFilter.value = false
  refresh()
}

const handleSearch = () => {
    showSearchPageGz.value = true
}

// Lifecycle
onMounted(() => {
  fetchData(true)
})
</script>

<style lang="scss" scoped>
.page-wrap {
  // grid-template-rows: 0rpx 1fr 120rpx;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  // background-color: transparent; // To show page background
  // Or match the header background if it's different. Design shows header blends with page.
  padding-top: calc(var(--status-bar-height) + 10rpx); // Add status bar padding
}

.tabs-container {
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
}

.filter-icon-img {
    width: 40rpx;
    height: 40rpx;
}

.list-wrapper {
  flex: 1;
  overflow: hidden;
}

.list-container {
}

.floating-cart {
  position: fixed;
  right: 40rpx;
  bottom: 140rpx; // Adjust for tab bar
  z-index: 99;
  
  .cart-icon-wrapper {
    width: 100rpx;
    height: 100rpx;
    background: #F8412D; // Red color
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.3);
    position: relative;
    border: 4rpx solid $app-border-color; // Gold border per design style typically
    
    .badge {
      position: absolute;
      top: -10rpx;
      right: -10rpx;
      background-color: #1890FF; // Blue badge
      color: #fff;
      font-size: 24rpx;
      padding: 4rpx 12rpx;
      border-radius: 20rpx;
      min-width: 30rpx;
      text-align: center;
    }
  }
}
</style>
