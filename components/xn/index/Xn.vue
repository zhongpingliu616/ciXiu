<template>
<view class="collection-list">
<view class="collection-content">
  <CxScrollView
	class="list"
	ref="cxScrollViewRef"
	:list="collectionList"
	:config="{
	  direction: 'x',
	  visibleCount: 2,
	  gap:'10rpx'
	}"
	@click="collectionItemClick"
  > 
	 <template #item="{item}">
		 <view class="manage-shortcut-entrance">
			   <image class="shortcut-entrance-img" mode="widthFix" :src="item.src"></image>
			   <view class="manage-shortcut-content">
				   <view class="manage-shortcut-title">
					   {{item.title}}
				   </view>
				   <view class="manage-shortcut-links">
					   <up-button
					     shape="circle"
					     color="#1F5994"
						 :customStyle="{
							 width: 'auto',
							 display:'inline-block',
							 padding:'12rpx 22rpx',
							 fontSize: '24rpx',
							 height:'auto'
						}"
						 @tap="handleManage(item)"
					   >
					   <text>{{item.funtionText}} 
							<up-icon name="arrow-right" size="24rpx" color="#A0BAD2" class="shortcut-icon"></up-icon>
					   </text>
					   </up-button>
				   </view>
			   </view>
		 </view>
	</template>
  </CxScrollView>
</view>
</view>
<view class="order-list-wrap">
	<CommonTitleList
		  title="订单列表"
		>
		<template #more>
			<view class="bell-pic" @tap="naviToOrder">
			  <u-icon
				name="/static/images/orders/filter.png"
				size="42rpx"
			  />
			</view>
		</template>
	  <view class="index-order-list">
		  <BaseProductList
		  @onScrollToLower="onScrollToLower"
		  @onRefresh="onRefresh"
		  :isRefreshing="refreshing"
		  :loadStatus="loadStatus"
		  :iconType="iconType"
		  :enableRefresh="false"
		  :enableLoadMore="true"
		  >
		  	<template #scrollContain>
		  		<!-- 商品列表 -->
		  		<template v-for="(item, index) in listData">
		  				<XnOrdersOrderCard :item="item" @grabOrderClick="handleGrab" @handleItemClick="jumDetail"></XnOrdersOrderCard>
		  		</template>
		  	</template>
		  </BaseProductList>
	  </view>
	</CommonTitleList>
</view>
</template>

<script setup name="IndexXn">	
import { taskLists } from '@/api/index.js'
let cxScrollViewRef = ref();
const collectionList = [
		{ src: '/static/images/index/order-management.png',title:'订单管理',funtionText: '管理',path:'/pages/xn/orders/order-management' },
		{ src: '/static/images/index/work-management.png',title:'作品管理',funtionText: '管理',path:'/pages/xn/my/work-management' },
		{ src: '/static/images/index/order-management.png',title:'订单管理',funtionText: '管理' },
		{ src: '/static/images/index/work-management.png',title:'作品管理',funtionText: '管理' }
	];
const emit = defineEmits(['showSearch']);

// 模拟用户等级（用于判断是否可抢单）
const userLevel = ref(3) // 假设用户等级为3

// 数据状态
const listData = ref([])
const loading = ref(false)
const refreshing = ref(false)
const page = ref(1)
const pageSize = ref(10)
const noMore = ref(false)
const loadStatus = ref('loadmore') // 'loadmore', 'loading', 'nomore'
const iconType = ref('flower')
let hasMore = true
let isLoading = false // 防止重复触发

