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
          lineHeight="96%"
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

      <!-- Order List Container with Multi-component KeepAlive logic -->
      <view class="list-container">
        <!-- Render a list component for each tab status -->
        <!-- We use v-show to keep components alive and preserve scroll position -->
        <block v-for="(tab, index) in tabsList" :key="index">
          <view v-show="currentTab === index" style="height: 100%">
             <OrderTabPane 
               :type="typeTab"
               :status="tab.value"
               :mockData="mockData"
               :isActive="currentTab === index"
             />
          </view>
        </block>
      </view>
    </view>
  </view>
</template>

<script setup name="orders">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import OrderTabPane from '@/components/gz/order/OrderTabPane.vue';

const title = ref('我的订单');
const currentTab = ref(0);
const typeTab = ref(0); // 0: NFT, 1: Real
let statusTabWidth = ref(110);
const lineBg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAICAMAAACMAFxIAAAAzFBMVEUAAAD4KBv/gFf5eVn4Kxz4LB35LB38elf8fVj8fVr7elj4Kx38fFn8elf8fVn4Khz4LR78elf8fVn4LR74Kx34LB74LR74Lh/4MCD4MSH4MiL4NCP5NST5Nyb5OSf5Oij5PCn5Piv5QCz5Qi75RC/5RjD5SDL5SjP6TDX6Tjb6UDj6Ujr6VDv6Vj36WD76WkD6XEH6XkP7YET7Ykb7ZEf7Zkn7aEr7akv7bE37bk77b0/7cVH7c1L8dFP8dlT8d1X8eFb8elf8e1j8fFlwxwMgAAAAFHRSTlMAJiYora2tra2tru7u8fHz8/Pz9A5jUGUAAABISURBVBgZlcFBDoAgDATAbW00QnyP/z9qvPAYawhU/QI7IxDLi4wq3kMkJWGcrtMKyj5rBikpWF1vkJrGA8pR7fO2GUZdUd8fzbgT1C1Y/jMAAAAASUVORK5CYII='

const typeTabsList = [
  { name: 'NFT藏品' },
  { name: '实物藏品' }
];

const tabsList = [
  { name: '全部', value: null },
  { name: '待付款', value: 10 },
  { name: '待发货', value: 20 },
  { name: '待收货', value: 50 },
  { name: '已收货', value: 70 },
  { name: '退款售后', value: 90 }
];

// Mock Data for Design Verification
const mockData = [
  // 1. Wait Pay (Status 10) - Multi Product
  {
    id: 1,
    order_id: '202501010001',
    create_time: '2025-01-01 10:00:00',
    status: 10,
    total_amount: 376.00,
    goods_list: [
      {
        image: 'https://via.placeholder.com/160',
        title: '古第 民族纹绣非遗刺绣 (待付款)',
        tags: ['实物藏品', '限量999份'],
        price: 188.00,
        num: 1
      },
      {
        image: 'https://via.placeholder.com/160',
        title: '云色·凤凰刺绣',
        tags: ['实物藏品'],
        price: 188.00,
        num: 1
      }
    ]
  },
  // 2. Wait Ship (Status 20)
  {
    id: 2,
    order_id: '202501020002',
    create_time: '2025-01-02 11:30:00',
    status: 20,
    total_amount: 376.00,
    goods_list: [
      {
        image: 'https://via.placeholder.com/160',
        title: '云色·凤凰刺绣 (待发货)',
        tags: ['实物藏品'],
        price: 188.00,
        num: 2
      }
    ]
  },
  // 3. Wait Receive (Status 50)
  {
    id: 3,
    order_id: '202501030003',
    create_time: '2025-01-03 14:15:00',
    status: 50,
    total_amount: 564.00,
    goods_list: [
      {
        image: 'https://via.placeholder.com/160',
        title: '苗族银饰挂件 (待收货)',
        tags: ['实物藏品', '纯银'],
        price: 282.00,
        num: 1
      },
      {
        image: 'https://via.placeholder.com/160',
        title: '手工刺绣荷包',
        tags: ['实物藏品'],
        price: 141.00,
        num: 2
      }
    ]
  },
  // 4. Completed (Status 70)
  {
    id: 4,
    order_id: '202501040004',
    create_time: '2025-01-04 09:20:00',
    status: 70,
    total_amount: 199.00,
    goods_list: [
      {
        image: 'https://via.placeholder.com/160',
        title: '非遗蜡染围巾 (已完成)',
        tags: ['实物藏品', '手工'],
        price: 199.00,
        num: 1
      }
    ]
  },
  // 5. Refund/Aftersales (Status 90)
  {
    id: 5,
    order_id: '202501050005',
    create_time: '2025-01-05 16:45:00',
    status: 90,
    total_amount: 299.00,
    goods_list: [
      {
        image: 'https://via.placeholder.com/160',
        title: '苏绣团扇 (售后中)',
        tags: ['实物藏品'],
        price: 299.00,
        num: 1
      }
    ]
  },
  // 6. Large Order (Status 10) - Test Scrolling
  {
    id: 6,
    order_id: '202501060006',
    create_time: '2025-01-06 08:00:00',
    status: 10,
    goods_list: [
      {
        image: 'https://via.placeholder.com/160',
        title: '非遗苗绣挂画 A款',
        tags: ['实物藏品'],
        price: 500.00,
        num: 1
      },
      {
        image: 'https://via.placeholder.com/160',
        title: '非遗苗绣挂画 B款',
        tags: ['实物藏品'],
        price: 500.00,
        num: 1
      },
      {
        image: 'https://via.placeholder.com/160',
        title: '非遗苗绣挂画 C款',
        tags: ['实物藏品'],
        price: 500.00,
        num: 1
      },
      {
        image: 'https://via.placeholder.com/160',
        title: '非遗苗绣挂画 D款',
        tags: ['实物藏品'],
        price: 500.00,
        num: 1
      },
      {
        image: 'https://via.placeholder.com/160',
        title: '非遗苗绣挂画 E款',
        tags: ['实物藏品'],
        price: 500.00,
        num: 1
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
});

const switchType = (val) => {
  const type = typeof val === 'object' ? val.index : val;
  if (typeTab.value === type) return;
  typeTab.value = type;
  // Reset status tab to 'All'
  currentTab.value = 0;
};

const onTabChange = (val) => {
  const index = typeof val === 'object' ? val.index : val;
  currentTab.value = index;
  statusTabWidth.value = val.e.rect.width;
};
</script>

<style lang="scss" scoped>
.page-wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: url("@/static/images/index/bg.png") no-repeat center/cover;
}

.orders {
  // background-color: #f5f5f5; // Removed to show bg image
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.type-tabs-container {
  display: flex;
}

.status-tabs-container {
  margin-top: 20rpx;
}

.list-container {
  flex: 1;
  overflow: hidden;
}

.nav-icons {
  display: flex;
  align-items: center;
}
</style>