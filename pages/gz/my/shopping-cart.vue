<template>
  <view class="page-wrap index">
    <LayoutNavigationGz :title="title">
      <template #right>
        <text class="nav-right-text" @tap="toggleManagement">
          {{ managementCart ? '取消管理' : '管理' }}
        </text>
      </template>
    </LayoutNavigationGz>
    
    <view class="page-content">
      <!-- Tabs -->
      <view class="tabs-container">
        <u-tabs
          :list="tabList"
          :current="activeTab"
          @click="onTabClick"
          lineColor="#fff"
          :activeStyle="{ color: '#fff', fontWeight: 'bold', fontSize: '32rpx' }"
          :inactiveStyle="{ color: 'rgba(255,255,255,0.7)', fontSize: '28rpx' }"
          itemStyle="padding-left: 0; padding-right: 40rpx; height: 88rpx;"
          bgColor="transparent"
        ></u-tabs>
        <view class="search-filter-icons">
          <u-icon name="search" color="#fff" size="24"></u-icon>
          <view style="width: 30rpx;"></view>
          <u-icon name="list-dot" color="#fff" size="24"></u-icon>
        </view>
      </view>

      <view class="cart-container">
        <!-- 下拉刷新容器 -->
        <BaseProductList
          @onRefresh="onRefresh"
          @onScrollToLower="onLoadMore"
          :isRefreshing="refreshing"
          :loadStatus="loadStatus"
          :enableRefresh="true"
          :enableLoadMore="true"
        >
          <template #scrollContain>
            <!-- 商品列表 -->
            <view class="list-content">
              <ProductRow
                v-for="(item, index) in currentList"
                :key="item.id"
                :item="item"
                :management="managementCart"
                @update:selected="(val) => updateSelection(item, val)"
                @update:count="(val) => updateCount(item, val)"
                @click="onItemClick(item)"
              />
            </view>

            <!-- 空购物车 -->
            <u-empty
              v-if="currentList.length === 0 && !loading"
              text="购物车空空如也"
              textColor="#D1A156"
              iconColor="#ccc"
              mode="shopping"
              class="empty"
            ></u-empty>
          </template>
        </BaseProductList>
      </view>
    </view>

    <!-- Bottom Bar -->
    <view class="cart-bar">
      <view class="left" @tap="toggleSelectAll">
        <CxCheckbox
          :model-value="isAllSelected"
          :size="36"
        />
        <text class="select-all">全选</text>
      </view>

      <view class="right">
        <template v-if="!managementCart">
          <view class="price">
            <text>合计<text v-if="selectedCount > 0">({{ selectedCount }})</text>: </text><text class="amount">¥{{ totalPrice.toFixed(2) }}</text>
          </view>
          <view class="checkout-btn">
            <CxComfirmBtn 
            text="去结算"
            :btnStyle="{
              width: '140rpx'
            }" 
            :disabled="selectedCount === 0"
            @tap="handleCheckout" /> &nbsp;
          </view>
        </template>
        <template v-else>
          <CxComfirmBtn 
          class="delete-btn"
            :btnStyle="{
              width: '140rpx'
            }" 
            text="删除"
            @tap="handleDelete" />
        </template>
      </view>
    </view>
  </view>
</template>

<script setup name="shoppingCart">
import ProductRow from '@/components/common/ProductRow.vue';

const title = ref("购物车");
const managementCart = ref(false);
const activeTab = ref(0); // 0: NFT, 1: Real

const tabList = [
  { name: 'NFT藏品' },
  { name: '实物藏品' }
];

// Mock Data Generation
const generateMockData = () => {
  const nfts = Array.from({ length: 10 }, (_, i) => ({
    id: `NFT-2024-${String(i + 1).padStart(3, '0')}`,
    type: 'nft',
    selected: false,
    image: `https://picsum.photos/seed/nft${i}/200/200`,
    title: `玄色 · 凤凰刺绣 NFT #${i + 1}`,
    price: 188.00,
    originalPrice: 198.00,
    count: 1,
    viewCount: 0
  }));

  const reals = Array.from({ length: 10 }, (_, i) => ({
    id: `REAL-2024-${String(i + 1).padStart(3, '0')}`,
    type: 'real',
    selected: false,
    image: `https://picsum.photos/seed/real${i}/200/200`,
    title: `手工苏绣团扇 实物商品 #${i + 1}`,
    price: 368.00,
    originalPrice: 488.00,
    count: 1,
    viewCount: 300 + i * 12
  }));

  return [...nfts, ...reals];
};

let allCartList = ref([]);
let cartList = ref([]); // 当前显示/加载的数据（如果我们正在做分页）
// For simplicity in this demo, let's load all and filter by tab
let loading = ref(false);
let refreshing = ref(false);
let noMoreData = ref(false);
let loadStatus = ref('loadmore');

