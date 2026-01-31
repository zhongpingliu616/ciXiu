<template>
	<view class="search-wrap search">
		<view class="search-bar-wrap">
			<up-row customStyle="margin-bottom: 10px">
				  <up-col span="1">
					  <view class="bell-pic">
              <up-icon name="arrow-left" color="#fff" size="40rpx" @click="onCancel"></up-icon>
						  <!-- <text class="cancel-text">取消</text> -->
					  </view>
				  </up-col>
				  <up-col span="11">
					  <view class="search-bar">
						  <CxSearch
						    v-model="searchKey"
							 placeholder="输入搜索内容"
							showAction
							action-text="搜索"							
							@search="onSearch"
							@custom="onSearch"
              :actionStyle="{
                backgroundColor: '#074685'
              }"
						  />
					  </view>
				  </up-col>
			</up-row>
			
			<view class="tabs-filter-row">
				<view class="tabs-wrapper">
					<view 
						class="tab-item" 
						:class="{ active: currentTab === 0 }"
						@click="currentTab = 0"
					>
						NFT藏品
						<view class="active-line" v-if="currentTab === 0"></view>
					</view>
					<view 
						class="tab-item" 
						:class="{ active: currentTab === 1 }"
						@click="currentTab = 1"
					>
						实物藏品
						<view class="active-line" v-if="currentTab === 1"></view>
					</view>
				</view>
				<view class="filter-icon" @click="showFilter = true">
          
          <uni-icons custom-prefix="iconfont" type="icon-shaixuan" size="30rpx" color="#ffffff"></uni-icons>
				</view>
			</view>
		</view>

		<view class="history-search-container" v-if="historyList.length && !searchKey">
    <template v-if="!searchKey">
      <!-- 标题栏 -->
      <view class="header">
        <text class="title">历史搜索</text>
        <u-icon name="trash" size="20" color="rgba(225, 210, 211, 1)" @tap="clearHistory"></u-icon>
      </view>
    
      <!-- 搜索词标签容器 -->
      <view class="tags-container">
        <u-tag
          v-for="(item, index) in historyList"
          :key="index"
          :text="item"
          shape="circle"
          borderColor="rgba(245, 234, 201, .6)"
          color="#F5EAC9"
          plain
          :style="{
            margin: '8rpx',
            padding: '1rpx 4rpx'
          }"
          @click="onTagClick(item)"
        />
      </view>
    </template>
	  </view>
	  <view class="search-result">
		  <text class="search-result-text">共个{{listData.length}}搜索结果</text>
		  <BaseProductList
		  @onScrollToLower="onScrollToLower"
		  @onRefresh="onRefresh"
		  :isRefreshing="refreshing"
		  :loadStatus="loadStatus"
		  :iconType="iconType"
		  :enableRefresh="false"
		  :enableLoadMore="true"
		  >
			<template #scrollContain>
				<!-- 商品列表 -->
				<CommonProductCol 
					:productList="listData"
					:colNum="2"
					@click="handleProductClick"
				/>
			</template>
		  </BaseProductList>
	  </view>
	 <!-- <view></view> -->
	</view>
		<FilterCriteria 
			v-model:show="showFilter"
			@confirm="handleFilterConfirm"
		/>
	<!-- 清空历史确认弹窗 -->
	<CxModal
	  v-model:show="showClearModal"
	  content="确定要清空历史搜索吗？"
	  @confirm="confirmClear"
	/>
</template>


<script setup name="Search">
import { taskLists, getSearchHistory, deleteSearchHistory } from '@/api/index.js'
import FilterCriteria from './FilterCriteria.vue'
import CommonProductCol from '@/components/common/ProductCol.vue'

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

let searchKey = ref("");
const emit = defineEmits(['close']);
let searchInputRef = ref(null);
let autoFocus = ref(false);
const maxHistory = ref(10);
let showClearModal = ref(false);
const historyList = ref([]);
const showFilter = ref(false);
const currentTab = ref(0);
const filterParams = ref({});

// 模拟用户等级（用于判断是否可抢单）
const userLevel = ref(3) // 假设用户等级为3

