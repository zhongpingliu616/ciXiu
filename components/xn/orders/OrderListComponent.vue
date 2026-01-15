<template>
  <BaseProductList
    @onScrollToLower="onScrollToLower"
    @onRefresh="onRefresh"
    :isRefreshing="refreshing"
    :loadStatus="loadStatus"
    :iconType="iconType"
    :enableRefresh="false"
    :enableLoadMore="true"
    class="order-list"
    >
    <template #scrollContain>
      <template v-for="(item, index) in listData" :key="item.id || index">
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
    content="确认收材料了吗？"
    @confirm="confirmOrder"
  />
  <CxModal
    v-model:show="showProduced"
    content="确认完成了吗？"
    @confirm="confirmProduced"
  >
      <view class="input-wrap">
        <view style="font-size:28rpx; color:#333; margin-bottom:10rpx;">请输入物流单号,切勿填错</view>
        <u-input
          v-model="logisticsNumber"
          placeholder="请输入你的物流单号"
          border="surround"
          clearable
          :customStyle="{
            height: '52rpx',
            borderRadius: '10rpx'
          }"
        ></u-input>
      </view>
  </CxModal>
  <CxModal
    v-model:show="showDeleOrder"
    content="确定要删除订单吗？"
    @confirm="confirmDeleOrder"
  />
</template>

<script setup name="OrderListComponent">
import { orderLists,editOrderSatus,orderDetails,orderRemind } from '@/api/index.js'
const props = defineProps({
  // 订单状态，如果为 null/undefined 则显示全部。可以是数字或数字数组
  status: {
    type: [Number, Array, null, undefined],
    default: null
  }
})


const localStatus = ref(props.status)

watch(
  () => props.status,
  val => localStatus.value = val
)

function setStatus(val) {
  localStatus.value = val
}


