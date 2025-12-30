<template>
 <view class="index-nft">				 
	 <CxScrollView
		class="list"
	   ref="cxScrollViewRef"
	   :list="nftList"
	   :config="{
		 direction: 'x',
		 visibleCount: 4
	   }"
	 > 
		 <template #item="{item}">
			 <view class="item-content" @tap="announcementDetail(item)">
				   <image class="nft-img" mode="aspectFill" :src="item.src"></image>
				   <view class="nft-des up-text-ellipsis">
						{{ item.text }}
				   </view>
			 </view>
		</template>
	 </CxScrollView>
 </view>
<view class="recommend-product">
	   <CommonTitleList
		 title="推荐商品"
		 moreUrl="/pages/my/login"
	   >
		 <view class="recommend-content">
			<BaseProductList
			@onScrollToLower="scrollToLower"
			@onRefresh="refreshList"
			:isRefreshing="isRefreshing"
			:loadStatus="loadStatus"
			:iconType="iconType"
			:enableRefresh="true"
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
	   </CommonTitleList>
</view>	
</template>

<script setup name="IndexGz">
const {proxy} = getCurrentInstance()
const isRefreshing = ref(false) // 下拉刷新状态
const productList = ref([])
const loadStatus = ref('loadmore') // 'loadmore', 'loading', 'nomore'
const iconType = ref('flower')
let page = 1
const pageSize = 10
let hasMore = true
let isLoading = false // 防止重复触发
const nftList = [
	{ src: '/static/images/index/swiper-1.png', text: '我的藏品' },
	{ src: '/static/images/index/swiper-2.png', text: 'NFT' },
	{ src: '/static/images/index/swiper-3.png', text: 'RWA' },
	{ src: '/static/images/index/swiper-2.png', text: '社区' },
	{ src: '/static/images/index/swiper-1.png', text: '您的第二期收益已到账”“NFT藏品XXX价格上涨10%2' },
	{ src: '/static/images/index/swiper-3.png', text: '您的第三期收益已到账”“NFT藏品XXX价格上涨10%3 您的第二期收益已到账”“NFT藏品XXX价格上涨10%' },
	{ src: '/static/images/index/swiper-1.png', text: '您的第四期收益已到账”“NFT藏品XXX价格上涨10%4' }
];
const emit = defineEmits(['itemClick']);
const announcementDetail = (item)=>{
	proxy.$u.toast(`${item.text}`)
	uni.navigateTo({
		url:`/pages/my/login?announcementIndex=${item.text}&name=uniapp`
	})
};
// 初始化数据
const fetchData = async (isRefresh) => {
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
}
const handleProductItem = ({index,item})=>{
		uni.navigateTo({
			url:`/pages/my/login?title=${item.title}&index=${index}`
		})
	};
const fetchProductList = async (page, pageSize) => {
	  await new Promise(resolve => setTimeout(resolve, 800))
	
	  const mockData = Array.from({ length: pageSize }, (_, i) => ({
		id: (page - 1) * pageSize + i + 1,
		image: `https://picsum.photos/seed/${Math.random()}/120/80`,
		artist: '李柳柳',
		title: '东方美学 | 绣春花',
		price: 666.66
	  }))
	
	  const hasMore = page < 3 // 模拟第3页后无更多
	
	  return {
		list: mockData,
		hasMore
	  }
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
.recommend-product{
	margin-top: 24rpx;
}
.list {
  display: flex;
  flex-direction: row;
}
.nft-img{
	width: 100rpx; 
	height: 100rpx;
	border-radius: 20rpx;
}
.item {
  flex-shrink: 0;
  width: 25%;
  height: 180rpx;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  padding:0 12rpx;
  box-sizing: border-box;
}
.item-content{
	width: 100%;
	text-align: center;
}
.up-text-ellipsis {
     overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
}
.nft-des{
	color:$app-active-text;
	font-size: 24rpx;
}
.arrow-icon{
	display: flex;
	justify-content: flex-end;
}
.index-nft{
	margin: 40rpx 0;
}
</style>