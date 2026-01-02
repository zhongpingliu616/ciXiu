<template>
	<view class="page-wrap collection-detail" :style="{
		gridTemplateRows: workType=='NftDetail'&&'80rpx 1fr 120rpx'
	}">
	<LayoutNavigation :title="title" > 
		<template v-if="workType=='NftDetail'" #right>
			<up-icon name="share-square" size="48rpx" color="#fff" @click="onShare" />
		</template>
	</LayoutNavigation>
		<view class="page-content">
			<view class="current-works">
				<up-image class="works-image" width="680rpx" height="700rpx" src="https://cdn.uviewui.com/uview/album/1.jpg"></up-image>
			</view>
			<view class="xiuniang-information">
				<keep-alive>
				  <component :is="currentDetail" />
				</keep-alive>
			</view>
		</view>
		<view></view>
	</view>
</template>

<script setup name="detail-index">NftDetail
import CollectionDetail from '@/components/workDetail/CollectionDetail.vue'
import NftDetail from '@/components/workDetail/NftDetail.vue'
let title =ref("作品详情");
let avatarUrl=ref('https://via.placeholder.com/80');
let workType = ref("NftDetail");
const componentMap = {
  CollectionDetail,
  NftDetail
};
const currentDetail = computed(()=>{
	const comRole = componentMap[workType.value];
	return  comRole
})
const onShare = ()=>{
      console.log('分享按钮被点击');
    }
onLoad(({workId,workType})=>{
	 console.log('接收到的参数:', workId,workType);
});
</script>

<style lang="scss" scoped>

.works-image{
	border: 4rpx solid $app-border-color; 
	border-radius: 48rpx;
	overflow: hidden;
}
.current-works{
	display: flex;
  align-items: center;
  justify-content: center;  
}	
.page-wrap{
	background:url("/static/images/collection-detail/collection-detail-top-bg.png") no-repeat center top/contain, 
	url("/static/images/index/bg.png") no-repeat center/cover;
	grid-template-rows: 80rpx 1fr 0rpx;
}	
</style>