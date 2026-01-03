<template>
	<view class="page-wrap community">
		<LayoutNavigation :title="title" />
		<view class="search-bar">
			<up-search
			  v-model="searchKey"
			  placeholder="搜索"
			  bgColor="#fff"
			  placeholderColor="#AC9394"
			  searchIconColor="#672227"
			  borderColor="#fff"
			  height="64rpx"
			  :show-action="false"
			  shape="round"
			  :disabled="false"
			/>
		</view>
		
		<view class="page-content">
			<!-- 使用 BaseProductList 实现整体页面滚动 -->
			<BaseProductList
				@onScrollToLower="scrollToLower"
				@onRefresh="refreshList"
				:isRefreshing="isRefreshing"
				:loadStatus="loadStatus"
				:iconType="iconType"
				:enableRefresh="false"
				:enableLoadMore="true"
				class="scroll-view"
			>
				<template #scrollContain>
					<!-- 绣娘列表 (横向滚动) -->
					<view class="mother-section">
						<CxScrollView
							class="mother-list"
							:list="motherList"
							:config="{
								direction: 'x',
								visibleCount: 4.5,
								gap: '20rpx'
							}"
						>
							<template #item="{item}">
								<MotherItem :item="item" @click="handleMotherClick" />
							</template>
						</CxScrollView>
					</view>
					
					<!-- 讨论群组 (横向滚动) -->
					<view class="group-section">
						<CxScrollView
							class="group-list"
							:list="groupList"
							:config="{
								direction: 'x',
								visibleCount: 1.8, // 调整可见数量以适应卡片宽度
								gap: '20rpx'
							}"
							@click="handleGroupClick"
						>
							<template #item="{item}">
								<MotherGroup :item="item" @click="handleGroupClick" />
							</template>
						</CxScrollView>
					</view>
					
					<!-- 动态列表 -->
					<view class="dynamic-list">
						<DynamicCard 
							v-for="(item, index) in dynamicList" 
							:key="index"
							:item="item"
							@click="handleDynamicClick"
							@follow="handleFollow"
							@like="handleLike"
							@comment="handleComment"
							@share="handleShare"
						/>
					</view>
				</template>
			</BaseProductList>
		</view>
		
		<!-- 悬浮发布按钮 -->
		<view class="float-btn" @tap="handlePublish">
			<u-icon name="plus" color="#fff" size="32"></u-icon>
			<text class="btn-text">发布</text>
		</view>
	</view>
</template>

<script setup name="community">
import { ref, onMounted, watch } from 'vue';
import MotherItem from '@/components/gz/community/MotherItem.vue';
import MotherGroup from '@/components/gz/community/MotherGroup.vue';
import DynamicCard from '@/components/gz/community/DynamicCard.vue';

// 防抖函数
function useDebounce(fn, delay = 500) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

let title = ref("社区");
let searchKey = ref("");

// 绣娘数据
const motherList = ref([
	{ id: 0, name: '更多绣娘', avatar: '', showAdd: true }, // 更多按钮特殊处理
	{ id: 1, name: '张小小', avatar: 'https://cdn.uviewui.com/uview/album/1.jpg', showAdd: true },
	{ id: 2, name: '李柳柳', avatar: 'https://cdn.uviewui.com/uview/album/2.jpg', showAdd: true },
	{ id: 3, name: '王绣绣', avatar: 'https://cdn.uviewui.com/uview/album/3.jpg', showAdd: true },
	{ id: 4, name: '赵芸芸', avatar: 'https://cdn.uviewui.com/uview/album/4.jpg', showAdd: true },
	{ id: 5, name: '张小小', avatar: 'https://cdn.uviewui.com/uview/album/5.jpg', showAdd: true },
	{ id: 6, name: '李柳柳', avatar: 'https://cdn.uviewui.com/uview/album/6.jpg', showAdd: true },
	{ id: 7, name: '王绣绣', avatar: 'https://cdn.uviewui.com/uview/album/7.jpg', showAdd: true },
	{ id: 8, name: '赵芸芸', avatar: 'https://cdn.uviewui.com/uview/album/8.jpg', showAdd: true }
]);

// 群组数据
const groupList = ref([
	{
		id: 1,
		title: '刺绣技术文化讨论',
		tag: '刺绣达人',
		count: '36585456',
		avatars: [
			'https://cdn.uviewui.com/uview/album/1.jpg',
			'https://cdn.uviewui.com/uview/album/2.jpg'
		]
	},
	{
		id: 2,
		title: '刺绣技法百科全书',
		tag: '刺绣技法',
		count: '36585456',
		avatars: [
			'https://cdn.uviewui.com/uview/album/3.jpg',
			'https://cdn.uviewui.com/uview/album/4.jpg'
		]
	},
	{
		id: 3,
		title: '刺绣工艺',
		tag: '刺绣技法',
		count: '36598455',
		avatars: [
			'https://cdn.uviewui.com/uview/album/5.jpg',
			'https://cdn.uviewui.com/uview/album/6.jpg'
		]
	},
	{
		id: 4,
		title: '刺绣现状',
		tag: '刺绣技法',
		count: '36561566',
		avatars: [
			'https://cdn.uviewui.com/uview/album/7.jpg',
			'https://cdn.uviewui.com/uview/album/8.jpg'
		]
	}
]);

