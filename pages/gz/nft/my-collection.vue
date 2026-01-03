<template>
	<view class="page-wrap nft-collections">
		<LayoutNavigation :title="title" />
		
		<view class="page-content">
			<view class="tabs-wrapper">
				<CxTabs
				 :tabItems="tabs"
				 lineHeight="60rpx"
				 lineWidth="140rpx"
				 :lineBg="lineBg"
				 :itemStyle="{
					 height: '66rpx'
				 }"
				 :activeStyle="{
					 color:'rgba(255, 255, 255, 1)'
				 }"
				 v-model="currentTabIndex"
				 @click="handleTabChange"
				 />
			</view>
			
			<view class="list-container">
				<BaseProductList
				@onScrollToLower="scrollToLower"
				@onRefresh="refreshList"
				:isRefreshing="isRefreshing"
				:loadStatus="loadStatus"
				:iconType="iconType"
				:enableRefresh="true"
				class="scroll-view"
				>
					<template #scrollContain>
						<CommonProductCol
						:colNum="2"
						:productList="productList"
						@click="handleProductItem"
						></CommonProductCol>
					</template>
				</BaseProductList>
			</view>
		</view>
	 <view></view>
	</view>
</template>

<script setup name="nft-collections">
import { ref, onMounted } from 'vue';

let title = ref("NFT藏品");	
const lineBg = ref("data:image/png;base64,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");

const tabs = ref([
	{ name: '热门', value: 'hot' },
	{ name: '推荐', value: 'recommend' },
	{ name: '关注', value: 'follow' },
	{ name: '价格', value: 'price' }
]);
const currentTabIndex = ref(0);

const isRefreshing = ref(false);
const productList = ref([]);
const loadStatus = ref('loadmore');
const iconType = ref('flower');
let page = 1;
const pageSize = 10;
let hasMore = true;
let isLoading = false;

const fetchData = async (isRefresh = false) => {
	if(isRefresh){
		if (isLoading) return
		isRefreshing.value = true
		page = 1
		hasMore = true
	};
  if (!hasMore || isLoading) return

  isLoading = true
  loadStatus.value = 'loading'
  try {
    const res = await fetchProductList(page, pageSize)
    if (res && Array.isArray(res.list)) {
      productList.value = isRefresh?res.list:[...productList.value, ...res.list]
      page++
      hasMore = res.hasMore ?? false
      loadStatus.value = hasMore ? 'loadmore' : 'nomore'
    } else {
		if(isRefresh)productList.value = []
      loadStatus.value = 'nomore'
    }
  } catch (err) {
    if(!isRefresh)loadStatus.value = 'loadmore'
    console.error('加载失败:', err)
  } finally {
    isLoading = false
	isRefreshing.value = false
  }
};

const fetchProductList = async (page, pageSize) => {
	  await new Promise(resolve => setTimeout(resolve, 800));
	
	  const mockData = Array.from({ length: pageSize }, (_, i) => ({
		id: (page - 1) * pageSize + i + 1,
		image: `https://picsum.photos/seed/${Math.random()}/120/80`,
		artist: '李柳柳',
		title: '东方美学 | 绣春花',
		price: 666.66
	  }));
	
	  const hasMore = page < 3 
	
	  return {
		list: mockData,
		hasMore
	  };
};

const handleTabChange = (item) => {
	// 切换 tab 时重置列表
	fetchData(true);
};

const handleProductItem = ({index,item})=>{
	uni.navigateTo({
		url:`/pages/my/login?title=${item.title}&index=${index}`
	})
};

const refreshList = ()=>{
	fetchData(true)
};

const scrollToLower = ()=>{
	if (!hasMore || isLoading) return
	fetchData()
};

onMounted(() => {
	fetchData(true)
})
</script>

<style lang="scss" scoped>
.page-wrap{
	background: 
	url("/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr 0rpx;
}

.page-content {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.tabs-wrapper {
	margin-top: 20rpx;
	margin-bottom: 20rpx;
}

.list-container {
	flex: 1;
	overflow: hidden;
}

.scroll-view {
	height: 100%;
}
</style>