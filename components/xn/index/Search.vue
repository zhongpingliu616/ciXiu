<template>
	<view class="search-wrap search">
		<view class="search-bar-wrap">
			<up-row customStyle="margin-bottom: 10px">
				  <up-col span="10">
					  <view class="search-bar">
						  <up-search
							 ref="searchInputRef"
							  v-model="searchKey"
							  placeholder="输入想要的内容"
							  bgColor="#fff" 
							  placeholderColor="#AC9394" 
							  searchIconColor="#672227"
							  borderColor="#fff"
							  @search="onSearch"
							  @custom="onSearch"
							  @action="onSearch"
							  :focus="autoFocus"
							  height="46rpx"
							  showAction
							  clearable
							  action-text="搜索"
							  :action-style="{
								  backgroundColor: '#FF6B00', 
								  color: '#fff', 
								  borderRadius: '30rpx', 
								  padding: '10rpx 20rpx' }" 
							/>
					  </view>
				  </up-col>
				  <up-col span="2">
					  <view class="bell-pic">
						  <text class="cancel-text" @click="onCancel">取消</text>
					  </view>
				  </up-col>
			</up-row>
		</view>
		<view class="history-search-container" v-if="historyList.length">
		<!-- 标题栏 -->
		<view class="header">
		  <text class="title">历史搜索</text>
		  <u-icon name="trash" size="20" color="rgba(225, 210, 211, 1)" @tap="clearHistory"></u-icon>
		</view>
	
		<!-- 搜索词标签容器 -->
		<view class="tags-container">
		  <u-tag
		    v-for="(item, index) in historyList"
		    :key="index"
		    :text="item"
		    shape="circle"
			borderColor="rgba(245, 234, 201, .6)"
			color="#F5EAC9"
		    plain
		    :style="{
		      margin: '8rpx',
		      padding: '1rpx 4rpx'
		    }"
		    @click="onTagClick(item)"
		  />
		</view>
	  </view>
	  <view class="search-result">
		  <text class="search-result-text">共个{{listData.length}}搜索结果</text>
		  <BaseProductList
		  @onScrollToLower="onScrollToLower"
		  @onRefresh="onRefresh"
		  :isRefreshing="refreshing"
		  :loadStatus="loadStatus"
		  :iconType="iconType"
		  :enableRefresh="false"
		  :enableLoadMore="false"
		  >
			<template #scrollContain>
				<!-- 商品列表 -->
				<template v-for="(item, index) in listData">
						<XnOrdersOrderCard :item="item" @grabOrderClick="handleGrab"></XnOrdersOrderCard>
				</template>
			</template>
		  </BaseProductList>
	  </view>
	 <!-- <view></view> -->
	</view>
	<!-- 清空历史确认弹窗 -->
	<CxModal
	  v-model:show="showClearModal"
	  content="确定要清空历史搜索吗？"
	  @confirm="confirmClear"
	/>
</template>


<script setup name="Search">
let searchKey = ref("");
const emit = defineEmits(['close']);
let searchInputRef = ref(null);
let autoFocus = ref(false);
let HISTORY_KEY = 'SEARCH_HISTORY_LIST';
const maxHistory = ref(10);
let showClearModal = ref(false);
const historyList = ref([
  '非遗刺绣',
  '非遗刺绣',
  '非遗刺绣非遗刺绣',
  '非遗刺绣',
  '非遗刺绣非遗刺绣'
]);


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







const confirmClear = () => {
  historyList.value = []
  uni.removeStorageSync('SEARCH_HISTORY_LIST')
  showClearModal.value = false

  uni.showToast({
    title: '已清空',
    icon: 'success'
  })
};
const clearHistory = () => {
	showClearModal.value = true;
};

// 点击标签
const onTagClick = (keyword) => {
  console.log('点击了搜索词：', keyword)
  searchKey.value = keyword;
  saveHistory(keyword)
  
};
const onCancel = ()=>{
	emit('close');
};
const onSearch = (value)=> {
	const keyword = searchKey.value || value;
	if (!keyword) return
	console.log("搜索关键字",searchKey.value);
	saveHistory(keyword)
};
const loadHistory = () => {
    const list = uni.getStorageSync('SEARCH_HISTORY_LIST')
    historyList.value = Array.isArray(list) ? list : []
  };
const saveHistory = (keyword) => {
  if (!keyword) return

  let list = uni.getStorageSync('SEARCH_HISTORY_LIST') || []

  // 去重
  list = list.filter(item => item !== keyword)

  // 放到最前
  list.unshift(keyword)

  // 限制数量
  if (list.length > maxHistory.value) {
    list = list.slice(0, maxHistory.value)
  }

  // 存入本地
  uni.setStorageSync('SEARCH_HISTORY_LIST', list)

  // 更新页面
  historyList.value = list
};

onMounted(() => {
 loadHistory();
 // fetchData();
   nextTick(() => {
      autoFocus.value = true
    })
});
</script>

<style lang="scss" scoped>
:deep(.u-tag--medium){
	line-height: 6rpx;
}
.search-result-text{
	color: rgba(255, 255, 255, .8);
}
.search-result{
	flex: 1;
	overflow: hidden;
}
.modal-btn{
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10rpx;
}
.history-search-container {
	flex-shrink: 0; 
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
	font-size: 30rpx;
  }
.title {
      font-size: 36rpx;
      color: #fff;
      font-weight: bold;
    }
  .tags-container {
	  display: flex;
	  flex-wrap: wrap;
	  align-items: center;
	  overflow-wrap: break-word;
  }
}
	
	
	
	
	
	
.u-search{
		background: #fff;
		padding: 0 10rpx;
		border-radius: 40rpx;
		border: 2rpx solid #FFE185; 
	}
.search-bar{
	
}
.search-bar-wrap{
	flex-shrink: 0; 
}
.bell-pic {
  display: flex;
  justify-content: center;
  align-items: center; 
  color: #fff;
  font-size: 28rpx;
}
.search-wrap{
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: 
	url("@/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr auto;
	padding: 20rpx;
	box-sizing: border-box;
}		
	
</style>