// 数据状态
const listData = ref([])
const loading = ref(false)
const refreshing = ref(false)
const page = ref(1)
const pageSize = ref(10)
const noMore = ref(false)
const loadStatus = ref('loadmore') // 'loadmore', 'loading', 'nomore'
const iconType = ref('flower')
let hasMore = true
let isLoading = false // 防止重复触发

const handleFilterConfirm = (params) => {
    filterParams.value = params;
    console.log("筛选条件：",filterParams.value)
    // 重置分页并重新加载
    fetchData(true);
};

const handleProductClick = ({ item }) => {
    jumpWorkDetail(item);
};

// 获取数据
const fetchData = async (isRefresh = false) => {
  if (loading.value && !isRefresh) return
  if (refreshing.value && !isRefresh) return
  if (noMore.value && !isRefresh) return

  if (isRefresh) {
      page.value = 1
      noMore.value = false
      refreshing.value = true
      listData.value = [] // 切换tab时立即清空列表，提供视觉反馈
      loadStatus.value = 'loading'
    } else {
      loading.value = true
      loadStatus.value = 'loading'
    }

    try {
        // 模拟数据
        await new Promise(resolve => setTimeout(resolve, 500)); // 减少模拟延迟以提升体验
        const rawData = Array.from({ length: pageSize.value }).map((_, index) => {
            const id = (page.value - 1) * pageSize.value + index + 1;
            const isNFT = currentTab.value === 0;
            return {
                id: id,
                image: isNFT ? 'https://cdn.uviewui.com/uview/album/1.jpg' : 'https://cdn.uviewui.com/uview/album/2.jpg', 
                artist_name: isNFT ? `数字艺术家${id}` : `非遗传承人${id}`,
                title: isNFT ? `NFT数字藏品 #${id}` : `苏绣实物精品 #${id}`,
                price: (Math.random() * 1000).toFixed(2),
                tag: isNFT ? 'NFT藏品' : '实物藏品',
                original_price: (Math.random() * 2000 + 1000).toFixed(2),
                view_count: Math.floor(Math.random() * 10000),
                is_liked: Math.random() > 0.5
            };
        });

        // 模拟简单的排序逻辑
        if (filterParams.value.sort === 'price_asc') {
            rawData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (filterParams.value.sort === 'price_desc') {
            rawData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        } else if (filterParams.value.sort === 'most_liked') {
             rawData.sort((a, b) => b.view_count - a.view_count);
        }

    // 映射数据以适配 ProductCol 组件
    const newData = rawData.map(item => ({
        ...item,
        image: item.image || item.cover || '', 
        artist: item.artist_name || item.author || '未知绣娘',
        title: item.title || item.name || '',
        description: item.price || '0', 
        originalPrice: item.original_price || '0',
        price: item.view_count || '0', // 围观人数
        favoriteType: item.is_liked ? 'heart-fill' : 'heart'
    }));

    // 如果没有数据，且是第一页，添加一些模拟数据用于展示效果（如果需要）
    // if (newData.length === 0 && page.value === 1) { ... }

    if (newData.length < pageSize.value) {
      noMore.value = true
	  loadStatus.value = 'nomore'
    } else {
		loadStatus.value = 'loadmore'
	}

    if (isRefresh) {
      listData.value = newData
	  uni.stopPullDownRefresh()
    } else {
      listData.value = [...listData.value, ...newData]
    }

    page.value++
  } catch (err) {
	loadStatus.value = 'loadmore'
    console.error('数据加载失败:', err)
	  uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

// 下拉刷新
const onRefresh = () => {
  if (refreshing.value) return
  fetchData(true)
}

// 上拉加载更多
const onScrollToLower = () => {
  if (!loading.value && !noMore.value) {
    fetchData()
  }
};
const jumpWorkDetail = (item)=>{
  uni.navigateTo({
    url: `/pages-xn/collection-detail/index?id=${item.id}`
  })
};
// 抢单按钮点击事件
const handleGrab = (item) => {
  if (item.rush_status !=1) {
    uni.showToast({ title: '等级不足，无法抢单', icon: 'none' })
    return
  }
   uni.navigateTo({
   	url: `/pages-xn/my/deposit?id=${item.id}`
   })
}

const confirmClear = async () => {
  try {
      const res = await deleteSearchHistory({type:2}); // type:2表示清空所有历史
      if (res.code === 200) {
          historyList.value = [];
          showClearModal.value = false;
          uni.showToast({
            title: '搜索历史已清空',
            icon: 'success'
          });
      } else {
          uni.showToast({ title: res.msg || '清空失败', icon: 'none' });
      }
  } catch (error) {
      console.error('清空历史失败', error);
      uni.showToast({ title: '请求异常', icon: 'none' });
  }
};
const clearHistory = () => {
	showClearModal.value = true;
};

// 点击标签
const onTagClick = (keyword) => {
  // console.log('点击了搜索词：', keyword)
  searchKey.value = keyword;
  // 点击标签搜索不需要手动保存历史，由后端记录
  // fetchData(true);
};
const onCancel = ()=>{
	emit('close');
};

const onSearch = (value)=> {
	const keyword = searchKey.value || value;
	if (!keyword) {
		uni.showToast({ title: '请输入搜索内容', icon: 'none' })
		return
	}
	// console.log("搜索关键字",searchKey.value);
	// 搜索时由后端自动记录历史，前端只需刷新历史列表（可选）
    fetchData(true).then(() => {
        // 搜索成功后重新加载历史记录，以显示最新的
        // loadHistory();
    });
};

// 防抖搜索
const debouncedSearch = useDebounce(() => {
    if (searchKey.value) {
        onSearch(searchKey.value);
    }
}, 1200);

// 监听搜索词变化
watch(searchKey, (newVal) => {
    if (newVal) {
		console.log("搜索",newVal)
       //  debouncedSearch();
    }
});

// 监听 Tab 切换
watch(currentTab, () => {
    fetchData(true);
});

const loadHistory = async () => {
    try {
        const res = await getSearchHistory();
        if (res.code === 200) {
             // 假设后端返回的数据结构是 { data: ['keyword1', 'keyword2'] } 或 { data: { lists: [] } }
             // 根据实际情况调整，这里假设直接返回字符串数组或对象包含数组
             // 如果接口返回的是对象列表 { id, keyword }，需提取 keyword
             const list = res.data || []; 
             historyList.value = Array.isArray(list) ? list : (list.lists || []);
        }
    } catch (error) {
        console.error('获取搜索历史失败', error);
    }
  };
// 移除 saveHistory，因为交由后端处理
// const saveHistory = (keyword) => { ... }

onMounted(() => {
 // loadHistory();
 fetchData();
   nextTick(() => {
      autoFocus.value = true
    })
});
</script>

<style lang="scss" scoped>
:deep(.u-tag--medium){
	line-height: 6rpx;
}
.search-result-text{
	color: rgba(255, 255, 255, .8);
}
.search-result{
	flex: 1;
	overflow: hidden;
}
.modal-btn{
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10rpx;
}
.history-search-container {
	flex-shrink: 0; 
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
	font-size: 30rpx;
  }
.title {
      font-size: 30rpx;
      color: #fff;
      font-weight: bold;
    }
  .tags-container {
	  display: flex;
	  flex-wrap: wrap;
	  align-items: center;
	  overflow-wrap: break-word;
  }
  :deep(.u-tag__text--medium){
    font-size: 18rpx;}
}

.search-bar{
	
}
.search-bar-wrap{
	flex-shrink: 0; 
}
.bell-pic {
  display: flex;
  justify-content: center;
  align-items: center; 
  color: #fff;
  font-size: 28rpx;
}
.tabs-filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10rpx;
  margin-bottom: 20rpx;
}

.tabs-wrapper {
  display: flex;
  gap: 40rpx;
}

.tab-item {
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.6);
  position: relative;
  padding-bottom: 10rpx;
  transition: all 0.3s;
  
  &.active {
    color: #fff;
    font-weight: bold;
    font-size: 32rpx;
  }
  
  .active-line {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40rpx;
    height: 4rpx;
    background: #fff;
    border-radius: 2rpx;
  }
}

.filter-icon {
  padding: 10rpx;
}

.search-wrap{
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	background: 
	url("@/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr auto;
	padding: 20rpx;
	box-sizing: border-box;
}		
	
</style>