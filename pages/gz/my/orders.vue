<template>
  <view class="page-wrap orders">
    <!-- Custom Navigation -->
    <LayoutNavigationGz title="我的订单">
      <template #right>
        <view class="nav-icons">
          <u-icon name="search" color="#fff" size="40rpx" style="margin-right: 20rpx;"></u-icon>
          <u-icon name="list" color="#fff" size="40rpx"></u-icon>
        </view>
      </template>
    </LayoutNavigationGz>

    <view class="page-content">
      <!-- Type Tabs (NFT / Real) -->
      <view class="type-tabs-container">
        <CxTabs
          v-model="typeTab"
          :tabItems="typeTabsList"
          :scrollable="false"
          lineHeight="5"
          lineWidth="56rpx"
          :itemStyle="{
             padding:'2rpx 25rpx'
          }"
          :activeStyle="{
             color: '#fff'
          }"
          :lineBg="'rgba(255, 255, 255, 0.6)'"
          @changeTab="switchType"
        />
      </view>

      <!-- Status Tabs (Standard) -->
      <view class="status-tabs-container">
        <CxTabs
          v-model="currentTab"
          :tabItems="tabsList"
          :scrollable="true"
          lineHeight="78rpx"
          :lineWidth="statusTabWidth + 'rpx'"
          :itemStyle="{
             padding:'2rpx 25rpx'
          }"
          :activeStyle="{
             color: '#fff'
          }"
          :lineBg="lineBg"
          @changeTab="onTabChange"
        />
      </view>

      <!-- Order List -->
      <view class="list-container">
        <BaseProductList
          ref="listRef"
          :isRefreshing="refreshing"
          :loadStatus="loadStatus"
          :enableRefresh="true"
          :enableLoadMore="true"
          @onRefresh="onRefresh"
          @onScrollToLower="onScrollToLower"
        >
          <template #scrollContain>
            <view class="list-content">
              <BuyerOrderCard
                v-for="(item, index) in listData"
                :key="item.id || index"
                :item="item"
                @action="handleAction"
                @click="goToDetail"
              />
              
              <!-- Empty State -->
              <u-empty
                v-if="listData.length === 0 && !loading"
                text="暂无订单"
                textColor="#999"
                iconColor="#ccc"
                mode="order"
                margin-top="100"
              ></u-empty>
            </view>
          </template>
        </BaseProductList>
      </view>
    </view>
  </view>
</template>

<script setup name="orders">
import { orderLists, editOrderSatus, orderRemind } from '@/api/index';
import BuyerOrderCard from '@/components/gz/order/BuyerOrderCard.vue';

const title = ref('我的订单');
const currentTab = ref(0);
const typeTab = ref(0); // 0: NFT, 1: Real
const listData = ref([]);
const loading = ref(false);
const refreshing = ref(false);
let statusTabWidth = ref(110);
const page = ref(1);
const limit = ref(10);
const loadStatus = ref('loadmore');
const lineBg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAICAMAAACMAFxIAAAAzFBMVEUAAAD4KBv/gFf5eVn4Kxz4LB35LB38elf8fVj8fVr7elj4Kx38fFn8elf8fVn4Khz4LR78elf8fVn4LR74Kx34LB74LR74Lh/4MCD4MSH4MiL4NCP5NST5Nyb5OSf5Oij5PCn5Piv5QCz5Qi75RC/5RjD5SDL5SjP6TDX6Tjb6UDj6Ujr6VDv6Vj36WD76WkD6XEH6XkP7YET7Ykb7ZEf7Zkn7aEr7akv7bE37bk77b0/7cVH7c1L8dFP8dlT8d1X8eFb8elf8e1j8fFlwxwMgAAAAFHRSTlMAJiYora2tra2tru7u8fHz8/Pz9A5jUGUAAABISURBVBgZlcFBDoAgDATAbW00QnyP/z9qvPAYawhU/QI7IxDLi4wq3kMkJWGcrtMKyj5rBikpWF1vkJrGA8pR7fO2GUZdUd8fzbgT1C1Y/jMAAAAASUVORK5CYII='

const typeTabsList = [
  { name: 'NFT藏品' },
  { name: '实物藏品' }
];

