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
   >
	   <view class="card-header">
		 <image :src="item.image" class="card-image" mode="aspectFill" />
		 <view class="card-content">
		   <view class="card-title">{{ item.title }}</view>
		   <view class="tags">
			 <CxTag
			   text="工期360天"
			   :bgGradient="['rgba(248,163,29,0.1)', 'rgba(248,163,29,0.1)']"
			 />&nbsp;
			 <CxTag
			   text="难度低"
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
				   每周三 16:00
				</text>
			 </view>
			 <view class="can-grab">
				 <CxComfirmBtn :btnStyle="{
					 height:'60rpx'
				 }" @click="handleGrab(item)" :text="'提交成品'"></CxComfirmBtn>
			 </view>
		   </view>
		 </view>
	   </view>
   </view>

   <!-- 加载中提示 -->
   <u-loading-icon
	 v-if="loading && !refreshing"
	 :size="30"
	 :show-text="true"
	 text="加载中..."
	 style="margin: 30rpx auto;"
   />

   <!-- 没有更多数据提示 -->
   <u-empty
	 v-if="listData.length > 0 && !loading && noMore"
	 mode="data"
	 text="没有更多数据了"
	 :icon-size="80"
	 style="margin-top: 50rpx;"
   ></u-empty>

   <!-- 初始空状态 -->
   <u-empty
	 v-if="listData.length === 0 && !loading && !refreshing"
	 mode="data"
	 text="暂无数据"
	 :icon-size="80"
	 style="margin-top: 100rpx;"
   ></u-empty>
 </scroll-view>
</template>


<script setup name="Unfinished">
// 模拟用户等级（用于判断是否可抢单）
const userLevel = ref(3) // 假设用户等级为3

// 数据状态
const listData = ref([])
const loading = ref(false)
const refreshing = ref(false)
const page = ref(1)
const pageSize = ref(10)
const noMore = ref(false)
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
    listData.value = []
  }

  if (noMore.value && !isRefresh) return

  loading.value = true

  try {
    // 模拟网络请求延迟
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newData = generateMockData(page.value, pageSize.value)

    if (newData.length < pageSize.value) {
      noMore.value = true
    }

    if (isRefresh) {
      listData.value = newData
    } else {
      listData.value = [...listData.value, ...newData]
    }

    page.value++
  } catch (err) {
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
	
  uni.showToast({ title: '提交成品！', icon: 'success' })
  // 可在此处调用接口更新状态
}

// 页面加载时初始化数据
onMounted(() => {
  fetchData()
})		
	
</script>

<style lang="scss" scoped>

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