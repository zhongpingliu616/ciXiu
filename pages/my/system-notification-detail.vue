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
			      :border-radius="16"
			      :shadow="true"
			      class="notice-card"
			    >
			      <template #body>
			        <!-- 标题 -->
			        <view class="title">
			          这里是系统通知标题
			        </view>
			    
			        <!-- 日期 -->
			        <view class="date">
			          2025-11-27
			        </view>
			    
			        <!-- 内容主体 -->
			        <view class="content">
			          <!-- 1. 新增功能 -->
			          <view class="section">
			            <text class="section-title">1. 新增功能</text>
			            <view class="item">
			              <text class="label">核心价值：</text>直接说明用户收益
			            </view>
			            <view class="item">
			              <text class="label">使用场景：</text>明确适用场景
			            </view>
			            <view class="item">
			              <text class="label">操作入口：</text>标注具体路径
			            </view>
			          </view>
			    
			          <!-- 2. 优化提升 -->
			          <view class="section">
			            <text class="section-title">2. 优化提升</text>
			            <view class="item">
			              <text class="label">优化亮点：</text>量化提升效果
			            </view>
			            <view class="item">
			              <text class="label">优化前痛点：</text>呼应用户既往困扰
			            </view>
			          </view>
			    
			          <!-- 总结 -->
			          <view class="summary">
			            本次升级聚焦‘效率提升 + 安全加固’，新增3项实用功能，优化操作流程，修复已知问题，让使用更顺畅、更安心。
			          </view>
			        </view>
			      </template>
			    </u-card>
			  </view>
		</view>
	 <view></view>
	</view>
</template>


<script setup name="model">
let title = ref("系统通知详情");	

onLoad((options)=>{
	console.log("页面参数",options)
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
	  grid-template-rows: 80rpx 1fr auto;
}		
	
</style>