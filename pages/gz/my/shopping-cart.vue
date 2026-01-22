<template>
	<view class="page-wrap index">
	<LayoutNavigationGz :title="title" > 
		<template #right>
      <up-icon name="setting" size="28rpx" color="#fff" @tap="managementCart=!managementCart"></up-icon>
			<!-- <text class="management-cart" @tap="managementCart=!managementCart">{{managementCart?"取消":"管理"}}</text> -->
		</template>
	</LayoutNavigationGz>
		<view class="page-content">
			 <view class="cart-container">
			    <!-- 下拉刷新容器 -->
			    <scroll-view
			      :scroll-y="true"
			      @refresherrefresh="onRefresh"
			      @scrolltolower="onLoadMore"
			      :refresher-enabled="true"
			      :refresher-triggered="refreshing"
			      :refresher-default-style="'transparent'"
			      :refresher-background="'transparent'"
			      :enable-back-to-top="true"
			      class="scroll-view"
			    >
			      <!-- 商品列表 -->
			      <view v-for="(item, index) in cartList" :key="item.id" class="cart-item">
				   <view class="shopping-item-title">
						<text class="item-id">编号：{{ item.id }}</text>
				   </view>
				   <view  class="cart-item-content">
						<!-- 选择框 -->
						<view class="checkbox-wrapper">
							<CxCheckbox
							  v-model="item.selected"
							  :size="36"
							/>
						</view>
				
						<!-- 商品信息 -->
						<view class="item-content">
						  <image :src="item.image" mode="aspectFill" class="item-image"></image>
						  <view class="item-info">
							<view class="item-title">{{ item.title }}</view>
							<view class="item-tags">
							  <CxTag
								text="假一赔四"
							  />&nbsp;
							  <CxTag
								text="7天无理由退换"
							  />
							</view>
							<view class="item-price">¥{{ item.price }}</view>
						  </view>
						  <view class="item-actions" v-if="managementCart">
						    <view class="count-box">
						      <text class="btn" @click="decrease(item)">−</text>
						      <text class="count">{{ item.count }}</text>
						      <text class="btn" @click="increase(item)">+</text>
						    </view>
							
						    <text class="delete" @click="removeItem(index)">删除</text>
						  </view>
						  <view class="item-count" v-else>x{{ item.count }}</view>
						</view>
					  </view>
				  </view>
			
			      <!-- 加载中提示 -->
			      <u-loading-icon
			        v-if="loading && !refreshing"
			        :show="true"
			        mode="circle"
			        text="加载中..."
			        class="loading"
			      ></u-loading-icon>
			
			      <!-- 没有更多数据 -->
			      <u-empty
			        v-if="cartList.length > 0 && !loading && noMoreData"
			        text="没有更多商品啦~"
					textColor="#D1A156"
					iconColor="#ccc"
			        mode="list"
			        class="empty"
			      ></u-empty>
			
			      <!-- 空购物车 -->
			      <u-empty
			        v-if="cartList.length === 0 && !loading"
			        text="购物车空空如也"
					textColor="#D1A156"
					iconColor="#ccc"
			        mode="shopping"
			        class="empty"
			      ></u-empty>
			    </scroll-view>
			  </view>
		</view>
	<view class="cart-bar">
	  <view class="left">
	    <CxCheckbox
	      :model-value="isAllSelected"
	      @update:modelValue="toggleSelectAll"
	      :size="36"
	    />
	    <text class="select-all">全选</text>
	  </view>
	
	  <view class="right">
	    <view class="price">
	      合计：
	      <text class="amount">¥{{ totalPrice.toFixed(2) }}</text>
	    </view>
	    <view class="checkout" :class="{ disabled: selectedCount === 0 }">
			<CxComfirmBtn
			:text="`结算${selectedCount}`"
			:disabled="selectedCount === 0"
			 />
	    </view>
	  </view>
	</view>

	</view>
</template>


<script setup name="shoppingCart">
let title = ref("购物车");
let managementCart = ref(false);
const mockData = Array.from({ length: 20 }, (_, i) => ({
  id: `EMB-2024-00${i + 1}`,
  selected: false,
  image: `https://picsum.photos/seed/${Math.random()}/120/80`,
  title: `古韵民族丝绸非遗刺绣${i}`,
  price: 666.66,
  count: 2,
}))

const cartList = ref([])
const loading = ref(false)
const refreshing = ref(false)
const noMoreData = ref(false)
const page = ref(1)
const pageSize = ref(20)

// 全选状态
const isAllSelected = computed(() =>
  cartList.value.length > 0 &&
  cartList.value.every(item => item.selected)
)