// 获取数据
const fetchData = async (isRefresh = false) => {
  // 如果正在加载更多且不是刷新，则直接返回
  if (loading.value && !isRefresh) return
  // 如果正在刷新且不是刷新操作（比如重复触发），则返回
  if (refreshing.value && !isRefresh) return
  // 如果没有更多数据且不是刷新，则返回
  if (noMore.value && !isRefresh) return

  if (isRefresh) {
    page.value = 1
    noMore.value = false
	refreshing.value = true
    // listData.value = [] // 刷新时不立即清空，防止闪烁
	loadStatus.value = 'loading'
  } else {
	  loading.value = true
	  loadStatus.value = 'loading'
  }

  try {
    const res = await taskLists({
		page_no: page.value,
		page_size: pageSize.value
	});
	
	const newData = res.code === 200 ? (res.data.lists || []) : [];

    if (newData.length < pageSize.value) {
      noMore.value = true
	  loadStatus.value = 'nomore'
    } else {
		// 还有更多数据
		loadStatus.value = 'loadmore'
	}

    if (isRefresh) {
      listData.value = newData
	  uni.stopPullDownRefresh(); // 停止系统下拉刷新（如果有）
    } else {
      listData.value = [...listData.value, ...newData]
    }

    page.value++
  } catch (err) {
	loadStatus.value = 'loadmore'
    console.error('数据加载失败:', err)
	uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// 下拉刷新
const onRefresh = () => {
  if (refreshing.value) return // 防止重复刷新
  fetchData(true)
}

// 上拉加载更多
const onScrollToLower = () => {
  if (!loading.value && !noMore.value) {
    fetchData()
  }
}

// 订单详情跳转
const jumDetail = (item) => {
	uni.navigateTo({
		url: `/pages/xn/collection-detail/index?id=${item.id}`
	})
}
// 抢单按钮点击事件
const handleGrab = (item) => {
	console.log(item)
  if (!item.canGrab && false) { // 暂时注释掉等级判断，等待接口字段确认
    uni.showToast({ title: '等级不足，无法抢单', icon: 'none' })
    return
  };
  uni.navigateTo({
  	url: `/pages/xn/my/deposit?id=${item.id}`
  })
}

// 页面加载时初始化数据
onMounted(() => {
  fetchData()
})
	
	
	
	
	
	
	
const naviToOrder= () =>{
	emit('showSearch');
	// uni.navigateTo({
	// 	url:'/pages/orders/index'
	// })
};
const handleManage = (item)=>{
	console.warn("跳转地址",item.path);
	uni.navigateTo({
		url:item.path
	})
};
// const currentWork = computed(()=>{
// 	const comRole = componentMap[workLabel.value[currentWorkIndex.value].rolse];
// 	return  comRole
// })
const collectionItemClick = ({index,item})=>{
	console.log("藏品列表点击",index, item);
};
</script>

<style lang="scss" scoped>
.index-order-list{
	// height: 40vh;
}
::v-deep{
	.index-order-list .uni-scroll-view{
		padding-right: 18rpx;
	}
	.header{
		margin-bottom: 0;
	}
}

.order-list-wrap{
	margin-top: 48rpx;
}
.bell-pic {
  display: flex;
  justify-content: center;
  align-items: center; 
}

.portfolio{
	margin-top: 40rpx;
}
.collection-list{
	margin-top: 40rpx;
}
::v-deep{
	.cx-scroll-item:nth-child(3n + 1){
		.collection-item{
			border-top-left-radius: 20rpx;
			border-bottom-left-radius: 20rpx;
		}
		
	}
	
	.cx-scroll-item:nth-child(3n){
		.collection-item{
			border-top-right-radius: 20rpx;
			border-bottom-right-radius: 20rpx;
		}
	}	
}
.shortcut-icon{
	display: inline-block;
}
.shortcut-entrance-img{
	width: 100%;
	display: inline-block;
}
.manage-shortcut-entrance{
	position: relative;
}
.manage-shortcut-title{
	color: #fff;
	font-size: 30rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
	text-indent: 12rpx;
}
.manage-shortcut-content{
	position: absolute;
	inset: 30rpx;
}




.collection-item{
	border: 4rpx solid $app-active-text;
	box-sizing: border-box;
	overflow: hidden;
	background-color: #f5f5f5;
	font-size: 0;
}
.collection-item-img{
	width: 100%;
	display: inline-block;
	
}
</style>