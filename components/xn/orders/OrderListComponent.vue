<template>
<BaseProductList
  @onScrollToLower="onScrollToLower"
  @onRefresh="onRefresh"
  :isRefreshing="refreshing"
  :loadStatus="loadStatus"
  :iconType="iconType"
  :enableRefresh="true"
  :enableLoadMore="true"
  class="order-list"
  >
	<template #scrollContain>
		<!-- 订单列表 -->
		<template v-for="(item, index) in listData" :key="item.id">
				<XnOrdersOrderManagementCard :item="item" @action="handleAction"></XnOrdersOrderManagementCard>
		</template>
	</template>
  </BaseProductList>
<CxModal
  v-model:show="showCancelModal"
  content="确定要取消订单吗？"
  @confirm="confirmCancelOrder"
/>
<CxModal
  v-model:show="showConfirmOrder"
  content="确认收到货了吗？"
  @confirm="confirmOrder"
/>
<CxModal
  v-model:show="showDeleOrder"
  content="确定要删除订单吗？"
  @confirm="confirmDeleOrder"
/>
</template>

<script setup name="OrderListComponent">
import { ref } from 'vue'


const props = defineProps({
  // 订单状态，如果为 null/undefined 则显示全部。可以是数字或数字数组
  status: {
    type: [Number, Array],
    default: null
  }
})

// 状态定义
const ORDER_STATUS = {
  WAIT_PAY: 10, // '待支付'
  WAIT_SHIP: 20, // '待发货'
  SHIPPED: 30,  // '已交付'
  WAIT_ACCEPT: 40, // '待验收'
  ACCEPT_SUCCESS: 50, // '验收成功'
  ACCEPT_FAIL: 51, // '验收失败'
  CANCELLED: 60 // '已取消'
}

// 数据状态
const listData = ref([])
const loading = ref(false)
const refreshing = ref(false)
const page = ref(1)
const pageSize = ref(10)
const noMore = ref(false)
const loadStatus = ref('loadmore')
const iconType = ref('flower')
let showCancelModal = ref(false);
let showConfirmOrder = ref(false);
let showDeleOrder = ref(false);
// 模拟数据生成函数
const generateMockData = (pageNum, count, targetStatus) => {
	console.log("数据状态",pageNum, count, targetStatus);
  const data = []
  const statuses = Object.values(ORDER_STATUS)
  const difficulties = ['难度低', '难度中', '难度高']
  const periods = ['工期30天', '工期60天', '工期90天', '工期360天']
  
  for (let i = 0; i < count; i++) {
    const id = (pageNum - 1) * count + i + 1
    // 如果指定了状态，就用指定状态；否则随机状态
    let status
    if (targetStatus !== null && targetStatus !== undefined) {
      if (Array.isArray(targetStatus)) {
        status = targetStatus[Math.floor(Math.random() * targetStatus.length)]
      } else {
        status = targetStatus
      }
    } else {
      status = statuses[Math.floor(Math.random() * statuses.length)]
    }

    data.push({
      id: `154654651${id}`, // 模拟长订单号
      status: status,
      image: 'https://cdn.uviewui.com/uview/album/1.jpg', 
      title: '古韵民族丝绸非遗刺绣',
      quota: 60,
      price: '60.09',
      riseRate: status === ORDER_STATUS.WAIT_PAY ? 0 : 80, // 只有部分状态有溢价显示? 暂时随机
      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
      period: periods[Math.floor(Math.random() * periods.length)],
    })
  }
  return data
}

// 获取数据
const fetchData = async (isRefresh = false) => {
  if (isRefresh) {
    page.value = 1
    noMore.value = false
	refreshing.value = true
    listData.value = []
  }

  if (noMore.value && !isRefresh) return

  loading.value = true
  loadStatus.value = 'loading'
  try {
    // 模拟网络请求延迟
    await new Promise((resolve) => setTimeout(resolve, 1800))

    const newData = generateMockData(page.value, pageSize.value, props.status)

    if (newData.length < pageSize.value) {
      noMore.value = true
	  loadStatus.value = 'nomore'
    }

    if (isRefresh) {
      listData.value = newData
	  if(!isRefresh)loadStatus.value = 'loadmore'
    } else {
      listData.value = [...listData.value, ...newData]
	  loadStatus.value = noMore.value ? 'loadmore' : 'nomore'
    }

    page.value++
  } catch (err) {
	  if(!isRefresh)loadStatus.value = 'loadmore'
    console.error('数据加载失败:', err)
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// 下拉刷新
const onRefresh = () => {
  refreshing.value = true
  fetchData(true)
}

// 上拉加载更多
const onScrollToLower = () => {
  if (!loading.value && !noMore.value) {
    fetchData()
  }
}
const confirmCancelOrder = ()=>{
	uni.showToast({ title: '订单已取消', icon: 'none' })
	// 实际开发中这里应该调用 API，然后刷新列表
	// 这里简单模拟刷新
	onRefresh()
};
// 确认收货
const confirmOrder = ()=>{
	
};
// 删除订单
const confirmDeleOrder = ()=>{
	
};
// 处理操作事件
const handleAction = ({ type, item }) => {
  console.log('Action:', type, item)
  switch (type) {
    case 'cancel':
	 showCancelModal.value = true;
     break
    case 'pay':
      uni.showToast({ title: '跳转支付页面', icon: 'none' })
      break
    case 'remind':
      uni.showToast({ title: '已提醒商家发货', icon: 'success' })
      break
    case 'logistics':
      uni.showToast({ title: '查看物流详情', icon: 'none' })
      break
    case 'confirm':
	showConfirmOrder.value = true;
      break
    case 'delete':
	showDeleOrder.value = true;
      break
	case 'detail':
	  uni.navigateTo({
		  url: `/pages/xn/orders/detail?id=${item.id}`
	  })
	  break
  }
}

// 监听 status 变化 (虽然目前是作为组件复用，通常不会动态变 status，但加上是个好习惯)
watch(() => props.status, () => {
  onRefresh()
})

onMounted(() => {
 fetchData();
});
</script>

<style lang="scss" scoped>
.order-list {
  height: 100%;
}
</style>