// 已选数量
const selectedCount = computed(() =>
  cartList.value.filter(item => item.selected).length
)

// 总价
const totalPrice = computed(() =>
  cartList.value
    .filter(item => item.selected)
    .reduce((sum, item) => sum + item.price * item.count, 0)
)

// 全选 / 反选
const toggleSelectAll = () => {
  const target = !isAllSelected.value
  cartList.value.forEach(item => {
    item.selected = target
  })
}

// 数量 +
const increase = (item) => {
  item.count++
}

// 数量 -
const decrease = (item) => {
  if (item.count > 1) {
    item.count--
  }
}

// 删除商品
const removeItem = (index) => {
  uni.showModal({
    title: '提示',
    content: '确认删除该商品吗？',
	confirmColor:"#D1A156",
    success: res => {
      if (res.confirm) {
        cartList.value.splice(index, 1)
      }
    }
  })
}
// 初始化加载
onMounted(() => {
  loadCartData()
})

// 加载购物车数据
const loadCartData = async (isRefresh = false) => {
  if (isRefresh) {
    page.value = 1
    cartList.value = []
    noMoreData.value = false
  }

  if (noMoreData.value) return

  loading.value = true
  // 模拟网络请求
  setTimeout(() => {
    const start = (page.value - 1) * pageSize.value
    const end = start + pageSize.value
    const newData = mockData.slice(start, end)

    if (newData.length > 0) {
      cartList.value = [...cartList.value, ...newData]
      page.value++
    } else {
      noMoreData.value = true
    }

    loading.value = false
    if (isRefresh) {
      refreshing.value = false
    }
  }, 2200)
}

// 下拉刷新
const onRefresh = () => {
  refreshing.value = true
  loadCartData(true)
}

// 上拉加载更多
const onLoadMore = () => {
  loadCartData()
}

// 单选处理
const handleSelect = (item) => {
  console.log('选中状态:', item.selected)
  // 可扩展：联动全选状态
}	
</script>

<style lang="scss" scoped>
/* 商品操作区 */
.item-actions {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.count-box {
  display: flex;
  align-items: center;
  border: 1rpx solid #ddd;
  border-radius: 6rpx;
  overflow: hidden;

  .btn {
    width: 40rpx;
    text-align: center;
    font-size: 28rpx;
  }

  .count {
    width: 40rpx;
    text-align: center;
  }
}

.delete {
  font-size: 24rpx;
  color: #ff4d4f;
}

/* 底部结算栏 */
.cart-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 120rpx;
  background: #4D1419;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20rpx;
  box-shadow: 0 -4rpx 20rpx rgba(0,0,0,.08);
}

.cart-bar .left {
  display: flex;
  gap: 10rpx;
  width: 100rpx;
  color: #fff;
}

.select-all {
  font-size: 26rpx;
}

.cart-bar .right {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  text-align: right;
  gap: 20rpx;
}

.amount {
  font-size: 32rpx;
  font-weight: bold;
}
.price{
	color: #FFE185;
}
.checkout {
	width: 40%;
}

.checkout.disabled {
  // opacity: .5;
}
	
	
	
	
	
.item-id {
  font-size: 22rpx;
  color: #13161F;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.shopping-item-title{
	padding: 20rpx 0;
	border-bottom: 1rpx solid rgba(0, 0, 0, .1);
}
.item-image {
width: 120rpx;
height: 120rpx;
border-radius: 10rpx;
margin-right: 20rpx;
}

.item-info {
flex: 1;
min-width: 0; // 防止文字溢出

.item-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-tags {
  display: flex;
  gap: 10rpx;
  margin-bottom: 10rpx;

  ::v-deep .u-tag__text {
	font-size: 20rpx;
  }
}

.item-price {
  font-size: 32rpx;
  font-weight: bold;
  color: #13161F;
}
}

.item-count {
font-size: 28rpx;
color: #666;
margin-left: 20rpx;
}
.checkbox-wrapper {
  margin-right: 20rpx;
}

.item-content {
  display: flex;
  align-items: center;
  flex: 1;

  
}
.cart-item-content {
    display: flex;
    align-items: center;
	margin: 10rpx 0;
  }
.cart-item{
    background: #fff;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    padding: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);	
}
.scroll-view {
    height: calc(100%);
  }
.loading {
margin: 40rpx auto;
}

.empty {
margin-top: 100rpx;
}
.cart-container {
  height: 100%;
  box-sizing: border-box;
  
}
.management-cart{
	color: #fff;
}
.page-wrap{
	background: url("/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr 120rpx;
}	
	
</style>