const onTabClick = (item) => {
  activeTab.value = item.index;
  // Reset selection when switching tabs? usually no, but here lists are separate
};

const currentList = computed(() => {
  const type = activeTab.value === 0 ? 'nft' : 'real';
  return allCartList.value.filter(item => item.type === type);
});

// 全选状态 (Current Tab)
const isAllSelected = computed(() => {
  const list = currentList.value;
  return list.length > 0 && list.every(item => item.selected);
});

// 已选数量 (Total across all? Or just current tab? Usually cart is one big list, but with tabs acting as filters)

const selectedItems = computed(() => currentList.value.filter(item => item.selected));
const selectedCount = computed(() => selectedItems.value.length);

// 总价
const totalPrice = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.price * item.count, 0)
);

// Toggle Management
const toggleManagement = () => {
  managementCart.value = !managementCart.value;
};

// Toggle Select All
const toggleSelectAll = () => {
  const target = !isAllSelected.value;
  currentList.value.forEach(item => {
    item.selected = target;
  });
};

// Update Selection
const updateSelection = (item, val) => {
  item.selected = val;
};

// Update Count
const updateCount = (item, val) => {
  item.count = val;
};

// Item Click
const onItemClick = (item) => {
  // Navigate to detail?
  console.log('Item clicked:', item);
};

// Handle Checkout
const handleCheckout = () => {
  if (selectedCount.value === 0) return;
  uni.showToast({
    title: `结算 ${selectedCount.value} 件商品`,
    icon: 'none'
  });
};

// Handle Delete
const handleDelete = () => {
  if (selectedCount.value === 0) return;
  
  uni.showModal({
    title: '提示',
    content: `确认删除选中的 ${selectedCount.value} 件商品吗？`,
    confirmColor: "#D1A156",
    success: res => {
      if (res.confirm) {
        // Remove selected items from allCartList
        // We need to find them in allCartList and remove
        const selectedIds = new Set(selectedItems.value.map(i => i.id));
        allCartList.value = allCartList.value.filter(item => !selectedIds.has(item.id));
        
        uni.showToast({
          title: '删除成功',
          icon: 'success'
        });
      }
    }
  });
};

// Initialize
onMounted(() => {
  loadCartData();
});

const loadCartData = async (isRefresh = false) => {
  if (isRefresh) {
    refreshing.value = true;
    loadStatus.value = 'loading';
  } else {
    loading.value = true;
    loadStatus.value = 'loading';
  }
  
  // Simulate API
  setTimeout(() => {
    if (isRefresh || allCartList.value.length === 0) {
        allCartList.value = generateMockData();
    }
    
    loading.value = false;
    refreshing.value = false;
    noMoreData.value = true; // For now assume all loaded
    loadStatus.value = 'nomore';
  }, 1000);
};

const onRefresh = () => {
  loadCartData(true);
};

const onLoadMore = () => {
  // Implement pagination if needed
};

</script>

<style lang="scss" scoped>
.page-wrap {
  background: url("/static/images/index/bg.png") no-repeat center/cover;
  grid-template-rows: 80rpx 1fr 120rpx;
  display: grid;
  height: 100vh;
}

.nav-right-text {
  color: #fff;
  font-size: 28rpx;
}

.page-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 20rpx;
}

.tabs-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
  margin-bottom: 10rpx;
}

.search-filter-icons {
  display: flex;
  align-items: center;
}

.cart-container {
  flex: 1;
  min-height: 0;
}

.scroll-view {
  height: 100%;
}

.list-content {
  padding-bottom: 20rpx;
}

.loading {
  margin: 40rpx auto;
}

.empty {
  margin-top: 100rpx;
}

/* Bottom Bar */
.cart-bar {
  background: linear-gradient(0deg, #77161D, #B64138);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.1);
  color: #fff;
  z-index: 10;
  border-top: 2rpx solid $app-border-color;
}

.left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.select-all {
  font-size: 28rpx;
}

.right {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.price {
  font-size: 28rpx;
  color: #FFE185;
  
  .amount {
    font-size: 36rpx;
    font-weight: bold;
    font-family: DINAlternate-Bold, sans-serif;
  }
}

.checkout-btn {
white-space: nowrap;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.delete-btn {
  // background: transparent;
  // border: 2rpx solid #FF4D4F;
  // color: #FF4D4F;
  // height: 76rpx;
  // padding: 0 40rpx;
  // border-radius: 38rpx;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // font-size: 30rpx;
  // font-weight: bold;
  
  // &.disabled {
  //   border-color: #999;
  //   color: #999;
  // }
}
</style>