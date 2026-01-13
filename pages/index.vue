<template>
	<view class="page-wrap index">
		<view :style="{
				  paddingTop: $safeAreaInfo.top +'rpx'
			  }"></view>
		<!-- <LayoutNavigation :title="title" /> -->
		<view class="page-content">
			<up-row customStyle="margin-bottom: 10px">
				  <up-col :span="showRoleTabs ? 5 : 0" v-if="showRoleTabs">
					  <view class="tabs-wrap">
						  <BaseRolseTabs
							:tabItems="topTabItems"
							:lineBg="lineBg"
							:activeStyle="activeStyle"
							:inactiveStyle="inactiveStyle"
							@changeTab="changeRole"
						  ></BaseRolseTabs>
					  </view>
				  </up-col>
				  <up-col :span="showRoleTabs ? 5 : 10">
					  <view class="search-bar">
						  <CxSearch
							 placeholder="输入搜索内容"
							@focus="showSearch"
						  />
					  </view>
				  </up-col>
				  <up-col span="2">
					  <view class="bell-pic">
						  <view class="icon-wrapper" @tap="seeSysNotice">
						    <up-icon size="58rpx" color="#fff" name="bell" />
						    <up-badge :isDot="hasSysNotice" class="badge-dot" />
						  </view>
					  </view>
				  </up-col>
			  </up-row>
			  <view class="banner-swiper">
				  <CxSwiperUni
				    :list="swiperListUni"
				  	swiperHeight="280rpx"
				  	:config="{
				  		autoplay:true,
						indicatorActiveColor: 'rgba(255,255,255,.6)'
				  	}"
				  	@change="bannerChange"
				  >
				  </CxSwiperUni>
			  </view>
			 <keep-alive>
			   <component :is="currentRole" @showSearch="showSearch" />
			 </keep-alive>
		</view>
	 <LayoutCustomBarXn v-if="userStore.currentRole=='XN'" />
	 <LayoutCustomBarGz v-else> </LayoutCustomBarGz>
	</view>
  <keep-alive>
		<up-popup :show="showSearchPageXn" bgColor="#691e23" mode="right" :duration="100" safeAreaInsetTop customStyle="width: 750rpx;">
			<XnIndexSearch @close="closeSearch"></XnIndexSearch>
		</up-popup>
  </keep-alive>
</template>

<script setup>
import { useLoginStore } from '@/stores/userLogin'
import IndexXn from '@/components/xn/index/Xn.vue'
import IndexGz from '@/components/gz/index/Gz.vue'
import { getBannerList,messageLists} from '@/api/index.js'
const { proxy } = getCurrentInstance();
const safeTopValue = proxy.$safeAreaInfo.top +'rpx'
const componentMap = {
  IndexXn,
  IndexGz
};
const swiperListUni = ref([]);

	
const userStore = useLoginStore();
let bannerCurrent = ref(1);

let collectionCurIndex = ref(0);
let title = ref("1200");
let tabIndex = ref(0);
let hasSysNotice  = ref(false);
let messageListsData = ref([]);
const lineBg = ref('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAASCAMAAAA0cZ07AAAA9lBMVEUAAAD//6r//7//1Kr//6r//9T/5rPo0aLo0bno6KLo6Lnt26Tt27bz26rz4bDz4bbz57z03q704LP047nz2J7z3Kb02J703Kj05r/25sH26srz153z3Kf05b706sj04bH04bH04rX04rb04LL047X147j03q/04K/04bP04bT047fz157z26bz3Kf05sH06sjz2J7z2Z7z26Xz3Kj05sH06sn15r/z2J7z2J/z2aDz2aHz2qLz2qPz2qTz26Xz26bz3Kf04LD04LH04bL04bT04rX04rb15sD158H158L158P16MT16MX16cX16cb16cf16sj16smb3zkwAAAAN3RSTlMAAwQGBgYKCwsLCw4OKioqKnV1dZCQkJCQkJCRkZGRoKGhoaKi4uPj4+Pj7u7u7u7v7+/v7+/vMgiCywAAAM5JREFUOMtjYMALmJgYKAFsbBRpZ2amSDs/P0XahYQo0c2poclFwHci2uZQYGFpaWVtY2unIwrzsbyziyKUySqp5+nl7ePr5x8QEAgB+lKsDCLm5uja7R3EwTrYFZycXVyVOMAcCXcPdO2BgVIMhti0GzOyMfMKqjmCtLupCvOzsDGaYdNuil27LiM3M5+gOkS7lrAAKw927foM0ti0y2A6XhabdjkGZjEDdO1GMrCgU3Z2UYEHnQm6dlM5VkojjpbJhtJES2GWoTDDEiouANDFSl0mbzP2AAAAAElFTkSuQmCC');
const activeStyle = ref({
			color: '#FFF'
		});
const inactiveStyle = ref({
			color: '#CCBCBC'
		});
