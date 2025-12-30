<template>
<view class="collection-list">
	<!-- <CommonTitleList
	  title="藏品列表"
	  moreUrl="/pages/collection/list"
	>
	  <view class="collection-content">
		  <CxScrollView
			class="list"
			ref="cxScrollViewRef"
			:list="collectionList"
			:config="{
			  direction: 'x',
			  visibleCount: 3,
			  gap:'10rpx'
			}"
			@click="collectionItemClick"
		  > 
			 <template #item="{item}">
				 <view class="collection-item">
					   <image class="collection-item-img" mode="widthFix" :src="item.src"></image>
				 </view>
			</template>
		  </CxScrollView>
	  </view>
	</CommonTitleList> -->
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
		  :enableRefresh="true"
		  :enableLoadMore="true"
		  >
		  	<template #scrollContain>
		  		<!-- 商品列表 -->
		  		<template v-for="(item, index) in listData">
		  				<OrdersOrderCard :item="item" @grabOrderClick="handleGrab"></OrdersOrderCard>
		  		</template>
		  	</template>
		  </BaseProductList>
	  </view>
	</CommonTitleList>
</view>
<!-- <view class="portfolio">
	<CxTabs
	 :tabItems="workLabel"
	 :scrollable="true"
	 lineHeight="4"
	 lineWidth="28"
	 lineColor="rgba(244, 229, 188, 1)"
	 :activeStyle="{
		 color:'rgba(255, 255, 255, 1)'
	 }"
	 v-model="currentWorkIndex"
	 />
</view>
<view class="portfolio-list">
	<keep-alive>
	  <component :is="currentWork" />
	</keep-alive>
</view> -->
</template>

<script setup name="IndexXn">
// import WorkAllXn from '../../components/index/WorkAllXn.vue'
// import workMiaoXn from '../../components/index/workMiaoXn.vue'
// import workDongXn from '../../components/index/workDongXn.vue'
// import workCustomXn from '../../components/index/workCustomXn.vue'
// const componentMap = {
//   WorkAllXn,
//   workMiaoXn,
//   workDongXn,
//   workCustomXn
// };
let cxScrollViewRef = ref();
// let currentWorkIndex = ref(0);
// let workLabel = ref([
// 				{ name: '全部',rolse: "WorkAllXn" },
// 				{ name: '苗绣',rolse: "workMiaoXn" },
// 				{ name: '侗绣',rolse: "workDongXn" },
// 				{ name: '定制款',rolse: "workCustomXn" }
// 			]);
const collectionList = [
		{ src: '/static/images/index/order-management.png',title:'订单管理',funtionText: '管理',path:'/pages/orders/index' },
		{ src: '/static/images/index/work-management.png',title:'作品管理',funtionText: '管理',path:'/pages/my/work-management' },
		{ src: '/static/images/index/order-management.png',title:'订单管理',funtionText: '管理' },
		{ src: '/static/images/index/work-management.png',title:'作品管理',funtionText: '管理' }
	];


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
    // 模拟网络请求延迟
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newData = generateMockData(page.value, pageSize.value)

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

// 抢单按钮点击事件
const handleGrab = (item) => {
	console.log(item)
  if (!item.canGrab) {
    uni.showToast({ title: '等级不足，无法抢单', icon: 'none' })
    return
  }
  uni.showToast({ title: '抢单成功！', icon: 'success' })
  // 可在此处调用接口更新状态
}

// 页面加载时初始化数据
onMounted(() => {
  fetchData()
})
	
	
	
	
	
	
const naviToOrder= () =>{
	uni.navigateTo({
		url:'/pages/orders/index'
	})
};
const handleManage = (item)=>{
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
	height: 40vh;
}
:deep(.header){
	margin-bottom: 0;
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