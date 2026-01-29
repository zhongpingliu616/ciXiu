<template>
	<view class="page-wrap promotion-revenue">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="list-container">
				<BaseProductList
					:isRefreshing="refreshing"
					:loadStatus="loadStatus"
					:enableRefresh="false"
					:enableLoadMore="true"
					@onRefresh="onRefresh"
					@onScrollToLower="onScrollToLower"
				>
					<template #scrollContain>
						<view class="list-item" v-for="(item, index) in listData" :key="index">
							<view class="item-main">
								<view class="item-title">{{ typeMap[item.type] || '未知类型' }}</view>
								<view class="item-time">{{ item.create_time }}</view>
							</view>
							<view class="item-amount">+ {{ item.amount }}</view>
						</view>
					</template>
				</BaseProductList>
			</view>
		</view>
	</view>
</template>

<script setup name="promotionRevenue">
import { teamRewardLog } from '@/api/index'

const title = ref('收益明细')
const listData = ref([
	// {
	// 	title: '推广用户注册认证获得押金减免额度',
	// 	create_time: '2025-12-29 21:49:37',
	// 	amount: '10.00',
	// 	type: 1
	// },
	// {
	// 	title: '直推人员获得收益',
	// 	create_time: '2025-12-29 21:49:37',
	// 	amount: '12.00',
	// 	type: 2
	// },
	// {
	// 	title: '间推人员获得收益',
	// 	create_time: '2025-12-29 21:49:37',
	// 	amount: '14.00',
	// 	type: 3
	// },
	// {
	// 	title: '直推人员获得收益',
	// 	create_time: '2025-12-29 21:49:37',
	// 	amount: '16.00',
	// 	type: 4
	// }
])
const page = ref(1)
const limit = ref(10)
const loadStatus = ref('loadmore')
const refreshing = ref(false)

const typeMap = {
	1: '直属推广',
	2: '间接推广',
	3: '直属实名认证',
	4: '间接推广用户实名认证',
	5: '任务扣除减免金额'
}

const getList = async (reset = false) => {
	if (reset) {
		page.value = 1
		loadStatus.value = 'loading'
		refreshing.value = true
	}

	try {
		const res = await teamRewardLog({
			page: page.value,
			limit: limit.value
		})
		
		refreshing.value = false
		
		if (res.code === 200) {
			const list = res.data.lists || []
			if (reset) {
				listData.value = list
			} else {
				listData.value = [...listData.value, ...list]
			}
			
			if (list.length < limit.value) {
				loadStatus.value = 'nomore'
			} else {
				loadStatus.value = 'loadmore'
				page.value++
			}
		} else {
			loadStatus.value = 'nomore'
			uni.showToast({
				title: res.msg || '获取数据失败',
				icon: 'none'
			})
		}
	} catch (e) {
		refreshing.value = false
		loadStatus.value = 'nomore'
		uni.showToast({
			title: '网络请求失败',
			icon: 'none'
		})
	}
}

const onRefresh = () => {
	getList(true)
}

const onScrollToLower = () => {
	if (loadStatus.value === 'nomore') return
	getList()
}

onLoad(() => {
	getList(true)
})
</script>

<style lang="scss" scoped>
.page-wrap {
	height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: #f5f5f5;
	overflow: hidden;
}

.page-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.list-container {
	flex: 1;
	background: #FFFFFF;
	border-radius: 20rpx;
	// padding: 0 30rpx; // 移动到item内部或BaseProductList插槽处理，避免scroll-view宽度问题
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.list-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding:15rpx 30rpx;
	border-bottom: 1rpx solid #F5F5F5;
	
	&:last-child {
		border-bottom: none;
	}
}

.item-main {
	flex: 1;
	margin-right: 20rpx;
}

.item-title {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 12rpx;
	line-height: 1.4;
}

.item-time {
	font-size: 24rpx;
	color: #999;
}

.item-amount {
	font-size: 32rpx;
	color: #FF4D4F;
	font-weight: bold;
	flex-shrink: 0;
}
</style>