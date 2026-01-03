<template>
	<view class="page-wrap sign-contract">
		<LayoutNavigation :title="title" />
		
		<view class="page-content">
			<!-- 筛选 Tab -->
			<view class="tabs-wrapper">
				<CxTabs
				 :tabItems="tabs"
				 lineHeight="0"
				 lineWidth="0"
				 :activeStyle="{
					 color: '#F5EAC9'
				 }"
				 :inactiveStyle="{					 
					 color:'rgba(255, 255, 255, 1)'
				 }"
				 v-model="currentTabIndex"
				 @click="handleTabClick"
				 />
			</view>
			
			<!-- 列表区域 -->
			<view class="list-container">
				<BaseProductList
				@onScrollToLower="scrollToLower"
				@onRefresh="refreshList"
				:isRefreshing="isRefreshing"
				:loadStatus="loadStatus"
				:iconType="iconType"
				:enableRefresh="true"
				:enableLoadMore="true"
				class="scroll-view"
				>
					<template #scrollContain>
						<view class="card-grid">
							<view class="grid-item" v-for="(item, index) in listData" :key="index">
								<ContractCard :item="item" @click="handleCardClick"/>
							</view>
						</view>
					</template>
				</BaseProductList>
			</view>
		</view>
	</view>
</template>

<script setup name="sign-contract">
import { ref, onMounted } from 'vue';
import ContractCard from '@/components/gz/user/ContractCard.vue';