// 状态定义
const ORDER_STATUS = {
      WAIT_PAY: 10, // 待支付
      WAIT_SHIP: 20, // 待发货
      WAIT_RECEIVE_MATERIAL: 30, // 待接收材料
      WAIT_SHIP_PRODUCT: 40, // 待发成品
      DELIVERED: 50, // 待接收成品
      WAIT_ACCEPT: 60, // 待验收
      ACCEPT_SUCCESS: 70, // 验收成功
      ACCEPT_FAIL: 80, // 验收失败
      CANCELLED: 90 // 取消订单
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
let logisticsNumber = ref('');
let showCancelModal = ref(false);
let showProduced = ref(false);
let showConfirmOrder = ref(false);
let showDeleOrder = ref(false);
let currentItem ={};
let marginResultData = ref({});

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
    const params = {
      page_no: page.value,
      page_size: pageSize.value
    };
    
    // 如果 status 存在且不是 'null'/'undefined' (代表全部)，则添加到参数中
    // 根据 order-management.vue，"全部"对应的 status 是 null
    if (props.status != null && props.status != undefined) {      
      params.status = props.status;
    }

    const res = await orderLists(params);
    
    if (res.code === 200 || res.code === 0) {
      const newData = res.data.lists || []; // 假设返回结构是 data.lists
      if (newData.length < pageSize.value) {

        noMore.value = true
        loadStatus.value = 'nomore'
      }

      if (isRefresh) {
        listData.value = newData
        if(!isRefresh) loadStatus.value = 'loadmore'
      } else {
        listData.value = [...listData.value, ...newData]
        loadStatus.value = noMore.value ? 'loadmore' : 'nomore'
      }

      page.value++
    } else {
      console.error('获取订单列表失败:', res.msg);
      // uni.showToast({ title: res.msg || '获取失败', icon: 'none' });
    }
  } catch (err) {
    if(!isRefresh) loadStatus.value = 'loadmore'
    console.error('数据加载失败:', err)
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

onActivated(() => {
  alert(localStatus.value)
 //  console.log('组件被激活（从 keep-alive 缓存中恢复）')
})

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
const confirmCancelOrder = async ()=>{ // 状态改为 90
	const {msg,data,code} = await editOrderSatus({
    id:currentItem.id,
    order_id:currentItem.order_id,
    status:90
  });
  if(code===200){
    uni.showToast({ title: '订单已取消', icon: 'none' });
    onRefresh();
  } else {
    uni.showToast({ title: msg || '操作失败', icon: 'none' });
  }
};
// 确认收到材料
const confirmOrder = async ()=>{
	const {msg,data,code} = await editOrderSatus({
    id:currentItem.id,
    order_id:currentItem.order_id,
    status:40
  });
  if(code===200){
    uni.showToast({ title: '已确认收到材料', icon: 'none' });
    onRefresh();
  } else {
    uni.showToast({ title: msg || '操作失败', icon: 'none' });
  }
};
// 确认完成作品
const confirmProduced = async ()=>{
  if(!logisticsNumber.value){
    uni.showToast({ title: '请输入物流单号', icon: 'none' });
    return;
  };
  const {msg,data,code}  = await editOrderSatus({
    id:currentItem.id,
    order_id:currentItem.order_id,
    status:50,
    finish_order_number:logisticsNumber.value
  });
  
  if(code===200){
    uni.showToast({ title: '订单已完成', icon: 'none' });
    logisticsNumber.value = '';
    onRefresh();
  } else {
    uni.showToast({ title: msg || '操作失败', icon: 'none' });
  }
};
// 提醒商家发货
const remindOrder = async (item)=>{
	const {msg,data,code} = await orderRemind({
    order_id:item.order_id
  });
  if(code===200){
    uni.showToast({ title: '已提醒商家发货', icon: 'none' });
    // onRefresh();
  } else {
    uni.showToast({ title: msg || '操作失败', icon: 'none' });
  }
};
// 删除订单
const confirmDeleOrder = ()=>{
	
};
// 获取订单详情向压金页面传递压金数据
const getOrderDetails = async (item)=>{
	if(!item.id){
		uni.showToast({ title: '订单ID不能为空', icon: 'none' })
		return;
	}
	const {code, msg ,data={}} = await orderDetails({order_id:item.order_id});
	
	if(code == 200){
		marginResultData.value = data.lists || {};
		marginResultData.value.id = item.id;
		uni.navigateTo({
        url: `/pages/xn/my/deposit?id=${item.id}&order_id=${item.order_id}`,
        success: (res) => {
          res.eventChannel.emit('sendMarginDatas', { marginResultData: marginResultData.value });
        },
        fail: (err) => {
          console.error('跳转失败', err);
        }
      })
	} else {
		uni.showToast({ title: msg || '订单详情获取失败', icon: 'none' })
		// setTimeout(() => {
		// 	uni.navigateBack()
		// }, 1500)
	};
}
// 处理操作事件
const handleAction = ({ type, item }) => {
  currentItem = item;
  switch (type) {
    case 'cancel': // 取消订单
	    showCancelModal.value = true;
     break
    case 'pay': // 去支付
      getOrderDetails(item);
      
      // uni.showToast({ title: '跳转支付页面', icon: 'none' })
      break
    case 'remind': // 提醒商家发货
      remindOrder(item);
      break
    case 'logistics': // 查看物流详情
      uni.navigateTo({
        url: 'https://www.baidu.com/s?wd=773394725450239',
        success: (res) => {
          res.eventChannel.emit('sendOrderDatas', { orderInfo: currentItem });
        }
      })
      uni.showToast({ title: '查看物流详情', icon: 'none' })
      break
    case 'receivingMaterials': // 确认收到材料
	    showConfirmOrder.value = true;
      break
    case 'delete': // 删除订单
	    showDeleOrder.value = true;
      break
    case 'produced': // 确认完成作品
	    showProduced.value = true;
      break
    case 'detail': // 查看订单详情
      uni.navigateTo({
        url: `/pages/xn/orders/detail`,
        success: (res) => {
          res.eventChannel.emit('sendOrderDatas', { orderInfo: currentItem });
        }

      })
      break
    }
}

onMounted(() => {
 fetchData(true);
});


defineExpose({ setStatus })
</script>

<style lang="scss" scoped>
.order-list {
  height: 100%;
}
</style>
