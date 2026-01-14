<template>
<scroll-view
   :scroll-y="true"
   @refresherrefresh="onRefresh"
   @scrolltolower="onScrollToLower"
   :enable-back-to-top="true"
   :refresher-enabled="true"
   :refresher-triggered="refreshing"
   :refresher-default-style="'black'"
   :refresher-background="'transparent'"
   :lower-threshold="100"
   class="scroll-view"
 >
   <!-- 商品列表 -->
   <view
	 v-for="(item, index) in listData"
	 :key="index"
	 class="order-card-item"
   @click="handleAction({type:'detail',item})"
   >
	   <view class="card-header">
		 <image :src="item.image" class="card-image" mode="aspectFill" />
		 <view class="card-content">
		   <view class="card-title">{{ item.name }}</view>
		   <view class="tags">
			 <CxTag
			   :text="item.period"
			   :bgGradient="['rgba(248,163,29,0.1)', 'rgba(248,163,29,0.1)']"
			 />&nbsp;
			 <CxTag
			   :text="item.difficulty"
			   :bgGradient="['rgba(248,163,29,0.1)', 'rgba(248,163,29,0.1)']"
			 />
		   </view>
		   <view class="bottom-row">
			 <view class="complete-time">
			   <up-icon
			   name="clock" 
			   color="#04427F" 
			   size="36rpx" 
			   /> &nbsp;<text>
				   {{ item.end_time }}
				</text>
			 </view>
			 <view class="can-grab">
            <!-- 待支付: 取消订单, 去支付 -->
          <template v-if="item.status === 10">
            <view class="function-btn">
              <CxComfirmBtn :btnStyle="cancelBtnStyle" @click.stop="handleAction({type:'pay',item})" text="去支付"></CxComfirmBtn>
            </view>
          </template>
          
          <!-- 待发货: 提醒发材料 -->
          <template v-else-if="item.status === 20">
            <view class="function-btn">
              <CxComfirmBtn 
              :btnStyle="cancelBtnStyle"
              @click.stop="handleAction({type:'remind',item})" text="提醒发货"></CxComfirmBtn>
            </view>
          </template>

          <!-- 待接材料: 查看物流 已收材料-->
          <template v-else-if="item.status === 30">
            <view class="function-btn">
              <CxComfirmBtn 
              :btnStyle="cancelBtnStyle"
              @click.stop="handleAction({type:'receivingMaterials',item})" text="已收材料"></CxComfirmBtn>
            </view>&nbsp;&nbsp;
          </template>

          <!-- 待发成品:  制作完成 -->
          <template v-else-if="item.status === 40">
            <view class="function-btn">
              <CxComfirmBtn :btnStyle="cancelBtnStyle" @click.stop="handleAction({type:'produced',item})" text="制作完成"></CxComfirmBtn>
            </view>
          </template>
			 </view>
		   </view>
		 </view>
	   </view>
     <view class="order-status">
        <text :style="{
          color: statusColor(item.status)
        }">{{statusText(item.status)}}</text>
     </view>
   </view>

      <!-- 加载中提示 -->
      <u-loading-icon
        v-if="loading && !refreshing"
        icon-size="30rpx"
        :show-text="true"
        text="加载中..."
        style="margin: 30rpx auto;"
        />

      <!-- 没有更多数据提示 -->
      <u-empty
        v-if="listData.length > 0 && !loading && noMore"
        mode="data"
        text="没有更多数据了"
        icon-size="30rpx"
        style="margin-top: 50rpx;"
        ></u-empty>

      <!-- 初始空状态 -->
      <u-empty
      v-if="listData.length === 0 && !loading && !refreshing"
        mode="data"
        text="暂无数据"
        icon-size="30rpx"
        style="margin-top: 100rpx;"
        ></u-empty>
 </scroll-view>

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
</template>


<script setup name="Completed">
import { orderLists,editOrderSatus } from '@/api/index.js'
let showProduced = ref(false);
let showConfirmOrder = ref(false);
let currentItem = {};
// 状态映射
const statusMap = {
  10: { text: '待支付', color: '#FF4D4F' },   // 红｜强提醒
  20: { text: '待发货', color: '#FA8C16' },   // 橙｜进行中
  30: { text: '待接受材料', color: '#1890FF' }, // 蓝｜处理中
  40: { text: '待发成品', color: '#FA541C' },   // 深橙｜关键节点
  50: { text: '待接收成品', color: '#13C2C2' }, // 青｜物流流转
  60: { text: '待验收', color: '#722ED1' },     // 紫｜待确认
  70: { text: '验收成功', color: '#52C41A' },   // 绿｜成功
  80: { text: '验收失败', color: '#A8071A' },   // 深红｜失败
  90: { text: '取消订单', color: '#8C8C8C' }    // 灰｜终止
};