let title = ref("签约绣娘");
const lineBg = ref("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALwAAABOCAYAAACaE3y5AAAJT0lEQVR42u2dfXAU9RnHT6rTjv4ltmhnLNZWSkUCCvgCRUCRoCI0ynvQAFGqYrCEl/ImNhptgqiVvHLc7Z5NK1TGP+qMOtOREtGZ2mLRBpLcHUnDH4yOMx0rud273b07fPr89nbXs9DhjlzIbvJ9Zj7/5TK7O9999vk9z/P7PT4fDAaDwWAwGAwGgxXQqKpqGJ0MDu/tCF6ndMlj4l3yhFPhwETgHpTu4NhYRBqttoeuon/4L4Fqc7RY1P/dWDRYokZDNWpUflsJy11KRDYYAp7hNPOpEg0dUiJSYywir+ztDI2Cui0zPXdE3sYP5jA/oNNnPMCwREqbn9SPGkj9ex3F//oKcBnq3+pIPVxPyifNpHQGz/oixMLyCXZg9bGOwO1EvouGVphC+7/F4l7ED+I95ivnwRzbQ4l3a0nbt4WMpgpK7iin1NOllH5qCfAMSyn1/HIy6h4nvWUjJd6uNp3VN8QfkbtjncFNp442XT6ohd7aWnVxPBIqVyOhHucBHGWRv1VtPqDU9qWU3rYEDEKSOx8hbf82/krXZ3l9SVHDoZpYuOGKQSd29XhoFsd17fbNqh/uIl2qpNSvl1F662IwhDAan6D4gdpsj/8lO8FfCoc4GGL04XxDv7dDF/GGG7ufpPSWxWCII7x+/MCOrPWafESNSuM9K3a+gekcq5/MhC5+0l7bRCnxidu8CAAHo351dpyvc4au0nuevVOu5AxLStxE/IOXKVVdRulNCwE4Kyle7GpvPJW9uN1Pn/kv9UAGpmoYX2yTfeHa61sp/asFAOSE0bCalH/uzqzzRKq6u2WEe8XOiw4lKu0zxc65c6N5DaU3LgAgL5LPLc8OccJftAWudqdnD8t7zYvkNzRZs5LSG+YDcF6I+osoaFnpy6jaE7jSXQvUqFTniJ3f0NT6BwDoE0kuZIn0tVVx//jztpbLBlzo/2n3j+Q3MGRnYozfrKDUuvsBKAhJXsyabQuZfP2fiGhg2hKoq+7bHMI8wxeSsNsC9Fceo1RlCQAFxahalunTycT0u4T2LmzVNBIYp0Rlp2qaeLPKfBNTa38OQL9gcF+ViCBMzbH21Mjvxl0YsYflpZwuitvtAQY3CqWenAdAv2NUPejE9EKDQov9LPbQOrtFIMGNQEnxyVkzD4ALhtCc0J4VXXzF68f1/SR2ab1TTJLXUapiLgADhtCg04gYLbDoual/ie3ZNS4mpVbfB8CAI7Roe3qh0YItUO2YXQtyO+/jcwBwDUKTVspSNY4Hri9E6rHDjNn/uJVSj90LgOtIvO7E9Mf6lLK08uyk8r7FpPiM/OIeAFxH8on7nOxNb0R69rzEnuAKKp8eYBaVDN56l1o1GwDXIjSaWcCGEol/tYw8j94Y2W+GMm9sp9TDxQC4noTdT8/azU/sXfL3+Iea0hEgQzTylM8CwPUIrQrNmtplDeeRmZHWmjuV3nyGUivuAsAzCM1asfzafBarR8SPdNHmu3wmAJ5BaNbeEJ5zu6+ZyG/bTQa/McmH7gTAMwjNCu0KDQstnzuciUplZjjDi9Xkg3cA4DmEdq2Wg7IcwplQg1lV/e2jlCydAYDnENrNhDWhhnMLPiIfNON3cVDO0ukAeA6hXavyevDcR1ZHJPPcR4NLtsnF0wDwHEK7mf4aqScXDx8zBf8Qx0OLpgLgOYR2LQ8fy0XwafHH5o8X/AwA77Fwql1xTecu+IX8w/lTAPAeLPo8BC8pZkgj4qH7JwPgOYR2rZBGyX3Ryr0JyZLbAPAcQruZjd6hntzTkpV8CM68WwHwHEK7OacleUpHpvDEZ0Mm594CgOcQ2s258OS0FuzdTMk5NwPgOYR2c24tcJrH+GgzYx6/MfdOAsAzCM1ax/Ll1jxmxfFme7DGxxYbd08AwDMIzebVHvyNDSC8G9yYfRMAniFunWCg5rUBpK15hLlNqj1Aeul0MmbdCIDrEVoVms17i5+Zjw9Le0wv/+oGMu4aD4DrEVq1Jobsyf+YDj7qwD6mQysvJuPOcQC4Fm1lcd+O6bDaDJ41/8l7L5JezDHSHUUAuA599gRSD71kbd6Wqwty1F6cD640ZowFwHXEebK7dWb8sT5PBxGjwO3DVBPPryBj2g0AuIaEdUoBa1TlheqYwkzVDgdLnUEIPNrGuH0MAAOO0KJ9XLZ6vMDTQGJheYMz04nfKmPq9QAMGLZnz2Rl5A39OQXE9PTxpgrSxaJhyk8BuGDoM4oo3ljxtWfvr5E32UPN+I1S7eyNtmwGGZNHA9Dv6AummpqzByAUPIz5v+nKDnmMOHze/qTEA5Wkc5eacdtPAOgXtLKZ2bNajwkNDshgYtUeTMwj57VH7yHj1lEAFBSdN3Uo1jRuHkFfd6I19J0BGz1vVWQzo+c/biadd4wbN48CoCDo3COjvP/SwI+eP3OnlFRniv6jRtJKJpM+6ToA+sbM8aT+5QU7jPnk87aWy3xuMaKqYRzi7M2IvoG0B6aQPvHHAJwXGjeDKZbYuRksqvYErvS5zai16mL29PtM0R9pogQPm9In/AiAvNDmTCLlg5dtsUe+aAtc7XOrmZ4+IjU7GZzactJvuhaAnEg8MtuMEKx2gcNKd8sInxest1Ou5BV1yrzwt6r5E8UN+jdeC8BZ0TjPHn9xlVM9ZfbTZ/5LfV4ybuaZzt7+ZCaD00Txp5eRNoljtPE/BMAhwaNqFKu9l9E5jFnn86r1dgSHs+j/YLckKAd3UmLV3aSPuwYMcTTOr6t7tzhenUOYI6I71zcYjHseivmQp3bn5v5cQ4mKuaTdwrnWomvAECLBVVP1tc1fN39F5C/FputWTnr4BpOJG+KzKx/mGzzhxGoi1OFmoMSSaRzL8SeuaCQYhIjMS7y6jJQDO7K6HCWFtVAbCzdc4RvM1mqmL+XFfMOHnFBHwL0SastGim8vpQRPZNO48GDGeWN/ADwDi1v0qnPFPb5+PqlNa7Ljc5vuWGdw06mjTZf7hpr1doZG8QPYFhMpqIh8+n8eDCmdUiZN1bqT1HdrSX3nOeA2ODw1i0Qf7rKPyTgD7rA9wYXJeqUzOI3Id5EPlhl5H4+GSrg3p4ZDn3eEJ+CFjHG2BwhcStR0Wp8y73OyopEd2Urh1KDuPApZIsYzvwQde244FQ5MBO5CDYeK9Ig0+t+d/u8T+S+BamEwGAwGg8FgMFih7L8l3omBfpzbbgAAAABJRU5ErkJggg==");

