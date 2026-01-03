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
						  <up-col span="8">
							  <view class="search-bar">
								  <up-search
								    v-model="searchKey"
								    placeholder="输入搜索内容"
								    bgColor="#fff"
								    placeholderColor="#AC9394"
								    searchIconColor="#672227"
								    borderColor="#FFE185"
								    height="46rpx"
									@search="onSearch"
								    :show-action="false"
								    clearabled
								  />
							  </view>
						  </up-col>
						  <up-col span="2">
							  <view class="bell-pic">
								  <u-icon
								    name="/static/images/orders/filter.png"
								    size="74rpx"
								  />
							  </view>
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
					     				<XnOrdersOrderCard :item="item" @grabOrderClick="handleGrab"></XnOrdersOrderCard>
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
let title = ref("orders");
let searchKey = ref("");
const debounceSearch = useDebounce(() => {
  fetchData(true)
}, 1200)

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
  uni.navigateTo({
  	url: `/pages/xn/my/deposit?id=${item.id}`
  })
  // uni.showToast({ title: '抢单成功！', icon: 'success' })
  // 可在此处调用接口更新状态
}

// 页面加载时初始化数据
onMounted(() => {
  if (listData.value.length === 0) {
    fetchData()
  }
})



watch(searchKey, (newVal) => {
  newVal&&debounceSearch()
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
	grid-template-rows: 0rpx 1fr 120rpx;
}
</style>