// 动态列表状态
const isRefreshing = ref(false);
const dynamicList = ref([]);
const loadStatus = ref('loadmore');
const iconType = ref('flower');
let page = 1;
const pageSize = 5;
let hasMore = true;
let isLoading = false;

// 模拟动态数据
const generateMockData = (pageNum, count) => {
	return Array.from({ length: count }, (_, i) => ({
		id: (pageNum - 1) * count + i + 1,
		name: '绣娘乐乐',
		avatar: 'https://cdn.uviewui.com/uview/album/5.jpg',
		isSigned: true,
		location: '广州市',
		time: i % 2 === 0 ? '刚刚发布' : '2025.1.2',
		content: '这种失传很久的技法现在找回了，在这里分享给各位绣娘。',
		images: [
			'https://cdn.uviewui.com/uview/album/6.jpg',
			'https://cdn.uviewui.com/uview/album/7.jpg',
			'https://cdn.uviewui.com/uview/album/8.jpg',
			'https://cdn.uviewui.com/uview/album/9.jpg',
			'https://cdn.uviewui.com/uview/album/10.jpg'
		],
		views: '10W+',
		likes: 536,
		comments: 536,
		shares: 536,
		isFollowed: i % 2 !== 0,
		isLiked: false
	}));
};

const fetchData = async (isRefresh = false) => {
	if(isRefresh){
		if (isLoading) return;
		isRefreshing.value = true;
		page = 1;
		hasMore = true;
	};
	if (!hasMore || isLoading) return;

	isLoading = true;
	loadStatus.value = 'loading';
	
	try {
		await new Promise(resolve => setTimeout(resolve, 800));
		const newData = generateMockData(page, pageSize);
		
		if (newData.length < pageSize) {
			hasMore = false;
			loadStatus.value = 'nomore';
		} else {
			loadStatus.value = 'loadmore';
		}
		
		if (isRefresh) {
			dynamicList.value = newData;
		} else {
			dynamicList.value = [...dynamicList.value, ...newData];
		}
		page++;
	} catch (err) {
		if(!isRefresh) loadStatus.value = 'loadmore';
		console.error('加载失败:', err);
	} finally {
		isLoading = false;
		isRefreshing.value = false;
	}
};

const handleMotherClick = (item) => {
	if (item.id === 0) {
		console.log('更多绣娘');
		// 跳转更多
	} else {
		console.log('点击绣娘', item.name);
	}
};

const handleGroupClick = (item) => {
	console.log('点击群组', item.title);
};

const handleDynamicClick = (item) => {
	console.log('点击动态', item.id);
};

const handleFollow = (item) => {
	item.isFollowed = !item.isFollowed;
	uni.showToast({
		title: item.isFollowed ? '已关注' : '已取消关注',
		icon: 'none'
	});
};

const handleLike = (item) => {
	item.isLiked = !item.isLiked;
	item.likes += item.isLiked ? 1 : -1;
};

const handleComment = (item) => {
	console.log('评论', item.id);
};

const handleShare = (item) => {
	console.log('转发', item.id);
};

const handlePublish = () => {
	uni.navigateTo({
		url: '/pages/gz/community/released'
	});
};

// 搜索处理
const onSearch = () => {
	console.log("搜索关键字", searchKey.value);
	// 这里添加实际的搜索逻辑，例如重置分页并重新请求数据
	fetchData(true);
};

// 防抖搜索
const debouncedSearch = useDebounce(() => {
    if (searchKey.value) {
        onSearch();
    }
}, 1200);

// 监听搜索词变化
watch(searchKey, (newVal) => {
    // 如果需要清空搜索时也触发，可以去掉 if 判断
    debouncedSearch();
});

const refreshList = () => {
	fetchData(true);
};

const scrollToLower = () => {
	fetchData();
};

onMounted(() => {
	fetchData(true);
});
</script>

<style lang="scss" scoped>
.page-wrap {
	background: url("/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr 0rpx;
	position: relative;
}

.search-bar {
	position: absolute;
	top: 10rpx; 
	right: 30rpx;
	width: 240rpx; // 调整搜索框宽度
	z-index: 999;
}

.page-content {
	display: flex;
	flex-direction: column;
	height: 100%;
}

.mother-section {
	padding: 20rpx 0;
	
	.mother-list {
		white-space: nowrap;
	}
}

.group-section {
	margin: 20rpx 0;
	.group-list {
		white-space: nowrap;
	}
}

.dynamic-section {
	flex: 1;
	overflow: hidden;
	padding: 30rpx 0;
	
	.scroll-view {
		height: 100%;
	}
}

.float-btn {
	position: fixed;
	right: 30rpx;
	bottom: 120rpx;
	width: 100rpx;
	height: 100rpx;
	background: linear-gradient(135deg, #FF6B4B 0%, #FF4141 100%);
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 16rpx rgba(255, 65, 65, 0.4);
	z-index: 99;
	
	.btn-text {
		font-size: 20rpx;
		color: #fff;
		margin-top: 4rpx;
	}
}
</style>