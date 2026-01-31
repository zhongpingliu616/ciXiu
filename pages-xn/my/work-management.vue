<template>
	<view class="page-wrap work-management">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<CxTabs
			 :tabItems="workLabel"
			 :scrollable="false"
			 lineHeight="0"
			 lineWidth="0"
			 :itemStyle="{
				 paddingLeft: '0rpx',
				 paddingRight: '0rpx',
			 }"
			 lineColor="rgba(244, 229, 188, 1)"
			 v-model="currentWorkIndex"
			 class="work-tabs"
			 @changeTab="changeTab"
			 >
			 <template #tabItem="{ item, index }">
			     <view
			       class="tab-item"
			       :class="{ active: currentWorkIndex === index }"
				   :style="{
						 color:'rgba(255, 255, 255, 1)'
					 }"
			     >
			       <text class="tab-text">
			         {{ item.name }}
			       </text>
			     </view>
			   </template>
			</CxTabs>
			<view class="order-list">
				 <view class="order-container">
					 <!-- swiper 内容区 -->
					<!-- <swiper
					class="content-swiper"
					:current="swiperCurrent"
					@animationfinish="onSwiperFinish"
					>
						<swiper-item v-for="(item, index) in workLabel" :key="index">
							<view class="tab-content">
								<Completed  v-if="index ==0"/>
								<Unfinished v-else />
							</view>
						</swiper-item>
					</swiper> -->
				<!-- #ifdef APP-PLUS -->
					<component :is="currentWork" />
				<!-- #endif -->
				<!-- #ifdef H5 -->
					<keep-alive>
				       <component :is="currentWork" />
				     </keep-alive>
				<!-- #endif -->
				   </view>
			</view>
		</view>
	 <view></view>
	</view>
</template>
<script setup name="workManagement">
const { proxy } = getCurrentInstance();
const safeTopValue = (proxy.$safeAreaInfo.top + 80) +'rpx';
import Completed from '@/components/xn/work-management/Completed.vue'
import Unfinished from '@/components/xn/work-management/Unfinished.vue'
const componentMap = {
  Completed,
  Unfinished
};
let title = ref("作品管理");	
let defaultWork = ref('Unfinished');
let currentWorkIndex = ref(0);
const swiperCurrent = ref(0); 
let workLabel = ref([
				{ name: '已完成作品',rolse: "Completed", component: Completed },
				{ name: '未完成作品',rolse: "Unfinished", component: Unfinished }
			]);
const currentWork = computed(()=>{
	const comRole = componentMap[currentWorkIndex.value==1?"Unfinished":"Completed"];
	return  comRole
})
const changeTab = ({index}) => {
  swiperCurrent.value = index;
}
// const onSwiperTransition = (e) => {
//   swiperCurrent.value = e.detail.current;
// };

const onSwiperFinish = (e) => {
  swiperCurrent.value = e.detail.current;
  currentWorkIndex.value = e.detail.current;
};
</script>

<style lang="scss" scoped>
.content-swiper {
  height: 100%;
}

.tab-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 60rpx;
  color: #999;
  font-size: 28rpx;
  background: transparent;
  transition: all 0.25s;
}

.tab-item.active {
  color: #fff;
  font-weight: 600;
  background: linear-gradient(to bottom, #FC7D59, #F82C1E);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  transform: scale(1.01);
  border: 2rpx solid $app-border-color;
}

.tab-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 8rpx;
}

.tab-text {
  white-space: nowrap;
}
	

.work-tabs{
	border-radius: 50rpx;
	border: 2rpx solid $app-border-color;
}
.order-container {
  height: 85vh;
}
.page-wrap{
	background: 
	url("/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: v-bind(safeTopValue) 1fr 0rpx;
}		
	
</style>