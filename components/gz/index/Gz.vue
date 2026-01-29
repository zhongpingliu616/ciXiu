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
 <!-- <view class="collection-content">
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
 			   </view>
 		 </view>
 	</template>
   </CxScrollView>
 </view> -->
 <view class="activity-bulletin-board">
	 <view class="board-content">
		 <view class="board-info">
			 <text class="board-title">双十二 · 线下展会</text>
			 <text class="board-desc">国际会展中心展出巨量藏品，快来一起看看</text>
		 </view>
		 <view class="board-btn">
			 <navigator class="btn" url="/pages/gz/offline-exhibition" open-type="navigate">
				 <text class="btn-text">立即报名</text>
			 </navigator>
		 </view>
	 </view>
 </view>

<view class="recommend-product">
	   <CommonTitleList
		 title="推荐藏品"
		 moreUrl="/pages/my/login"
	   >
		 <view class="recommend-content">
			<BaseProductList
			@onScrollToLower="scrollToLower"
			@onRefresh="refreshList"
			:isRefreshing="isRefreshing"
			:loadStatus="loadStatus"
			:iconType="iconType"
			:enableRefresh="false"
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
	{ src: '/static/images/gz/index/my-clt.png', text: '我的藏品',path:'/pages/gz/nft/nft-collections' },
	{ src: '/static/images/gz/index/my-collection.png', text: 'NFT',path:'/pages/gz/nft/index' },
	{ src: '/static/images/gz/index/nft-logo.png', text: 'RWA',path:'/pages/gz/rwa/index' },
	{ src: '/static/images/gz/index/rwa-logo.png', text: '社区',path:'/pages/gz/community/index' },
	{ src: '/static/images/index/swiper-1.png', text: '您的第二期收益已到账”“NFT藏品XXX价格上涨10%2' },
	{ src: '/static/images/index/swiper-3.png', text: '您的第三期收益已到账”“NFT藏品XXX价格上涨10%3 您的第二期收益已到账”“NFT藏品XXX价格上涨10%' },
	{ src: '/static/images/index/swiper-1.png', text: '您的第四期收益已到账”“NFT藏品XXX价格上涨10%4' }
];
const collectionList = [
		{ src: '/static/images/index/community.png',title:'社区',funtionText: '管理',path:'/pages/gz/community/index' },
		{ src: '/static/images/index/activities.png',title:'活动',funtionText: '管理',path:'/pages/my/work-management' },
		{ src: '/static/images/index/community.png',title:'订单管理',funtionText: '管理',path:'/pages/orders/index' },
		{ src: '/static/images/index/activities.png',title:'作品管理',funtionText: '管理',path:'/pages/my/work-management' }
	];
const emit = defineEmits(['itemClick','showSearch']);

const collectionItemClick = ({index,item})=>{
	console.log("活动 社区",index, item);
	uni.navigateTo({
		url:item.path
	})
};
const announcementDetail = (item)=>{
	proxy.$u.toast(`${item.text}`)
	uni.navigateTo({
		url:item.path
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
const handleProductItem = (item)=>{
		uni.navigateTo({
			url:`/pages/my/login?title=${item.title}&index=${item.orderIndex}`
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
.activity-bulletin-board {
	margin-top: 30rpx;
	width: 100%;
	height: 160rpx;
	background: linear-gradient(90deg, #1A1A1A 0%, #333333 100%);
	border-radius: 20rpx;
	padding: 2rpx;
	position: relative;
	overflow: hidden;
}

.activity-bulletin-board::before {
	content: '';
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	border-radius: 20rpx;
	padding: 2rpx;
	background: linear-gradient(90deg, #D4AF37, #F5EAC9);
	-webkit-mask: 
		linear-gradient(#fff 0 0) content-box, 
		linear-gradient(#fff 0 0);
	-webkit-mask-composite: xor;
	mask-composite: exclude;
	pointer-events: none;
}

.board-content {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 40rpx;
	box-sizing: border-box;
	background: #2A2A2A;
	border-radius: 18rpx;
	position: relative;
}

/* 装饰背景 */
.board-content::after {
	content: '';
	position: absolute;
	right: 140rpx;
	top: 0;
	bottom: 0;
	width: 100rpx;
	background: linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.02) 100%);
	transform: skewX(-20deg);
}

.board-info {
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	z-index: 1;
}

.board-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #F5EAC9;
	letter-spacing: 2rpx;
}

.board-desc {
	font-size: 24rpx;
	color: #999;
	max-width: 400rpx;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.board-btn {
	background: linear-gradient(90deg, #F3D89E, #F5EAC9);
	padding: 12rpx 36rpx;
	border-radius: 30rpx;
	z-index: 1;
}

.btn-text {
	font-size: 26rpx;
	color: #5C401F;
	font-weight: 600;
}
</style>