const tabsList = [
  { name: '全部', value: null },
  { name: '待付款', value: 10 },
  { name: '待收货', value: 50 },
  { name: '已收货', value: 70 }, // Assuming 70 is Completed/Received
  { name: '退款售后', value: 90 }
];

// Mock Data for Design Verification
const mockData = [
  {
    id: 1,
    order_id: '2025121912011234567890',
    create_time: '2021-12-20 19:41:37',
    status: 10, // Wait Pay
    total_amount: 792.00,
    goods_list: [
      {
        image: 'https://via.placeholder.com/160',
        title: '古第 民族纹绣非遗刺绣',
        tags: ['实物藏品', '限量999份'],
        price: 188.00,
        num: 1
      },
      {
        image: 'https://via.placeholder.com/160',
        title: '云色·凤凰刺绣',
        tags: ['实物藏品', '限量999份'],
        price: 188.00,
        num: 3
      }
    ]
  },
  {
    id: 2,
    order_id: '2025121912011234567890',
    create_time: '2021-12-20 19:41:37',
    status: 50, // Wait Receive
    total_amount: 792.00,
    goods_list: [
      {
        image: 'https://via.placeholder.com/160',
        title: '古第 民族纹绣非遗刺绣',
        tags: ['实物藏品', '限量999份'],
        price: 188.00,
        num: 1
      },
      {
        image: 'https://via.placeholder.com/160',
        title: '云色·凤凰刺绣',
        tags: ['实物藏品', '限量999份'],
        price: 188.00,
        num: 3
      }
    ]
  },
  {
    id: 3,
    order_id: '2025121912011234567890',
    create_time: '2021-12-20 19:41:37',
    status: 70, // Completed / Received
    total_amount: 792.00,
    goods_list: [
      {
        image: 'https://via.placeholder.com/160',
        title: '古第 民族纹绣非遗刺绣',
        tags: ['实物藏品', '限量999份'],
        price: 188.00,
        num: 1
      },
      {
        image: 'https://via.placeholder.com/160',
        title: '云色·凤凰刺绣',
        tags: ['实物藏品', '限量999份'],
        price: 188.00,
        num: 3
      }
    ]
  },
  {
    id: 4,
    order_id: '2025121912011234567890',
    create_time: '2021-12-20 19:41:37',
    status: 70, // Completed
    total_amount: 792.00,
    goods_list: [
      {
        image: 'https://via.placeholder.com/160',
        title: '古第 民族纹绣非遗刺绣',
        tags: ['实物藏品', '限量999份'],
        price: 188.00,
        num: 1
      },
      {
        image: 'https://via.placeholder.com/160',
        title: '云色·凤凰刺绣',
        tags: ['实物藏品', '限量999份'],
        price: 188.00,
        num: 3
      }
    ]
  },
  {
    id: 5,
    order_id: '2025121912011234567890',
    create_time: '2021-12-20 19:41:37',
    status: 90, // Cancelled/Refund
    total_amount: 792.00,
    goods_list: [
      {
        image: 'https://via.placeholder.com/160',
        title: '古第 民族纹绣非遗刺绣',
        tags: ['实物藏品', '限量999份'],
        price: 188.00,
        num: 1
      },
      {
        image: 'https://via.placeholder.com/160',
        title: '云色·凤凰刺绣',
        tags: ['实物藏品', '限量999份'],
        price: 188.00,
        num: 3
      }
    ]
  }
];

onLoad((options) => {
  if (options.type) {
    const type = parseInt(options.type);
    if (type >= 0 && type < tabsList.length) {
      currentTab.value = type;
    }
  }
  // Load mock data immediately
  listData.value = mockData;
  loadStatus.value = 'nomore';
});

const switchType = (val) => {
  const type = typeof val === 'object' ? val.index : val;
  if (typeTab.value === type) return;
  typeTab.value = type;
  // Reset and fetch
  currentTab.value = 0;
  // fetchData(true);
  listData.value = mockData; // Keep using mock data
};

