<template>
	<view class="page-wrap my-team">
		<LayoutNavigation :title="title" />
		<view class="page-content">
			<!-- Stats Section -->
			<view class="stats-grid">
				<view class="stats-row">
					<view class="stats-item">
						<view class="stats-value">{{ statDatas.count || 0 }}</view>
						<view class="stats-label">累计推广人数</view>
					</view>
					<view class="stats-item">
						<view class="stats-value">{{ statDatas.direct_count || 0 }}</view>
						<view class="stats-label">直接推广人数</view>
					</view>
					<view class="stats-item">
						<view class="stats-value">{{ statDatas.indirect_count || 0}}</view>
						<view class="stats-label">间接推广人数</view>
					</view>
				</view>
				<view class="stats-row">
					<view class="stats-item">
						<view class="stats-value">{{ statDatas.margin_amount || '0' }}</view>
						<view class="stats-label">押金减免额度</view>
					</view>
					<view class="stats-item">
						<view class="stats-value">{{ statDatas.total_direct_margin_amount || 0 }}</view>
						<view class="stats-label">直接推广收益</view>
					</view>
					<view class="stats-item">
						<view class="stats-value">{{ statDatas.total_indirect_margin_amount || 0 }}</view>
						<view class="stats-label">间接推广收益</view>
					</view>
				</view>
			</view>

			<!-- Notice Section -->
			<view class="notice-box">
				<view class="notice-title">
					<uni-icons custom-prefix="iconfont" type="icon-dengpao" size="30rpx" color="#ffffff"></uni-icons>&nbsp;
					温馨提示
				</view>
				<view class="notice-content">
					您发展来的下级在通过平台资料审核后被纳入到您名下有直推，您将获得押金减免额度和直推收益
				</view>
			</view>

			<!-- Ranking Card -->
			<view class="ranking-card">
				<view class="card-header">
					<view class="header-left">
						<view class="red-bar"></view>
						<text class="title">团队排行（共{{ teamListDatas.length }}人）</text>
					</view>
					<view class="revenue-btn" @click="goToRevenue">
						推广收益明细
						<u-icon name="arrow-right" color="#fff" size="24rpx" style="margin-left: 4rpx;"></u-icon>
					</view>
				</view>

				<!-- Search Bar -->
				<view class="search-bar" v-if="false">
					<input type="text" placeholder="输入账号/姓名" v-model="keyword" class="search-input" placeholder-class="placeholder-style" @confirm="getTeamList(true)" />

					<u-icon name="search" color="#999" size="42rpx" style="margin-right: 10rpx;" @click="getTeamList(true)"></u-icon>
				</view>

				<!-- Team List -->
				<view class="team-list">
					<BaseProductList
						:isRefreshing="refreshing"
						:loadStatus="loadStatus"
						:enableRefresh="false"
						:enableLoadMore="true"
						@onRefresh="onRefresh"
						@onScrollToLower="onScrollToLower"
					>
						<template #scrollContain>
							<view class="team-item" v-for="(item, index) in teamListDatas" :key="index">
								<image class="avatar" :src="item.avatar || '/static/images/public_logo.png'" mode="aspectFill"></image>
								<view class="item-info">
									<view class="name-row">
										<text class="name">{{ item.nick_name }}</text>
										<view class="tag">直推{{ item.direct_margin_amount || '0' }}人</view>
									</view>
									<view class="account">账号：{{ item.username }}</view>
								</view>
								<view class="item-right">
									<view class="revenue">¥{{ item.total_margin_amount }}</view>
									<view class="order-count">共{{ item.total_task_completed_count }}单</view>
								</view>
							</view>
						</template>
					</BaseProductList>
				</view>
			</view>
		</view>

		<!-- Bottom Button -->
		<view class="fixed-bottom">
			<CxComfirmBtn 
				text="我的推广码" 
				@click="goToCode"
			/>
		</view>
	</view>
</template>

<script setup name="myTeam">
import { teamStatistics, teamLists } from '@/api/index'

const title = ref('我的团队')
const keyword = ref('')
const page = ref(1)
const limit = ref(10)
const loadStatus = ref('loadmore')
const refreshing = ref(false)

const statDatas = ref({
	// margin_amount: 12, // 押金减免额度
	// total_indirect_margin_amount: 5, // 间接推广收益
	// total_direct_margin_amount: 7, // 直接推广收益
	// count: 12382, // 累计推广人数
	// direct_count: 4234, // 直接推广人数
	// indirect_count: 8148, // 间接推广人数
})

const teamListDatas = ref([
	// {	id: 1, 
	// 	username: '张萌新', // 会员账户
	// 	avatar: 'https://picsum.photos/100?random=1', // 会员头像
	// 	nick_name: '张萌新', // 会员昵称
	// 	total_margin_amount: '56375678', // 累计推广收益
	// 	direct_margin_amount: '4234.56', // 直接推广收益
	// 	total_task_completed_count: '42349', // 完成任务数
	// },
	// {	id: 2, 
	// 	username: '李梦一', // 会员账户
	// 	avatar: 'https://picsum.photos/100?random=2', // 会员头像
	// 	nick_name: '李梦一', // 会员昵称
	// 	total_margin_amount: '5581.00', // 累计推广收益
	// 	direct_margin_amount: '4234.56', // 直接推广收益
	// 	total_task_completed_count: '42349', // 完成任务数
	// },
	// {	id: 3, 
	// 	username: '何先森', // 会员账户
	// 	avatar: 'https://picsum.photos/100?random=3', // 会员头像
	// 	nick_name: '何先森', // 会员昵称
	// 	total_margin_amount: '56375678', // 累计推广收益
	// 	direct_margin_amount: '5581.00', // 直接推广收益
	// 	total_task_completed_count: '42349', // 完成任务数
	// }
])