const statusText = (status) => statusMap[status]?.text || '未知状态';

const statusColor = (status) => statusMap[status]?.color || '#333';
const cancelBtnStyle = {
  height:'60rpx'
};


// 模拟用户等级（用于判断是否可抢单）
const userLevel = ref(3) // 假设用户等级为3

// 数据状态
const listData = ref([])
const loading = ref(false)
const refreshing = ref(false)
const page = ref(1)
const pageSize = ref(10)
const noMore = ref(false)
const loadStatus = ref('loadmore')
const props = defineProps({
  status_list: {
    type: String,
    default: '10,20,30,40,50,60,80,90'
  }
})
// 模拟数据生成函数
const generateMockData = (pageNum, count) => {
  const data = []
  for (let i = 0; i < count; i++) {
    const id = (pageNum - 1) * count + i + 1
    data.push({
      id,
      image: 'https://cdn.uviewui.com/uview/album/1.jpg', // 可替换为你自己的图片
      title: '古韵民族丝绸非遗刺绣',
      quota: 60,
      riseRate: 80,
      canGrab: userLevel.value >= 2, // 模拟逻辑：等级>=2才能抢单
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
    const params = {
      page_no: page.value,
      page_size: pageSize.value
    };
    
    // 如果 status 存在且不是 'null'/'undefined' (代表全部)，则添加到参数中
    // 根据 order-management.vue，"全部"对应的 status 是 null
    if (props.status_list !== null && props.status_list !== undefined) {      
      params.status_list = props.status_list;
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
      console.log("列表数据",listData)
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

// 处理操作事件
const handleAction = ({ type, item }) => {
  currentItem = item;
  switch (type) {
    case 'pay': // 去支付
      uni.navigateTo({
        url: `/pages/xn/my/deposit?id=${item.id}&order_id=${item.order_id}`
      })
      uni.showToast({ title: '跳转支付页面', icon: 'none' })
      break
    case 'remind':
      uni.showToast({ title: '已提醒商家发货', icon: 'success' })
      window.location.href = 'https://www.baidu.com/s?wd=773394725450239'

      break
    case 'logistics':
      uni.navigateTo({
        url: 'https://www.baidu.com/s?wd=773394725450239',
        success: (res) => {
          res.eventChannel.emit('sendOrderDatas', { orderInfo: currentItem });
        }
      })
      uni.showToast({ title: '查看物流详情', icon: 'none' })
      break
    case 'receivingMaterials':
	    showConfirmOrder.value = true;
      break
    case 'produced':
	    showProduced.value = true;
      break
    case 'detail':
      uni.navigateTo({
        url: `/pages/xn/orders/detail`,
        success: (res) => {
          res.eventChannel.emit('sendOrderDatas', { orderInfo: currentItem });
        }

      })
      break
    }
}
// 页面加载时初始化数据
onMounted(() => {
  fetchData()
})		
	
</script>

<style lang="scss" scoped>
.order-status{
  position: absolute;
  top: 20rpx;
  right: 12rpx;
  opacity: .5;
  font-size: 18rpx;
}
.scroll-view {
  height: 100%;
}


.order-card-item{
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx 16rpx;
	margin-top: 30rpx;
	position: relative;
	&::before{
		display: block;
		content: ' ';
		position: absolute;
		left: 20rpx;
		height: 24rpx;
		width: 92%;
		top: -10rpx;
		background: url(@/static/images/common/card-top-1.png) repeat-x;
		background-size: 12rpx;
	}
	&::after{
		display: block;
		content: ' ';
		position: absolute;
		top: -1rpx;
		left: 25rpx;
		height: 24rpx;
		width: 92%;
		background: url(@/static/images/common/card-top-2.png) repeat-x;
		background-size: 12rpx;
		
	}
}
.card-header {
  display: flex;
  align-items: center;
}

.card-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}
.complete-time{
	display: flex;
}
.can-grab{
	width: 188rpx;
}
.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 160rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #13161F;
  margin-bottom: 10rpx;
}

.tags {
  display: flex;
  margin-bottom: 10rpx;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.lightning-icon{
	display: inline-block;
	position: relative;
	right: -15rpx;
	transform: scale(1.5);
	filter: brightness(0) invert(1);
	vertical-align: top;
}


.order-text-wrap{
	color: #fff;
	font-size: 40rpx;
}
</style>