<template>
	<view class="page-wrap orders">
		<view></view>
			<view class="page-content">
				<view class="order-search">
					<up-row customStyle="margin-bottom: 10px">
						  <up-col span="2">
							  <view class="order-text-wrap">
								  <text class="order-text">订单</text>
							  </view>
						  </up-col>
						  <up-col span="9">
							  <view class="search-bar">
								  <up-search
								    v-model="searchKey"
								    placeholder="输入搜索内容"
								    bgColor="#fff"
								    placeholderColor="#AC9394"
								    searchIconColor="#672227"
								    borderColor="#FFE185"
								    height="66rpx"
									  @search="onSearch"
								    :show-action="false"
								    clearabled
								  />
							  </view>
						  </up-col>
						  <up-col span="1">
							  <!-- <view class="bell-pic">
								  <u-icon
								    name="/static/images/orders/filter.png"
								    size="74rpx"
								  />
							  </view> -->
						  </up-col>
					  </up-row>
				</view>
				<view class="order-list">
					 <view class="order-container">
					     <BaseProductList
					     @onScrollToLower="onScrollToLower"
					     @onRefresh="onRefresh"
					     :isRefreshing="refreshing"
					     :loadStatus="loadStatus"
					     :iconType="iconType"
					     :enableRefresh="true"
					     :enableLoadMore="true"
					     class="scroll-view"
					     >
					     	<template #scrollContain>
					     		<!-- 商品列表 -->
					     		<template v-for="(item, index) in listData">
					     				<XnOrdersOrderCard :item="item" @grabOrderClick="handleGrab" @handleItemClick="jumDetail"></XnOrdersOrderCard>
					     		</template>
					     	</template>
					     </BaseProductList>
					   </view>
				</view>
			</view>
		<LayoutCustomBarXn></LayoutCustomBarXn>
	</view>
</template>

<script setup name="orders">
import { taskLists,addOrder } from '@/api/index.js'
const { proxy } = getCurrentInstance();
const safeTopValue = (proxy.$safeAreaInfo.top +24) +'rpx'
let title = ref("orders");
let searchKey = ref("");
const debounceSearch = useDebounce(() => {
  fetchData(true)
}, 1600)

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
let marginResultData = ref({})
let hasMore = true
let isLoading = false // 防止重复触发

// 获取数据
const fetchData = async (isRefresh = false) => {
  if (loading.value && !isRefresh) return
  if (refreshing.value && !isRefresh) return
  if (noMore.value && !isRefresh) return

  if (isRefresh) {
    page.value = 1
    noMore.value = false
	refreshing.value = true
    // listData.value = []
	loadStatus.value = 'loading'
  } else {
	  loading.value = true
	  loadStatus.value = 'loading'
  }

  try {
    const res = await taskLists({
		page_no: page.value,
		page_size: pageSize.value,
		keyword: searchKey.value
	});
	
	const newData = res.code === 200 ? (res.data.lists || []) : [];

    if (newData.length < pageSize.value) {
      noMore.value = true
	  loadStatus.value = 'nomore'
    } else {
		loadStatus.value = 'loadmore'
	}

    if (isRefresh) {
      listData.value = newData
	  uni.stopPullDownRefresh()
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
  if (refreshing.value) return
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
		url: `/pages-xn/collection-detail/index?id=${item.id}`
	})
}
const getDeposit = async (item)=>{
	if(!item.id){
		uni.showToast({ title: '订单ID不能为空', icon: 'none' })
		return;
	}
	
	const {code, msg ,data={}} = await addOrder({id: item.id});
	
	if(code == 200){
		uni.showToast({title: '订单创建成功', icon: 'success' })
		marginResultData.value = data.lists || {};
		marginResultData.value.id = item.id;
		
		setTimeout(() => {
			uni.navigateTo({
					url: `/pages-xn/my/deposit?id=${item.id}`,
					success: (res) => {
						res.eventChannel.emit('sendMarginDatas', { marginResultData: {...item, ...marginResultData.value} });
					},
					fail: (err) => {
						console.error('跳转失败', err);
					}
				})
		}, 1500)
	} else {
		uni.showToast({ title: msg || '订单创建失败', icon: 'none' })
		// setTimeout(() => {
		// 	uni.navigateBack()
		// }, 1500)
	};
}
// 抢单按钮点击事件
const handleGrab = (item, e) => {
	getDeposit(item);
}

// 页面加载时初始化数据
onMounted(() => {
  fetchData(true)
})



watch(searchKey, (newVal) => {
  // newVal&&debounceSearch()
  debounceSearch()
})

const onSearch = () => {
  debounceSearch()
}

onUnmounted(() => {
  if (debounceSearch && debounceSearch.cancel) {
      debounceSearch.cancel()
    }
})

onShow(()=>{
	// uni.hideTabBar();
});

function useDebounce(fn, delay = 1500) {
  let timer = null;

  const debounced = () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(fn, delay)
  };

  debounced.cancel = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  };

  return debounced;
}

</script>

<style>
:deep(.uni-scroll-view){
	padding-right: 18rpx;
}
.order-container {
  height: 85vh;
}

.scroll-view {
  height: 100%;
}

.order-text-wrap{
	color: #fff;
	font-size: 40rpx;
}


.bell-pic {
  display: flex;
  justify-content: center;
  align-items: center; 
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
.page-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.page-wrap{
	grid-template-rows: v-bind(safeTopValue) 1fr 120rpx;
}
</style>