const goToRevenue = () => {
	uni.navigateTo({
		url: '/pages/xn/my/promotion-revenue'
	})
}

const goToCode = () => {
	uni.navigateTo({
		url: '/pages/xn/my/promotion-code'
	})
}

// 获取团队统计数据
const getTeamStatistics = async () => {
	const res = await teamStatistics()
	if (res.code === 200) {
		statDatas.value = res.data || {}
	}
}

// 获取团队列表
const getTeamList = async (reset = false) => {
	if (reset) {
		page.value = 1
		loadStatus.value = 'loading'
		refreshing.value = true
	}
	
	const res = await teamLists({
		keyword: keyword.value,
		page: page.value,
		limit: limit.value
	})
	
	refreshing.value = false
	
	if (res.code === 200) {
		const list = res.data.lists || []
		if (reset) {
			teamListDatas.value = list
		} else {
			teamListDatas.value = [...teamListDatas.value, ...list]
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
}

const onRefresh = () => {
	getTeamList(true)
	getTeamStatistics()
}

const onScrollToLower = () => {
	if (loadStatus.value === 'nomore') return
	getTeamList()
}

onLoad(async () => {
	 getTeamStatistics()
	 getTeamList(true)
})
</script>

<style lang="scss" scoped>
.page-wrap {
}

.page-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.stats-grid {
	margin-bottom: 30rpx;
	flex-shrink: 0;
}

.stats-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 30rpx;
}

.stats-item {
	flex: 1;
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.stats-value {
	font-size: 40rpx;
	font-weight: bold;
	color: #fff;
	margin-bottom: 8rpx;
	font-family: Arial, Helvetica, sans-serif;
}

.stats-label {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
}

.notice-box {
	background: rgba(255, 255, 255, 0.1);
	border-radius: 16rpx;
	padding: 24rpx;
	margin-bottom: 30rpx;
	flex-shrink: 0;
}

.notice-title {
	display: flex;
	align-items: center;
	font-size: 28rpx;
	color: #fff;
	font-weight: bold;
	margin-bottom: 12rpx;
}

.notice-content {
	font-size: 24rpx;
	color: rgba(255, 255, 255, 0.8);
	line-height: 1.5;
}

.ranking-card {
	background: #fff;
	border-radius: 30rpx;
	min-height: 0;
	flex: 1;
	padding: 30rpx;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
	flex-shrink: 0;
}

.header-left {
	display: flex;
	align-items: center;
}

.red-bar {
	width: 8rpx;
	height: 32rpx;
	background: #FF4D4F;
	border-radius: 4rpx;
	margin-right: 16rpx;
}

.title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.revenue-btn {
	background: linear-gradient(90deg, #FF8E53 0%, #FF6B6B 100%);
	border-radius: 30rpx;
	padding: 8rpx 20rpx;
	font-size: 22rpx;
	color: #fff;
	display: flex;
	align-items: center;
}

.search-bar {
	background: #F5F5F5;
	border-radius: 40rpx;
	height: 72rpx;
	display: flex;
	align-items: center;
	padding: 0 30rpx;
	margin-bottom: 30rpx;
	flex-shrink: 0;
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	color: #333;
}

.placeholder-style {
	color: #999;
}

.team-list {
	flex: 1;
	overflow: hidden;
}

.team-item {
	display: flex;
	align-items: center;
	padding: 24rpx 0;
	border-bottom: 1rpx solid #f5f5f5;
	
	&:last-child {
		border-bottom: none;
	}
}

.avatar {
	width: 88rpx;
	height: 88rpx;
	border-radius: 50%;
	margin-right: 20rpx;
	background-color: #eee;
}

.item-info {
	flex: 1;
}

.name-row {
	display: flex;
	align-items: center;
	margin-bottom: 8rpx;
}

.name {
	font-size: 30rpx;
	font-weight: bold;
	color: #333;
	margin-right: 12rpx;
}

.tag {
	font-size: 20rpx;
	color: #999;
	border: 1rpx solid #ddd;
	border-radius: 20rpx;
	padding: 2rpx 12rpx;
}

.account {
	font-size: 24rpx;
	color: #999;
}

.item-right {
	text-align: right;
}

.revenue {
	font-size: 30rpx;
	color: #FF4D4F;
	font-weight: bold;
	margin-bottom: 8rpx;
}

.order-count {
	font-size: 22rpx;
	color: #666;
	background: #F5F5F5;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	display: inline-block;
}

.fixed-bottom {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 30rpx 60rpx calc(40rpx + constant(safe-area-inset-bottom));
	padding: 30rpx 60rpx calc(40rpx + env(safe-area-inset-bottom));
	z-index: 100;
	// background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%); // Optional fade
}
</style>