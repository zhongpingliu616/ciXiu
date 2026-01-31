<template>
  <view class="tab-pane" style="height: 100%">
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
            v-if="listData.length === 0 && !loading && !refreshing"
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
</template>

<script setup>
import { orderLists } from '@/api/index';
import BuyerOrderCard from '@/components/gz/order/BuyerOrderCard.vue';

const props = defineProps({
  type: {
    type: Number,
    required: true
  },
  status: {
    type: [Number, null],
    default: null
  },
  mockData: {
    type: Array,
    default: () => []
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

const listData = ref([]);
const loading = ref(false);
const refreshing = ref(false);
const page = ref(1);
const limit = ref(10);
const loadStatus = ref('loadmore');
const hasLoaded = ref(false);

const fetchData = async (reset = false) => {
  if (reset) {
    page.value = 1;
    refreshing.value = true;
    loadStatus.value = 'loading';
  } else {
    loading.value = true;
  }

  // Simulate API call with Mock Data
  setTimeout(() => {
    let filtered = props.mockData;
    
    // Filter by Status
    if (props.status !== null) {
      filtered = filtered.filter(item => item.status === props.status);
    }
    
    // For now, just return filtered mock data
    if (reset) {
      listData.value = filtered;
    } else {
      // Append nothing as mock data is static/limited
      // listData.value = [...listData.value, ...filtered];
    }
    
    refreshing.value = false;
    loading.value = false;
    loadStatus.value = 'nomore';
    hasLoaded.value = true;
  }, 500);
};

const onRefresh = () => {
  fetchData(true);
};

const onScrollToLower = () => {
  if (loadStatus.value === 'loadmore') {
    fetchData();
  }
};

const handleAction = (e) => {
    const { type, item } = e;
    if (type === 'logistics') {
        goToDetail(item); // Navigate to detail for logistics info
        return;
    }
    // Re-emit or handle locally
    uni.$emit('order-action', { type, item });
};

const goToDetail = (item) => {
    uni.navigateTo({
        url: '/pages-gz/orders/detail',
        success: (res) => {
            res.eventChannel.emit('sendOrderDatas', {
                orderInfo: item,
                source: 'buyer' // Flag to indicate buyer context
            });
        }
    });
};

// Initial load
onMounted(() => {
  if (props.isActive) {
      fetchData(true);
  }
});

// Watch for activation to load data if not loaded
watch(() => props.isActive, (newVal) => {
    if (newVal && !hasLoaded.value) {
        fetchData(true);
    }
});

</script>

<style lang="scss" scoped>
.list-content {
  padding-bottom: 20rpx;
}
</style>