// 状态管理
const tabs = ref([
	{ name: '全部', key: 'all' },
	{ name: '热度 ⇅', key: 'hot', sort: 0 }, // 0: none, 1: desc, 2: asc
	{ name: '等级 ⇅', key: 'level', sort: 0 },
	{ name: '价格 ⇅', key: 'price', sort: 0 }
]);
const currentTabIndex = ref(0);

const isRefreshing = ref(false);
const listData = ref([]);
const loadStatus = ref('loadmore');
const iconType = ref('flower');
let page = 1;
const pageSize = 10;
let hasMore = true;
let isLoading = false;

// 模拟数据生成
const generateMockData = (pageNum, count) => {
	return Array.from({ length: count }, (_, i) => ({
		id: (pageNum - 1) * count + i + 1,
		image: `https://picsum.photos/seed/${Math.random()}/80/80`,
		name: '李柳柳',
		level: Math.floor(10 * Math.random()) + 1,
		count: Math.floor(6000 * Math.random()),
		popularity: Math.floor(10000 * Math.random()), // 热度
		price: (Math.random() * 1000).toFixed(2), // 价格
		isSigned: true
	}));
};

// 获取数据
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
		await new Promise(resolve => setTimeout(resolve, 1800));
		const newData = generateMockData(page, pageSize);
		
		if (newData.length < pageSize) {
			hasMore = false;
			loadStatus.value = 'nomore';
		} else {
			loadStatus.value = 'loadmore';
		}
		
		if (isRefresh) {
			listData.value = newData;
		} else {
			listData.value = [...listData.value, ...newData];
		}
		
		// 获取数据后应用当前排序
		const index = currentTabIndex.value;
		const tab = tabs.value[index];
		if (tab.sort !== undefined && tab.sort !== 0) {
			sortList(index, tab.sort);
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

const sortList = (tabIndex, sortType) => {
	// sortType: 1: desc (降序), 2: asc (升序)
	if (typeof tabIndex !== 'number' || sortType === 0) return;
	
	const compare = (a, b, key) => {
		const valA = Number(a[key]);
		const valB = Number(b[key]);
		return sortType === 1 ? valB - valA : valA - valB;
	};

	switch (tabIndex) {
		case 1: // 热度
			listData.value.sort((a, b) => compare(a, b, 'popularity'));
			break;
		case 2: // 等级
			listData.value.sort((a, b) => compare(a, b, 'level'));
			break;
		case 3: // 价格
			listData.value.sort((a, b) => compare(a, b, 'price'));
			break;
		default:
			break;
	}
};
// Tab 点击处理
const handleTabClick = (item) => {// 0: none, 1: desc 降序, 2: asc 升序
	const index = currentTabIndex.value;
	const tab = tabs.value[index];
	
	// 重置其他 tab 的排序状态
	tabs.value.forEach((t, i) => {
		if (i !== index && t.sort !== undefined) {
			t.sort = 0;
			t.name = t.name.split(' ')[0] + ' ⇅';
		}
	});

	if (tab.sort !== undefined) {
		// 切换排序状态: 0->1(desc)->2(asc)->1(desc)...
		tab.sort = tab.sort === 1 ? 2 : 1;
		const arrow = tab.sort === 1 ? '↓' : '↑';
		tab.name = tab.name.split(' ')[0] + ' ' + arrow;
	}
	
	sortList(currentTabIndex.value,tab.sort);
};

const handleCardClick = (item) => {
	console.log('点击卡片', item);
	// uni.navigateTo(...)
};

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

.card-grid {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	
	.grid-item {
		width: 48%;
		margin-bottom: 20rpx;
	}
}
</style>