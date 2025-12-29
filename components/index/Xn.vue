<template>
<view class="collection-list">
	<CommonTitleList
	  title="藏品列表"
	  moreUrl="/pages/collection/list"
	>
	  <view class="collection-content">
		  <CxScrollView
			class="list"
			ref="cxScrollViewRef"
			:list="collectionList"
			:config="{
			  direction: 'x',
			  visibleCount: 3,
			  gap:'10rpx'
			}"
			@click="collectionItemClick"
		  > 
			 <template #item="{item}">
				 <view class="collection-item">
					   <image class="collection-item-img" mode="widthFix" :src="item.src"></image>
				 </view>
			</template>
		  </CxScrollView>
	  </view>
	</CommonTitleList>
</view>
<view class="portfolio">
	<CxTabs
	 :tabItems="workLabel"
	 :scrollable="true"
	 lineHeight="4"
	 lineWidth="28"
	 lineColor="rgba(244, 229, 188, 1)"
	 :activeStyle="{
		 color:'rgba(255, 255, 255, 1)'
	 }"
	 v-model="currentWorkIndex"
	 />
</view>
<view class="portfolio-list">
	<keep-alive>
	  <component :is="currentWork" />
	</keep-alive>
</view>
</template>

<script setup name="IndexXn">
import WorkAllXn from '../../components/index/WorkAllXn.vue'
import workMiaoXn from '../../components/index/workMiaoXn.vue'
import workDongXn from '../../components/index/workDongXn.vue'
import workCustomXn from '../../components/index/workCustomXn.vue'
const componentMap = {
  WorkAllXn,
  workMiaoXn,
  workDongXn,
  workCustomXn
};
let cxScrollViewRef = ref();
let currentWorkIndex = ref(0);
let workLabel = ref([
				{ name: '全部',rolse: "WorkAllXn" },
				{ name: '苗绣',rolse: "workMiaoXn" },
				{ name: '侗绣',rolse: "workDongXn" },
				{ name: '定制款',rolse: "workCustomXn" }
			]);
const collectionList = [
		{ src: '/static/images/index/collection-1.png' },
		{ src: '/static/images/index/collection-2.png'},
		{ src: '/static/images/index/collection-1.png'},
		{ src: '/static/images/index/collection-2.png'},
		{ src: '/static/images/index/collection-2.png'},
		{ src: '/static/images/index/collection-1.png'},
		{ src: '/static/images/index/collection-2.png'}
	];
const currentWork = computed(()=>{
	const comRole = componentMap[workLabel.value[currentWorkIndex.value].rolse];
	return  comRole
})
const collectionItemClick = ({index,item})=>{
	console.log("藏品列表点击",index, item);
};
</script>

<style lang="scss" scoped>
.portfolio{
	margin-top: 40rpx;
}
.collection-list{
	margin-top: 40rpx;
}
::v-deep{
	.cx-scroll-item:nth-child(3n + 1){
		.collection-item{
			border-top-left-radius: 20rpx;
			border-bottom-left-radius: 20rpx;
		}
		
	}
	
	.cx-scroll-item:nth-child(3n){
		.collection-item{
			border-top-right-radius: 20rpx;
			border-bottom-right-radius: 20rpx;
		}
	}	
}
.collection-item{
	border: 4rpx solid $app-active-text;
	box-sizing: border-box;
	overflow: hidden;
	background-color: #f5f5f5;
	font-size: 0;
}
.collection-item-img{
	width: 100%;
	display: inline-block;
	
}
</style>