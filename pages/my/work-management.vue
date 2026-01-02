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
				     <keep-alive>
				       <component :is="currentWork" />
				     </keep-alive>
				   </view>
			</view>
		</view>
	 <view></view>
	</view>
</template>
<script setup name="workManagement">
import Completed from '../../components/work-management/Completed.vue'
import Unfinished from '../../components/work-management/Unfinished.vue'
const componentMap = {
  Completed,
  Unfinished
};
let title = ref("作品管理");	
let defaultWork = ref('Unfinished');
let currentWorkIndex = ref(0);
let workLabel = ref([
				{ name: '已完成作品',rolse: "Completed" },
				{ name: '未完成作品',rolse: "Unfinished" }
			]);
const currentWork = computed(()=>{
	const comRole = componentMap[currentWorkIndex.value==1?"Unfinished":"Completed"];
	return  comRole
})
</script>

<style lang="scss" scoped>
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
  height: 80vh;
}
.page-wrap{
	background: 
	url("/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr 0rpx;
}		
	
</style>