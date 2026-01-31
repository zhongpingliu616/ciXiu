<template>
	<view class="page-wrap index">
		<LayoutNavigation :title="title" />
		
		<view class="page-content">
			<!-- NFT 趋势图 -->
			<NftTrends />
			
			<!-- 我的钱包 -->
			<view class="wallet-card">
				<view class="card-header">
					<text class="title">我的钱包</text>
					<view class="more" @tap="handleRecords">
						<text>交易记录</text>
						<u-icon name="arrow-right" color="#999" size="24"></u-icon>
					</view>
				</view>
				<view class="wallet-grid">
					<view class="grid-item">
						<text class="label">持有数量</text>
						<text class="value">12306</text>
					</view>
					<view class="grid-item">
						<text class="label">资产总值(元)</text>
						<text class="value">123.06</text>
					</view>
					<view class="grid-item">
						<text class="label">今日收益(元)</text>
						<text class="value green">+123.06</text>
					</view>
				</view>
			</view>
			
			<!-- 热门藏品 -->
			<view class="recommend-product">
			   <CommonTitleList
				 title="热门藏品"
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
			
			<!-- 纸币兑换 -->
			<view class="exchange-card">
				<view class="card-header">
					<text class="title">纸币兑换</text>
					<text class="subtitle">ERC-7498标准</text>
				</view>
				<view class="wallet-grid">
					<view class="grid-item">
						<text class="label">我的绣币</text>
						<text class="value">12.30</text>
					</view>
					<view class="grid-item">
						<text class="label">兑换比例</text>
						<text class="value">1:2</text>
					</view>
					<view class="grid-item">
						<text class="label">今日收益(元)</text>
						<text class="value green">+12%</text>
					</view>
				</view>
				<view class="action-btns">
					<CxComfirmBtn
						text="明细" 
						:btnStyle="{
							background: 'linear-gradient(to right, #F3D89E, RGBA(245, 234, 201, 1)',
							color: '#805536'
						}"
						@click="handleBuy"
					/> &nbsp;&nbsp;
					<CxComfirmBtn
						text="兑换" 
						:btnStyle="{
						}"
						@click="handleBuy"
					/>
					<!-- <view class="btn detail-btn">明细</view>
					<view class="btn exchange-btn">兑换</view> -->
				</view>
			</view>
		</view>
		
		<!-- 底部操作栏 -->
		<view class="footer-bar">
			<view class="search-box">
				<text class="prefix">NFT</text>
				<input type="text" placeholder="" class="input" disabled />
				<text class="suffix">NFT</text>
			</view>
			<view class="footer-btns">
				<CxComfirmBtn 
					text="立即购买" 
					:btnStyle="{
						background: 'transparent',
						color: '#F3D89E'
					}"
					@click="handleBuy"
				/>&nbsp;&nbsp;
				<CxComfirmBtn 
					text="连接钱包" 
					:btnStyle="{
					}"
					@click="connectWallet"
				/>
			</view>
		</view>
	</view>
</template>

<script setup name="NftIndex">
import NftTrends from '@/components/gz/nft/NftTrends.vue'
const title = ref("NFT")
const isRefreshing = ref(false)
const productList = ref([])
const loadStatus = ref('loadmore')
const iconType = ref('flower')
let page = 1
const pageSize = 10
let hasMore = true
let isLoading = false

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
	
	  const hasMore = page < 3 
	
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

const handleRecords = () => {
	console.log('查看交易记录')
}

const handleBuy = () => {
	console.log('立即购买')
}

const connectWallet = () => {
	console.log('连接钱包')
}

onMounted(() => {
	fetchData(true)
})
</script>

<style lang="scss" scoped>
:deep(.favorite-column){
	display: none;
}
.page-wrap {
	grid-template-rows: 80rpx 1fr 240rpx;
}

.page-content {
	overflow-y: auto;
}

.wallet-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		
		.title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
		
		.more {
			display: flex;
			align-items: center;
			font-size: 24rpx;
			color: #999;
		}
	}
	
	.wallet-grid {
		display: flex;
		justify-content: space-between;
		
		.grid-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			background: #F9F9F9;
			padding: 20rpx 10rpx;
			border-radius: 12rpx;
			margin: 0 10rpx;
			
			&:first-child { margin-left: 0; }
			&:last-child { margin-right: 0; }
			
			.label {
				font-size: 24rpx;
				color: #999;
				margin-bottom: 12rpx;
			}
			
			.value {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				
				&.green {
					color: #00C853;
				}
			}
		}
	}
}

.recommend-product {
	margin-bottom: 24rpx;
}

.exchange-card {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	margin-bottom: 24rpx;
	
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 30rpx;
		
		.title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
		
		.subtitle {
			font-size: 24rpx;
			color: #999;
		}
	}
	
	.wallet-grid {
		display: flex;
		justify-content: space-between;
		margin-bottom: 30rpx;
		
		.grid-item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			background: #F9F9F9;
			padding: 20rpx 10rpx;
			border-radius: 12rpx;
			margin: 0 10rpx;
			
			&:first-child { margin-left: 0; }
			&:last-child { margin-right: 0; }
			
			.label {
				font-size: 24rpx;
				color: #999;
				margin-bottom: 12rpx;
			}
			
			.value {
				font-size: 32rpx;
				font-weight: bold;
				color: #333;
				
				&.green {
					color: #00C853;
				}
			}
		}
	}
	
	.action-btns {
		display: flex;
		justify-content: space-between;
		
		.btn {
			width: 48%;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 40rpx;
			font-size: 30rpx;
			font-weight: bold;
			
			&.detail-btn {
				background: #FDF6EC;
				color: #D4A056;
			}
			
			&.exchange-btn {
				background: linear-gradient(90deg, #FF6B4B 0%, #FF4141 100%);
				color: #fff;
			}
		}
	}
}

.footer-bar {
	padding: 20rpx 30rpx 40rpx;
	background: transparent;
	
	.search-box {
		background: #fff;
		border-radius: 40rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		padding: 0 30rpx;
		margin-bottom: 20rpx;
		
		.prefix, .suffix {
			font-size: 28rpx;
			color: #333;
			font-weight: bold;
		}
		
		.input {
			flex: 1;
			height: 100%;
			margin: 0 20rpx;
		}
	}
	
	.footer-btns {
		display: flex;
		justify-content: space-between;
	}
}
</style>