const topTabItems = ref([
			{ name: '公众端',rolse: "IndexGz" },
			{ name: '绣娘端',rolse: "IndexXn"}
		]);
		// cxScrollViewRef.value.scrollToNext();
let tokenXn = userStore.userInfoXn?.token || uni.getStorageSync('tokenXn');
let tokenGz = userStore.userInfoGz?.token || uni.getStorageSync('tokenGz');
let showSearchPageXn = ref(false);
const showRoleTabs = ref(false); // 控制顶部角色切换标签的显示

const seeSysNotice = ()=>{
	// if(!hasSysNotice.value) return;
	uni.navigateTo({
		url: "/pages/xn/my/system-notification",
		success: (res) => {
			res.eventChannel.emit('sendMessageDatas', { messageListsData: messageListsData.value });
		}
	});
};
const closeSearch = ()=>{
	showSearchPageXn.value = false;
};
const showSearch = () => {
	showSearchPageXn.value = true;
};

const currentRole = computed(()=>{
	const comRole = componentMap[topTabItems.value[tabIndex.value].rolse];
	return  comRole
});
const changeRole = ({index, item})=>{
	tabIndex.value = index;
	// 这里不需要再 check token 了，因为进入首页时已经 check 过了，且如果是单角色登录，Tabs 是隐藏的
};
const bannerChange = ({ index, item })=>{
	bannerCurrent.value = index;
};

const getBannerListFunction = async () => {
  try {
  	const res = await getBannerList();
	if(res.code === 200 && res.data.lists) {
		swiperListUni.value = res?.data?.lists?.map(item => ({
			...item,
			type: 'image',
			src: item.image, // 假设接口返回的是 image 字段，如果不是请调整
			name: item.name || '',
			id: item.id
		}));
	}
  } catch (e) {
  	console.error('获取Banner失败', e);
  }
};
const getMessageListFunction = async () => {
  try {
  	const res = await messageLists();
	if(res.code === 200 && res?.data?.lists) {
		messageListsData.value = res?.data?.lists || [];
		const unreadMessages = res?.data?.lists.filter(msg => (msg.is_read!=1)); // 假设 is_read 字段表示是否已读，1表示已读 2表示未读
		hasSysNotice.value = unreadMessages.length > 0;
	} else {
		hasSysNotice.value = false;
	}
  } catch (e) {
  	console.error('获取消息列表失败', e);
  	hasSysNotice.value = false;
  }
};
onMounted(() => {
  getBannerListFunction();
  getMessageListFunction();
});
onLaunch(() => {
  
})
onShow(() => {
	tokenXn = proxy.$globalUserInfoXn?.token || uni.getStorageSync('tokenXn');
	tokenGz = proxy.$globalUserInfoGz?.token || uni.getStorageSync('tokenGz');
	const currentRole = userStore.currentRole || uni.getStorageSync('currentRole');

	if (!tokenGz && !tokenXn) {
		uni.reLaunch({
			url: '/pages/my/login'
		})
		return;
	}

	// 根据角色设置显示的 Tab
	if (currentRole === 'XN') {
		// 绣娘端，对应 index 1
		tabIndex.value = 1;
		showRoleTabs.value = false; // 隐藏切换
	} else if (currentRole === 'gz') {
		// 公众端，对应 index 0
		tabIndex.value = 0;
		showRoleTabs.value = false; // 隐藏切换
	} else {
		// 默认情况或者双角色（如果有）
		if (tokenXn) tabIndex.value = 1;
		else tabIndex.value = 0;
		showRoleTabs.value = true;
	}
	
	// 如果需要根据 token 强制校验
	if (tabIndex.value === 1 && !tokenXn) {
		// 只有公众端 token 但想看绣娘端 -> 切回公众端
		tabIndex.value = 0;
	} else if (tabIndex.value === 0 && !tokenGz) {
		tabIndex.value = 1;
	}
})
</script>

<style lang="scss" scoped>
.banner-swiper{
	::v-deep{
		.uni-swiper-dot-active {
				width: 15rpx;
		}
	}
}
// .chevron-line {
//   width: 100%;
//   height: 10rpx;
//   background:
// 	repeating-linear-gradient(
// 	  45deg,
// 	  #1864B1 0 4rpx,
// 	  transparent 4rpx 8rpx
// 	),
// 	repeating-linear-gradient(
// 	  -45deg,
// 	  #1864B1 0 4rpx,
// 	  transparent 4rpx 8rpx
// 	);
//   background-size: 16rpx 16rpx;
// }

.swiper-item {
  width: 100%;
  height: 100%;
}
.icon-wrapper {
  position: relative;
}

.badge-dot {
  position: absolute;
  top: 6rpx;
  right: 6rpx;
}
.bell-pic {
  display: flex;
  justify-content: center;
  align-items: center; 
}
.page-content{
	
}
.page-wrap{
	grid-template-rows: v-bind(safeTopValue) 1fr 40rpx;
}
.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>
