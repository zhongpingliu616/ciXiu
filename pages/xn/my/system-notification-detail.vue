<template>
	<view class="page-wrap index">
	<LayoutNavigation :title="title" />
		<view class="page-content">
			<view class="notice-container">
			    <u-card
			      :border="false"
			      :show-head="false"
			      :show-foot="false"
			      :padding="24"
				  margin="0"
			      :border-radius="16"
			      :shadow="true"
			      class="notice-card"
			    >
			      <template #body>
			        <!-- 标题 -->
			        <view class="title">
			          {{noticeDetailContent.title}}
			        </view>
			    
			        <!-- 日期 -->
			        <view class="date">
			          {{ noticeDetailContent.create_time }}
			        </view>
			    
			        <!-- 内容主体 -->
			        <view class="content" v-html="noticeDetailContent.content">
									          
			        </view>
			      </template>
			    </u-card>
			  </view>
		</view>
	 <view></view>
	</view>
</template>


<script setup name="sys-model">
const { proxy } = getCurrentInstance();
const safeTopValue = (proxy.$safeAreaInfo.top + 80) +'rpx';
import { messageDetails } from '@/api/index.js'
let title = ref("系统通知详情");
let noticeDetailContent = ref({});
onLoad( async (options)=>{
	messageDetails({ id: options.id }).then(res=>{
		if(res.code === 200){
			noticeDetailContent.value = res?.data?.list || {};
		} else {
			uni.showToast({
				title: res.msg || '数据加载失败',
				icon: 'none'
			});
		}
	})
});
</script>

<style lang="scss" scoped>
.content{
	// color: #666;
	// font-size: 28rpx;
}
.title{
	color: $app-main-dark;
}
.date{
	margin: 12rpx 0;
	color: #ccc;
	font-size: 24rpx;
}
.notice-card {
  background-color: #fff;
  margin: 30rpx auto;
}
.notice-container {
  max-height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
}
.page-wrap{
	 display: grid;
	  grid-template-rows: v-bind(safeTopValue) 1fr 120rpx;
}		
	
</style>