const fetchData = async (reset = false) => {
  // Commented out for static data usage
  /*
  if (reset) {
    page.value = 1;
    refreshing.value = true;
    loadStatus.value = 'loading';
  } else {
    loading.value = true;
  }

  try {
    const status = tabsList[currentTab.value].value;
    const params = {
      page: page.value,
      limit: limit.value,
      type: typeTab.value === 0 ? 'nft' : 'goods',
      ...(status !== null ? { status } : {})
    };

    const res = await orderLists(params);
    
    refreshing.value = false;
    loading.value = false;

    if (res.code === 200) {
      const list = res.data.lists || [];
      if (reset) {
        listData.value = list;
      } else {
        listData.value = [...listData.value, ...list];
      }

      if (list.length < limit.value) {
        loadStatus.value = 'nomore';
      } else {
        loadStatus.value = 'loadmore';
        page.value++;
      }
    } else {
      loadStatus.value = 'nomore';
      uni.showToast({ title: res.msg || '获取数据失败', icon: 'none' });
    }
  } catch (error) {
    console.error(error);
    refreshing.value = false;
    loading.value = false;
    loadStatus.value = 'nomore';
  }
  */
  // Simulate network delay
  setTimeout(() => {
      refreshing.value = false;
      loading.value = false;
  }, 500);
};

const onTabChange = (val) => {
  const index = typeof val === 'object' ? val.index : val;
  currentTab.value = index;
  statusTabWidth.value = val.e.rect.width;
  // Filter mock data based on status if needed, or just show all for design check
  const selectedStatus = tabsList[index].value;
  if (selectedStatus === null) {
      listData.value = mockData;
  } else {
      listData.value = mockData.filter(item => item.status === selectedStatus);
      // If mock data doesn't have enough coverage, fallback to all or specific
      if (listData.value.length === 0) listData.value = mockData; // Fallback to show something
  }
};

const onRefresh = () => {
  // fetchData(true);
  refreshing.value = true;
  setTimeout(() => {
      refreshing.value = false;
  }, 1000);
};

const onScrollToLower = () => {
//   if (loadStatus.value === 'loadmore') {
//     fetchData();
//   }
};

const handleAction = async ({ type, item }) => {
  switch (type) {
    case 'pay':
      uni.showToast({ title: '跳转支付页面', icon: 'none' });
      break;
    case 'cancel':
      uni.showModal({
        title: '提示',
        content: '确定要取消订单吗？',
        success: async (res) => {
          if (res.confirm) {
            // Mock success
             uni.showToast({ title: '取消成功', icon: 'none' });
          }
        }
      });
      break;
    case 'remind':
      uni.showToast({ title: '已提醒发货', icon: 'none' });
      break;
    case 'refund':
      uni.showToast({ title: '申请退款功能开发中', icon: 'none' });
      break;
    case 'aftersales':
      uni.showToast({ title: '申请售后功能开发中', icon: 'none' });
      break;
    case 'buy_again':
      uni.showToast({ title: '再买一单功能开发中', icon: 'none' });
      break;
    case 'confirm':
      uni.showModal({
        title: '提示',
        content: '确认已收到商品吗？',
        success: async (res) => {
          if (res.confirm) {
             uni.showToast({ title: '确认收货成功', icon: 'none' });
          }
        }
      });
      break;
    case 'logistics':
      uni.showToast({ title: '查看物流', icon: 'none' });
      break;
    case 'delete':
       uni.showModal({
        title: '提示',
        content: '确定要删除订单吗？',
        success: async (res) => {
          if (res.confirm) {
             uni.showToast({ title: '删除成功', icon: 'none' });
          }
        }
      });
      break;
  }
};

const goToDetail = (item) => {
  uni.showToast({ title: '跳转详情页', icon: 'none' });
};

onMounted(() => {
 //  fetchData(true);
});
</script>

<style lang="scss" scoped>
.page-wrap {
  background-color: #551011; 
  background-image: url("https://img.js.design/assets/img/66c40a7b9b007d4b4d633333.png"); // Placeholder or use project asset
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav-icons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.type-tabs-container {
  display: flex;
  align-items: center;
}

.status-tabs-container {
  padding: 0 0 20rpx;
}

.list-container {
  flex: 1;
  overflow: hidden;
  padding: 0 20rpx 20rpx;
  box-sizing: border-box;
}

.list-content {
  padding-bottom: 20rpx;
}
</style>